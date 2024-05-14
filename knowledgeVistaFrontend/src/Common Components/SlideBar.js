import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../css/Component.css"

const SlideBar = ({activeLink,setActiveLink}) => {
  const [isvalid, setIsvalid] = useState();
  const [isEmpty, setIsEmpty] = useState();
  const userRole = sessionStorage.getItem("role");
  const navigate = useNavigate();
  useEffect(() => {
   

    fetch('http://localhost:8080/api/v2/GetAllUser')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
          .then(data => {
            setIsEmpty(data.empty);
            setIsvalid(data.valid);
            const type = data.type;
            // data.dataList.map((item, index) => {
              // console.log("key 1"+data.dataList[0].key1);
              // console.log("value 1"+data.dataList[0].key2);
            // });


      sessionStorage.setItem('type',type);
     
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);
  const handleSetActiveLink = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem("activeLink",linkName)
  };
  const handleClick = (link) => {
    
    if(userRole==="ADMIN" || userRole === "TRAINER")
    {
    if((link==="/about" || link==="/admin/dashboard")&& isEmpty)
    {
      handleSetActiveLink(link);
      navigate(link);
    }
    else if ((link==="/about" || link==="/admin/dashboard")&& !isEmpty && !isvalid) 
    {
      handleSetActiveLink(link);
        navigate(link);
    } 
    else if (!isEmpty && isvalid)
     {
      handleSetActiveLink(link);
        navigate(link);
    } 
  } 
  else if(userRole==="USER")
  {
    handleSetActiveLink(link);
    navigate(link);
  }
  };

  return (
    <ul
      className=
         "navbar-nav   sidebar sidebar-dark accordion "
          
      id="accordionSidebar"
    >
      <a href="#" className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon rotate-n-15">
          
          <i className="fa-solid fa-book-open-reader text-dark"></i>
        </div>
        <div className="sidebar-brand-text mx-3 text-dark ">Learn HUB</div>
      </a>

      <hr className="sidebar-divider mb-4" />
     
      {userRole === "ADMIN"  && (
         <li className="nav-item mt-2">
         <a
           className={activeLink === "/admin/dashboard" ? "ActiveLink nav-link" : "nav-link text-muted"}
           href="#"
          
           onClick={() => handleClick("/admin/dashboard")}
         >
           <i className={activeLink === "/admin/dashboard" ? "fa-solid fa-gauge text-light" : "fa-solid fa-gauge text-muted"}></i>
           <span>Dashboard</span>
         </a>
    
       </li>
       )} 
        {userRole === "ADMIN"  && (
       
       <div className={`mt-2 ${activeLink.includes("/course") || activeLink === "/dashboard/course" ? "ActiveLink" : ""}`}>
  <li className="nav-item">
    <a
      className={`nav-link ${activeLink.includes("/course") || activeLink === "/dashboard/course" ? "text-light" : "text-muted"}`}
      href="#"
      onClick={() => {
        setActiveLink("/course");
        const collapseTwo = document.getElementById("collapseTwo");
        if (collapseTwo.classList.contains("show")) {
          collapseTwo.classList.remove("show");
        } else {
          collapseTwo.classList.add("show");
        }
      }}
    >
      <i className={`fa-solid fa-book-open ${activeLink.includes("/course") || activeLink === "/dashboard/course" ? "text-light" : "text-muted"}`}></i>
      <span>Courses</span>
    </a>
  </li>
  <div  style={{width:"100%"}} id="collapseTwo" className={`collapse ml-3 newnav ${activeLink.includes("/course") || activeLink === "/dashboard/course" ? "show" : ""}`} aria-labelledby="headingTwo" data-parent="#accordionSidebar">
    <div style={{width:"100%"}} className="text-light collapse-inner">
      <a className={activeLink === "/course/admin/edit" ? "collapse-item text-light SubActiveLink nav-link mb-2" : "collapse-item text-light mb-2 nav-link "}
        href="#"

        onClick={() => {
          handleClick("/course/admin/edit");
          setActiveLink("/course/admin/edit");
        }}>
        <i className={activeLink === "/course/admin/edit" ? "p-1 fa-solid fa-edit text-light" : "p-1 fa-solid fa-edit text-light"}></i>
        <span>Edit Courses</span>
      </a>

      <a className={activeLink === "/course/addcourse" ? "collapse-item text-light mb-2 SubActiveLink nav-link" : "collapse-item mb-2 text-light nav-link "}
        href="#"
        onClick={() => {
          handleClick("/course/addcourse");
          setActiveLink("/course/addcourse");
        }} >
        <i className={activeLink === "/course/addcourse" ? " p-1 fa-solid fa-plus text-light" : "pl-1 fa-solid fa-plus text-light"}></i>
        <span> Create course</span>
      </a>

      <a className={activeLink === "/dashboard/course" ? "collapse-item text-light SubActiveLink nav-link" : "collapse-item text-light nav-link"}
        href="#"
        onClick={() => {
          handleClick("/dashboard/course");
          setActiveLink("/dashboard/course");
        }}>
        <i className={activeLink === "/dashboard/course" ? " pl-1 fa-solid fa-eye text-light" : " pl-1 fa-solid fa-eye text-light"}></i>
        <span> View Course</span>
      </a>
    </div>
  </div>
</div>

     
 )} 

{(userRole === "USER" || userRole === "TRAINER") && (
        <li className="nav-item mt-2">
          <a
            className={activeLink === "/dashboard/course" ? "ActiveLink nav-link" : "nav-link text-muted"}
            href="#"
            onClick={() => handleClick("/dashboard/course")}
          >
            <i className={activeLink === "/dashboard/course" ? "fa-solid fa-book text-light" : "fa-solid fa-book text-muted"}></i>
            <span>Courses</span>
          </a>
        </li>
      )}
      {userRole === "USER" && (
        <li className="nav-item mt-2">
          <a
            className={activeLink === "/mycourses" ? "ActiveLink nav-link" : "nav-link text-muted"}
            href="#"
            onClick={() => handleClick("/mycourses")}
          >
            <i className={activeLink === "/mycourses" ? "fa-solid fa-book text-light" : "fa-solid fa-book text-muted"}></i>
            <span>My Courses</span>
          </a>
        </li>
      )}


      
{userRole === "USER" && (
        <li className="nav-item mt-2">
          <a
            className={activeLink === "/MyCertificateList" ? "ActiveLink nav-link" : "nav-link text-muted"}
            href="#"
            onClick={() => handleClick("/MyCertificateList")}
          >
            <i className={activeLink === "/MyCertificateList" ? "fa-solid fa-award text-light" : "fa-solid fa-award text-muted"}></i>
            <span>My Certificates</span>
          </a>
        </li>
      )}


      

     
   

   {userRole === "TRAINER" && (
      <li className="nav-item mt-2">
        <a
          className={activeLink === "/AssignedCourses" ? "ActiveLink nav-link" : "nav-link text-muted"}
          href="#"
          onClick={() => handleClick("/AssignedCourses")}
        >
          <i className={activeLink === "/AssignedCourses" ? "fa-solid fa-book text-light" : "fa-solid fa-book text-muted"}></i>
          <span>Assigned Courses</span>
        </a>
      </li>
      )}

      {userRole === "ADMIN" && (
      <li className="nav-item mt-2">
        <a
          className={activeLink === "/view/Trainer" ? "ActiveLink nav-link" : "nav-link text-muted"}
          href="#"
          onClick={() => handleClick("/view/Trainer")}
        >
          <i className={activeLink === "/view/Trainer" ? "fa-solid fa-chalkboard-user text-light" : "fa-solid fa-chalkboard-user text-muted"}></i>
          <span>Trainers</span>
        </a>
      </li>
      )}
        {(userRole === "TRAINER" || userRole === "ADMIN") && (
      <li className="nav-item mt-2">
        <a
          className={activeLink === "/view/Students" ? "ActiveLink nav-link" : "nav-link text-muted"}
          href="#"
          onClick={() => handleClick("/view/Students")}
        >
          <i className={activeLink === "/view/Students" ? "fa-solid fa-users text-light" : "fa-solid fa-users text-muted"}></i>
          <span>Students</span>
        </a>
      </li>
        )}

     {userRole === "ADMIN" && (
      <li className="nav-item mt-2">
        <a
          className={activeLink === "/certificate" ? "ActiveLink nav-link" : "nav-link text-muted"}
          href="#"
          onClick={() => handleClick("/certificate")}
        >
          <i className={activeLink === "/certificate" ? "fa-solid fa-award text-light" : "fa-solid fa-award text-muted"}></i>
          <span>Certificate</span>
        </a>
      </li>
        )}
        
{(userRole === "ADMIN" ) && (
        <li className="nav-item mt-2">
          <a
            className={activeLink === "/settings/payment" ? "ActiveLink nav-link" : "nav-link text-muted"}
            href="#"
           
            onClick={() => handleClick("/settings/payment")}
          >
            <i className={activeLink === "/settings/payment" ? "fa-solid fa-gear text-light" : "fa-solid fa-gear text-muted"}></i>
            <span>Payment settings</span>
          </a>
     
        </li>
      )}
       

       {userRole === "ADMIN"  && (
        <li className="nav-item mt-2">
          <a
            className={activeLink === "/about" ? "ActiveLink nav-link" : "nav-link text-muted"}
            href="#"
           
            onClick={() => handleClick("/about")}
          >
            <i className={activeLink === "/about" ? "fa-solid fa-circle-info text-light" : "fa-solid fa-circle-info text-muted"}></i>
            <span>About us </span>
          </a>
     
        </li>
      )}
     
      <hr className="sidebar-divider d-none d-md-block" />
      
    </ul>
  );
};

export default SlideBar;
