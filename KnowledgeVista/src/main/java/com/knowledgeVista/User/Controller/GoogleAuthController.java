package com.knowledgeVista.User.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.knowledgeVista.SocialLogin.SocialKeyRepo;
import com.knowledgeVista.SocialLogin.SocialLoginKeys;
import com.knowledgeVista.User.Muser;
import com.knowledgeVista.User.MuserRoles;
import com.knowledgeVista.User.Repository.MuserRepositories;
import com.knowledgeVista.User.Repository.MuserRoleRepository;
import com.knowledgeVista.User.SecurityConfiguration.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
public class GoogleAuthController {

	@Autowired
    private  MuserRepositories muserRepository;
	
	 @Autowired
	 private JwtUtil jwtUtil;
		@Autowired
		private MuserRoleRepository muserrolerepository;
		@Autowired
		private SocialKeyRepo socialkeysrepo;
	 
    private final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

public ResponseEntity<?> getSocialLoginKeys(String institutionName,String Provider,String token) {
	try {
		   if (!jwtUtil.validateToken(token)) {
	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	         }

	         String role = jwtUtil.getRoleFromToken(token);
	         if("SYSADMIN".equals(role)) {
	        	 SocialLoginKeys keys= socialkeysrepo.findByInstitutionNameAndProvider(institutionName, Provider);
	        	 if(keys==null) {
	        		 return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	        	 }
	        	 return ResponseEntity.ok(keys);
	         }else {
	        	 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	         }
	}catch(Exception e) {
		e.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}
 
}
public ResponseEntity<?> saveOrUpdateSocialLoginKeys(SocialLoginKeys loginKeys,  String token) {
	
try {
    // Validate JWT token
    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String email = jwtUtil.getUsernameFromToken(token);
Optional<Muser>opuser=muserRepository.findByEmail(email);
    if(opuser.isPresent()) {
    	Muser user=opuser.get();
    	String role=user.getRole().getRoleName();
    	if ("SYSADMIN".equals(role) ||"ADMIN".equals(role)){
    		
        SocialLoginKeys existingKeys = socialkeysrepo.findByInstitutionNameAndProvider(user.getInstitutionName(), loginKeys.getProvider());
        if (existingKeys != null) {
            existingKeys.setClientid(loginKeys.getClientid());
            existingKeys.setClientSecret(loginKeys.getClientSecret());
            existingKeys.setRedirectUrl(loginKeys.getRedirectUrl());
            socialkeysrepo.save(existingKeys);
            return ResponseEntity.ok("Social login keys updated successfully");
        } 
        // If keys do not exist, create a new entry (POST operation)
        else {
            socialkeysrepo.save(loginKeys);
            return ResponseEntity.ok("Social login keys created successfully");
        }
    }else {
    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    }else {
    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }}catch(Exception e) {
	e.printStackTrace();
	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
}
}

public String getClientidforgoogle(String institution,String Provider) {
	return socialkeysrepo.findClientIdByInstitutionNameAndProvider(institution, Provider);
}
   public Map<String, String> getidToken(String authCode,String institutionName,String provider) {
	   try {
		   SocialLoginKeys keys=socialkeysrepo.findByInstitutionNameAndProvider(institutionName, provider);
		   if(keys==null) {
			   return null;
		   }
       Map<String, String> tokenRequest = new HashMap<>();
       tokenRequest.put("code", authCode);
       tokenRequest.put("client_id", keys.getClientid());
       tokenRequest.put("client_secret", keys.getClientSecret());
       tokenRequest.put("redirect_uri", keys.getRedirectUrl());
       tokenRequest.put("grant_type", "authorization_code");

       RestTemplate restTemplate = new RestTemplate();
       Map<String, Object> tokenResponse = restTemplate.postForObject("https://oauth2.googleapis.com/token", tokenRequest, Map.class);

       if (tokenResponse != null && tokenResponse.containsKey("id_token")) {
    	   Map<String, String> idAndAccess = new HashMap<>();
           String idToken = (String) tokenResponse.get("id_token");
           String accessToken = (String) tokenResponse.get("access_token");
           idAndAccess.put("idToken", idToken);
           idAndAccess.put("accessToken", accessToken);
           return idAndAccess;
   }
       return null;
	   }catch(Exception e) {
		   e.printStackTrace();
		   return null;
	   }
   }
	   

    public ResponseEntity<?> googleLogin( Map<String, String> tokenMap) {
    	 try {
    	String authCode = tokenMap.get("authCode");
        String role=tokenMap.get("role");
        String institutionName="";
        String provider="GOOGLE";
        Map<String, String> idAndAccessToken=this.getidToken(authCode,institutionName,provider);
        if(idAndAccessToken== null) {
       	 return ResponseEntity.status(500).body("Error verifying token");
       }
String idToken= idAndAccessToken.get("idToken");
String AccessToken=idAndAccessToken.get("accessToken");
System.out.println("access"+AccessToken);
       
            RestTemplate restTemplate = new RestTemplate();
            String url = GOOGLE_TOKEN_URL + idToken;
            Map<String, Object> googleResponse = restTemplate.getForObject(url, Map.class);
            System.out.println("response="+googleResponse);
            if (googleResponse.containsKey("email")) {
                String email = googleResponse.get("email").toString();
                Optional<Muser>opuser=muserRepository.findByEmail(email);

                if(opuser.isPresent()) {
                	Muser user=opuser.get();
                	 Map<String, Object> responseBody = new HashMap<>();
                	 String Role=user.getRole().getRoleName();
		                String jwtToken = jwtUtil.generateToken(email,Role);
	                    user.setLastactive(LocalDateTime.now());
	                    if(user.getIsActive().equals(false)) { 
	                    	Map<String, Object> response = new HashMap<>();
	                    	response.put("message", "In Active");
	                    	response.put("Description",user.getInactiveDescription());
	                	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);}
	                   
	                    muserRepository.save(user);
		                responseBody.put("token", jwtToken);
		                
		                responseBody.put("message", "Login successful");
		                responseBody.put("role", user.getRole().getRoleName());
		                responseBody.put("email", user.getEmail());
		                responseBody.put("userid",user.getUserId());
		                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(responseBody);
                }else {
                String name = googleResponse.get("name").toString();

                
                Muser muser = new Muser();
                muser.setIsActive(true);
                muser.setEmail(email);
                muser.setUsername(name);
                String existingInstitute =muserRepository.getInstitution("ADMIN");
     	       if(existingInstitute.isEmpty()) {
                	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("institution not Found");
                }
     	      muser.setInstitutionName(existingInstitute);
     	     Optional<MuserRoles> oproleUser = muserrolerepository.findByRoleName(role);
	            if(oproleUser.isPresent()) {
	            	MuserRoles roleuser=oproleUser.get();
                muser.setRole(roleuser);
	            }
               Muser user= muserRepository.save(muser);

            	 Map<String, Object> responseBody = new HashMap<>();
            	 String Role=user.getRole().getRoleName();
	                String jwtToken = jwtUtil.generateToken(email,Role);
                    user.setLastactive(LocalDateTime.now());
                    muserRepository.save(user);
	                responseBody.put("token", jwtToken);
	                
	                responseBody.put("message", "Login successful");
	                responseBody.put("role", user.getRole().getRoleName());
	                responseBody.put("email", user.getEmail());
	                responseBody.put("userid",user.getUserId());
	                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(responseBody);
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid token");
            }

        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(500).body("Error verifying token: " + e.getMessage());
        }
    }
}