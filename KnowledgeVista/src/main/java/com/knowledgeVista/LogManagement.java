package com.knowledgeVista;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knowledgeVista.Email.Mailkeys;
import com.knowledgeVista.Email.MailkeysRepo;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@RestController
@CrossOrigin
public class LogManagement {
	
//	@Value("${logging.file.name}")
//    private String filePath;
	

		  
	  @Autowired
	  private MailkeysRepo mailkeyrepo;
	  private static final Logger logger = LoggerFactory.getLogger(LogManagement.class);

	  private static final DateTimeFormatter LOG_TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	  
	  @GetMapping("/log/time/{id}")
   	 public ResponseEntity<?> logdetails(@PathVariable int id){
     	   try {
     		   Deque<String> allLines = new LinkedList<>();
     		   String filePath="myapp.log";
     		   String lastLine = null;
     		   LocalDateTime lastLogTime = null;
     		   try (BufferedReader reader = Files.newBufferedReader(Paths.get(filePath))) {
     	            String line;
     	            while ((line = reader.readLine()) != null) {
     	                allLines.addLast(line);
     	                lastLine = line;
     	            }
     	        } catch (IOException e) {
     	            e.printStackTrace();    logger.error("", e);;
     	            
     	        }

     	        if (lastLine == null) {
     	            return ResponseEntity.ok("File is empty");
     	        }
     	        
     	        String lastLineTime = extractTimeFromLog(lastLine);

     	        // Parse the last line time to LocalDateTime
     	        lastLogTime = LocalDateTime.parse(lastLineTime, LOG_TIMESTAMP_FORMATTER);
     	        LocalDateTime lastlinevalue=null;
     	        // Extracting the data and filtering it
     	        List<String> last10MinuteLines = new ArrayList<>();
     	        for (String line : allLines) {
     	        	 String lineTimeStr = extractTimeFromLog(line);
//     	        	 System.out.println("lineTimeStr"+lineTimeStr);
     	        	 
     	        	 if (lineTimeStr != null) {
     	        					 if (lineTimeStr.matches(".*[a-zA-Z].*")) {
//     	        						 System.out.println("value A");
     	        						 if(lastlinevalue!=null) {
     	        						 long minutesDiff = ChronoUnit.MINUTES.between(lastlinevalue, lastLogTime);
     	        						 if (minutesDiff <= id) {
     	            	                     last10MinuteLines.add(line);
//     	            	                     System.out.println("value has a-z  minutesDiff :"+minutesDiff+" line added "+line);
     	        						 } 
     	        						 }
     	        					 }
     	        					 else {
     	                 LocalDateTime lineTime = LocalDateTime.parse(lineTimeStr, LOG_TIMESTAMP_FORMATTER);
     	                 long minutesDiff = ChronoUnit.MINUTES.between(lineTime, lastLogTime);
     	                 if (minutesDiff <= id) {
     	                     last10MinuteLines.add(line);
//     	                     System.out.println("minutesDiff :"+minutesDiff+" line added "+line);
     	                     lastlinevalue=lineTime;    
//     	                     System.out.println(lineTime);
     	                 }
     	        					 }
     	        				
     	        		 }
//     	        		 }
     	             }
//     	            }
     	        
//     	        // Print the last 10 Minutesdata
//     	        for (String line : last10MinuteLines) {
//     	            System.out.println(line);
//     	        }
//     		   String destinationFilePath = lastLineTime.replace(":", ".") + ".log";
     	      String destinationFilePath ="last10line.log";
     		   // Write the last 10 lines to the new file
     	        try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(destinationFilePath))) {
     	            for (String line : last10MinuteLines) {
     	                writer.write(line);
     	                writer.newLine();
     	            }
     	        } catch (IOException e) {
     	            e.printStackTrace();
     	        }
     	        List<String> to = Arrays.asList("cheziangowtham@gmail.com");
     	        List<String> cc = new ArrayList<>(); // No CC
     	        List<String> bcc = new ArrayList<>(); // No BCC
     	        String subject = "Log File";
     	        String body = "Please find the attached log file.";
     	        ResponseEntity<?> response = sendHtmlEmail("sample", to, cc, bcc, subject, body);
     	    	  return ResponseEntity.ok(response); 
     	    
   		 } catch (Exception e) {
   		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
   		                .body("An error occurred while Sending The Mail : " + e.getMessage() );
   		    }
   		
        }
   		
        private String extractTimeFromLog(String logLine) {
            try {
                // Assume the timestamp is the first 19 characters (yyyy-MM-dd HH:mm:ss)
                return logLine.substring(0, 19);
            } catch (IndexOutOfBoundsException e) {
//                System.out.println("Failed to extract time from log: " + logLine);
                return null;
            }
        }
        
        public ResponseEntity<?> sendHtmlEmail(String InstitutionName,List<String> to, List<String> cc, List<String> bcc, String subject, String body) throws MessagingException {
  		  JavaMailSender mailSender = getJavaMailSender();
            if(mailSender==null) {
          	  return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
  		  MimeMessage mimeMessage = mailSender.createMimeMessage();
  	        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
  	        String from= this.getfrom(InstitutionName);
  	        if(from==null) {
  	        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  	        }
             helper.setFrom(from);
  	        if (to != null && !to.isEmpty()) {
  	            helper.setTo(to.toArray(new String[0]));
  	        }

  	        if (cc != null && !cc.isEmpty()) {
  	            helper.setCc(cc.toArray(new String[0]));
  	        }

  	        if (bcc != null && !bcc.isEmpty()) {
  	            helper.setBcc(bcc.toArray(new String[0]));
  	        }

  	        helper.setSubject(subject);
  	        helper.setText(body, true);  
  	        
  	      // Add the file as an attachment
	        if(subject=="Log File") {
//   		   String destinationFilePath = lastLineTime.replace(":", ".") + ".log";
	        String filePath="last10line.log";
	        if (filePath != null && !filePath.isEmpty()) {
	            FileSystemResource file = new FileSystemResource(filePath);
	            if (file.exists()) {
	                helper.addAttachment(file.getFilename(), file);
	            }
	        }
	        }

  	        mailSender.send(mimeMessage);
  	       return ResponseEntity.ok("Mail Sent");
  	    }
  	  public String getfrom(String institution) {
  		  Optional<Mailkeys> opkeys = mailkeyrepo.FindMailkeyByInstituiton(institution);
  		  if(opkeys.isPresent()) {
  			  Mailkeys keys =opkeys.get();
  			  return keys.getEmailid();
  		  } else {
  			    return null;   
  			    }
  	  }
  	  
  	  public JavaMailSender getJavaMailSender() {
  		 List<Mailkeys> opkeys1 = mailkeyrepo.findAll();
  		 
  		 
  		if (!opkeys1.isEmpty()) {
  		    Mailkeys keys = opkeys1.get(0);
  		  JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	        mailSender.setHost(keys.getHostname()); // Set host from Mailkeys
	        mailSender.setPort(Integer.parseInt(keys.getPort())); // Set port
	        
	        mailSender.setUsername(keys.getEmailid()); // Set username (email ID)
	        mailSender.setPassword(keys.getPassword()); // Set password

	        // Optional properties for TLS/SSL, protocol, etc.
	        Properties props = mailSender.getJavaMailProperties();
	        props.put("mail.transport.protocol", "smtp");
	        props.put("mail.smtp.auth", "true");
	        props.put("mail.smtp.starttls.enable", "true");
	        props.put("mail.debug", "true"); // Optional, set to true for debugging
	        
	        return mailSender;
  		    // Do something with firstRow
  		} else {
  	  		  JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
  		        mailSender.setHost("smtp.hostinger.com"); // Set host from Mailkeys
  		        mailSender.setPort(587); // Set port
  		        
  		        mailSender.setUsername("learnhubtechie@meganartech.com"); // Set username (email ID)
  		        mailSender.setPassword("$Meganar1"); // Set password

  		        // Optional properties for TLS/SSL, protocol, etc.
  		        Properties props = mailSender.getJavaMailProperties();
  		        props.put("mail.transport.protocol", "smtp");
  		        props.put("mail.smtp.auth", "true");
  		        props.put("mail.smtp.starttls.enable", "true");
  		        props.put("mail.debug", "true"); // Optional, set to true for debugging
  		    
  			return mailSender;   
  		}
  	  }
  	@RequestMapping("favicon.ico")
    public void favicon() {
        // Respond with nothing or redirect to another resource.
    }
}