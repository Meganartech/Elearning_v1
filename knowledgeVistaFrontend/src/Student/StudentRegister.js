import React, { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import profile from "../images/profile.png";
import "../css/StudentRegister.css";
import "../css/certificate.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import baseUrl from "../api/utils";
import axios from "axios";

const StudentRegister = () => {
  const MySwal = withReactContent(Swal);
  
  const [formData, setFormData] = useState({
    username: "",
    psw: "",
    email: "",
    dob: "",
    phone: "",
    skills: "",
    profile: null,
    countryCode: "+91",
    isActive: true,
  });

  const countrycodelist = [
    '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39',
    '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52',
    '+53', '+54', '+55', '+56', '+57', '+60', '+61', '+62', '+63', '+64', '+65',
    '+66', '+67', '+68', '+69', '+71', '+81', '+82', '+84', '+86', '+90', '+91',
    '+92', '+93', '+94', '+95', '+96', '+98', '+850', '+852', '+853', '+855',
    '+856', '+880', '+886', '+960', '+961', '+962', '+963', '+964', '+965', '+966',
    '+967', '+968', '+970', '+971', '+972', '+973', '+974', '+975', '+976', '+977',
    '+992', '+993', '+994', '+995', '+996', '+998'
  ];

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    dob: '',
    psw: '',
    skills: '',
    confirm_password: '',
    phone: '',
    fileInput: '',
    profile:''
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const dobRef = useRef(null);
  const pswRef = useRef(null);
  const confirmPswRef = useRef(null);
  const skillsRef = useRef(null);
  const phoneRef = useRef(null);
  const countryCodeRef = useRef(null);

  // useEffect(() => {
  //   const hasErrors = Object.values(errors).some(error => !!error) || Object.values(formData).some(value => value === null);
  //   const submitBtn = document.querySelector('.btn.btn-primary');
  //   if (hasErrors) {
  //     submitBtn.disabled = true;
  //   } else {
  //     submitBtn.disabled = false;
  //   }
  // }, [errors, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'username':
        error = value.length < 1 ? 'Please enter a username' : '';
        break;
      case 'skills':
        error = value.length < 1 ? 'Please enter a skill' : '';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
        break;
      case 'dob':
        const dobDate = new Date(value);
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate()); // Min age 8 years
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // Max age 100 years
        error = dobDate <= maxDate && dobDate >= minDate ? '' : 'Please enter a valid date of birth';
        break;
      case 'psw':
        error = value.length < 6 ? 'Password must be at least 6 characters long' : '';
        break;
      case 'confirm_password':
        error = value !== formData.psw ? 'Passwords do not match' : '';
        break;
      case 'phone':
        error = value.length < 10 ? 'Phone number must be at least 10 digits' :
          value.length > 15 ? 'Phone number cannot be longer than 15 digits' :
            /^\d+$/.test(value) ? '' : 'Please enter a valid phone number (digits only)';
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    convertImageToBase64(file)
      .then((base64Data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profile: file,
          base64Image: base64Data,
        }));
          setErrors(prevErrors => ({
            ...prevErrors,
            profile: ''
          }));
      
      })
      .catch((error) => {
        console.error("Error converting image to base64:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  // Check if any required fields are empty or have errors
  let hasErrors = false;
  const requiredFields = ['username', 'skills', 'email', 'dob', 'psw', 'confirm_password', 'phone', 'countryCode'];

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].length === 0 || errors[field]) {
      hasErrors = true;
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: !formData[field] ? 'This field is required' : errors[field]
      }));
    }
  });
  if(!formData.profile){
    hasErrors = true;
    setErrors(prevErrors => ({
      ...prevErrors,
      profile: 'Image is Required'
    }));
  }

  if (hasErrors) {
    scrollToError(); // Scroll to the first error field
    return;
  }
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("psw", formData.psw);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("isActive", formData.isActive);
    formDataToSend.append("profile", formData.profile);
    formDataToSend.append("skills", formData.skills);
    formDataToSend.append("countryCode", formData.countryCode);

    try {
      const response = await axios.post(`${baseUrl}/student/register`, formDataToSend);

      if (response.status === 200) {
        MySwal.fire({
          title: "Welcome to our Family!",
          text: "You have been registered successfully!",
          icon: "success",
          confirmButtonText: "Go to Login",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          } else {
            setFormData({
              username: "",
              psw: "",
              email: "",
              dob: "",
              phone: "",
              skills: "",
              profile: null,
              isActive: true
            });
          }
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: "This email is already registered."
        }));
      } else {
        MySwal.fire({
          title: "Error!",
          text: "An error occurred while registering. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const scrollToError = () => {
    if (errors.username) {
      nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.email) {
      emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.dob) {
      dobRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.psw || errors.confirm_password) {
      pswRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.skills) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.phone) {
      phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (errors.countryCode) {
      countryCodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  useEffect(() => {
    scrollToError();
  }, [errors]);

  return (
   
    <div className='contentbackground' style={{height:"100vh"}}>
       <div className='contentinner' style={{height:"88vh"}}>
      <div className='innerFrame'>
      
      <h2  style={{textDecoration:"underline"}}>Join with us</h2>
        <div className='mainform'>
          <div className='profile-picture'>
            <div className='image-group'>
            {formData.base64Image ? (
                      <img
                        src={formData.base64Image}
                        alt="Selected Image"
                        className="profile-picture"
                      />
                    ) : (
                      <img
                        src={profile}
                        alt="Default Profile Picture"
                        className="prof"
                      />
                    )}
            </div>
            <label htmlFor='fileInput' className='file-upload-btn'>
              Upload
            </label>
            <div className="text-danger">{errors.profile}</div>
            <input
                  type='file'
                  name="fileInput"
                  id='fileInput'
                  className={`file-upload ${errors.fileInput && 'is-invalid'}`}
                  accept='image/*'
                  onChange={handleFileChange}
                />
    
          </div>
             
   
   
 
          <div className='formgroup'>
          
            <div className='inputgrp'>
              <label htmlFor='Name'> Name <span className="text-danger" ref={nameRef}>*</span></label>
              <span>:</span>
            <div> <input
               type="text"
                id='Name'
                value={formData.username}
                onChange={handleChange}
                name="username"
                
                className={`form-control form-control-lg mt-1 ${errors.username && 'is-invalid'}`}
                placeholder="Full Name"
                autoFocus
                required
              />
              <div className="invalid-feedback">
                {errors.username}
              </div></div> 
            </div>
            <div className='inputgrp' ref={emailRef}>
            
              <label htmlFor='email'> Email<span className="text-danger" >*</span></label>
              <span>:</span><div>              <input
                      type="email"
                      autoComplete="off"
                      className={`form-control form-control-lg ${errors.email && 'is-invalid'}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                    <div className="invalid-feedback">
                      {errors.email}
                    </div></div>

            </div>
            <div className='inputgrp'>
              <label htmlFor='skills'> Skills <span className="text-danger" ref={skillsRef}>*</span></label>
              <span>:</span>
            <div> <input
               type="text"
                id='skills'
                value={formData.skills}
                onChange={handleChange}
                name="skills"
                
                className={`form-control form-control-lg mt-1 ${errors.skills && 'is-invalid'}`}
                placeholder="skills"
             
                required
              />
              <div className="invalid-feedback">
                {errors.skills}
              </div></div> 
            </div>

            <div className='inputgrp'>
              <label htmlFor='dob'>Date of Birth<span className="text-danger" ref={dobRef}>*</span></label>
              <span>:</span>
              <div>
              <input
                type="date"
                                    name="dob"
                                    className={`form-control form-control-lg ${errors.dob && 'is-invalid'}`}
                                    placeholder="Starting year"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                   
              />
              <div className="invalid-feedback">
                {errors.dob}
              </div></div>
            </div>

            <div className='inputgrp'>
              <label htmlFor='Password'>Password<span className="text-danger" ref={pswRef}>*</span></label>
              <span>:</span>
              <div>
                <input
                        type="password"
                        name="psw"
                        className={`form-control form-control-lg ${errors.psw && 'is-invalid'}`}
                        value={formData.psw}
                        onChange={handleChange}
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                      />
                      <div className="invalid-feedback">
                        {errors.psw}
                      </div></div>

            </div>

            <div className='inputgrp'>
              <label htmlFor='confirm_password'>Re-type password<span className="text-danger" ref={confirmPswRef}>*</span></label>
              <span>:</span>
              <div>
              <input
                        type="password"
                        name="confirm_password"
                        className={`form-control form-control-lg ${errors.confirm_password && 'is-invalid'}`}
                        id="exampleRepeatPassword"
                        onChange={handleChange}
                        autoComplete="new-password"
                        placeholder="Repeat Password"
                        required
                      />
                      <div className="invalid-feedback">
                        {errors.confirm_password}
                      </div>
                      </div>
            </div>
            <div className='inputgrp '>
              <label htmlFor='CountryCode'> Country Code<span className="text-danger" ref={countryCodeRef}>*</span></label>
              <span>:</span>
            <div>
            <select
        id="countryCode"
        className={`form-control form-control-lg ${errors.countryCode && 'is-invalid'}`}
        placeholder="countryCode"
        name="countryCode"
        value={formData.countryCode} // Set the initial value from formData
        onChange={handleChange}
        required
      >
        {countrycodelist.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select> 
                
                </div>
                </div>
            <div className='inputgrp mb-4'>
              <label htmlFor='Phone'> Phone<span className="text-danger" ref={phoneRef}>*</span></label>
              <span>:</span>
              <div>
             
              <div>

              <input
               type="text"
                id='phone'
                value={formData.phone}
                className={`form-control form-control-lg ${errors.phone && 'is-invalid'}`}
                onChange={handleChange}
                name="phone"
                placeholder="Phone"
                required
              />
              <div className="invalid-feedback">
                {errors.phone}
              </div>
              
              </div>
            </div>
           </div>
       
        </div>
      </div>
      
        <div className='btngrp'>
        <button className={`btn btn-primary `} onClick={handleSubmit}>Register</button>

        </div>
        <div style={{textAlign:"right"}} className="w-100">
          <a className="small" href="/login">
            Already have an account? Login!
          </a>
        </div>
        </div>
      </div>
      </div>
   
  );
};

export default StudentRegister;


