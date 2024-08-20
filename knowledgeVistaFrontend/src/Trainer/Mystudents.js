import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import baseUrl from '../api/utils';
import axios from 'axios';
//style.css
const Mystudents = () => {
  const navigate=useNavigate();
  const MySwal = withReactContent(Swal);
  const token=sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem('role');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');
  const itemsperpage=10;
  const filterData = () => {
    if (filterOption === "All") {
      return users;
    } else if (filterOption === "Active") {
      return users.filter(user => user.isActive === true);
    } else if (filterOption === "Inactive") {
      return users.filter(user => user.isActive === false);
    }else if(filterOption==="search"){
      return users.filter(user => user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  };
    useEffect(() => {
        // Simulating fetching data from the server
        const fetchData = async () => {
          try {
            // Fetch data from server
            const response = await axios.get(`${baseUrl}/view/Mystudent`,{
              headers:{
                Authorization:token
              }
            });
            const data = response.data;
          
            setUsers(data);
            setUsers(data.content); 
            setTotalPages(data.totalPages);
          } catch (error) {
            if(error.response && error.response.status===401){
              window.location.href="/unauthorized"
            }
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      const fetchData = async (page = 0) => {
        try {
          const response = await axios.get(`${baseUrl}/view/Mystudent`, {
            headers: { Authorization: token },
              params: { pageNumber: page, pageSize: itemsperpage } 
        });
        
          const data = response.data;
          setUsers(data.content); // Update users with content from pageable
          setTotalPages(data.totalPages); // Update total pages
        } catch (error) {
          if (error.response && error.response.status === 401) {
            window.location.href = "/unauthorized";
          }
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData(currentPage); // Fetch data when the page or other dependencies change
      }, [currentPage, filterOption, searchQuery]);
    
      const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };
    
      const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
          buttons.push(
            <button
           
              key={i}
              onClick={() => handlePageChange(i)}
              disabled={i === currentPage}
              className={i === currentPage ? 'active btn btn-primary' : 'btn btn-primary'}
            >
              {i + 1}
            </button>
          );
        }
        return buttons;
      };
        
  const handleDeactivate =async (userId,username,email)=>{
    const formData = new FormData();
    formData.append('email', email);
    MySwal.fire({
      title: "De Activate Student?",
      text: `Are you sure you want to deActivate Student ${username}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "DeActivate",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (userId != null) {
            const response = await axios.delete(`${baseUrl}/admin/deactivate/Student`, {
              data:formData,
              headers: {
                'Authorization': token
              }
            });
            
            if (response.status===200) {
              MySwal.fire({
                title: "DeActivated",
                text: `Student ${username} deActivated successfully`,
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.reload();
            });
            }
          } 
        } catch (error) {
          if(error.response){
            if(error.response.status===404){
              MySwal.fire({
                icon: 'error',
                title: '404',
                text: 'Student not found'
            });
            }
          }else{
          MySwal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Error DeActivating Student'
        });
        }
      }
      }  
    });
  };
  const handleActivate =async (userId,username,email)=>{
    const formData = new FormData();
    formData.append('email', email);
    MySwal.fire({
      title: "Activate Student?",
      text: `Are you sure you want to Activate Student ${username}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Activate",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (userId != null) {
            const response = await axios.delete(`${baseUrl}/admin/Activate/Student`, {
              data:formData,
              headers: {
                'Authorization': token
              }
            });
            
            if (response.status===200) {
              MySwal.fire({
                title: "Activated",
                text: `Student ${username} Activated successfully`,
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.reload();
            });
            }
          } 
        } catch (error) {
          if(error.response){
            if(error.response.status===404){
              MySwal.fire({
                icon: 'error',
                title: '404',
                text: 'Student not found'
            });
            }
          }else{
          MySwal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Error Activating Student'
        });
        }
      }
      }  
    });
  };

  return (
    <div className='contentbackground'>
    <div className='contentinner'>
    <div className='navigateheaders'>
      <div onClick={()=>{navigate(-1)}}><i className="fa-solid fa-arrow-left"></i></div>
      <div></div>
      <div onClick={()=>{navigate(-1)}}><i className="fa-solid fa-xmark"></i></div>
      </div>
    <div className="tableheader "><h1>Students Details</h1>

        
        <input
        className="form-control tabinp"
        type="search"
        placeholder="Search by Email"
        aria-label="Search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setFilterOption("search");
        }}/>
        <div className='selectandadd'>
                   <select
                    className="selectstyle btn btn-success  text-left "
                   
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option  className='bg-light text-dark ' value="All">All</option>
                    <option className='bg-light text-dark' value="Active">Active</option>
                    <option className='bg-light text-dark' value="Inactive">Inactive</option>
                  </select>
        <a href="/addStudent" className='btn btn-primary mybtn'><i className="fa-solid fa-plus"></i> Add Student</a>
     </div>
      </div>
      <div className="table-container">
        <table className="table table-hover table-bordered table-sm">
          <thead className='thead-dark'>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Phone</th>
              <th scope="col"> Skills</th>
              <th scope="col">Status</th>
              <th colSpan="3" scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
          {filterData().map((user, index) => (
              <tr key={user.userId}>
               <th scope="row">{(currentPage * itemsperpage) + (index + 1)}</th>
                <td className='py-2'> <Link to={`/view/Student/profile/${user.email}`}>{user.username}</Link></td>
                <td className='py-2'>{user.email}</td>
                <td className='py-2'>{user.dob}</td>
                <td className='py-2'>{user.phone}</td>
                <td className='py-2'>{user.skills}</td>
                <td className='py-2' >{user.isActive===true? <div className='Activeuser'><i className="fa-solid fa-circle pr-3"></i>Active</div>:<div className='InActiveuser' ><i className="fa-solid fa-circle pr-3"></i>In Active</div>}</td>
                <td className='text-center'>
                <Link to={`/student/edit/${user.email}`} className='hidebtn' >
                    <i className="fas fa-edit"></i>
                    </Link>
                </td>
               
                <td className='text-center'>
                <Link to={`/assignCourse/Student/${user.userId}`} className='hidebtn' >
                    <i className="fas fa-plus"></i>
                    </Link>
                </td>
                <td className='text-center '>
                {user.isActive===true?
                  <button className='hidebtn ' onClick={()=>handleDeactivate(user.userId,user.username,user.email)}>
                  <i className="fa-solid fa-lock"></i>
                  </button>:
                  <button  className='hidebtn ' onClick={()=>handleActivate(user.userId,user.username,user.email)}>
                  <i className="fa-solid fa-lock-open"></i>
                  </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='cornerbtn'>
        <div className="pagination">
            <button className='btn btn-primary' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
              Previous
            </button>
            {renderPaginationButtons()}
            <button className='btn btn-primary' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
              Next
            </button>
          </div>
          </div>
    </div>
  </div>
  
  )
}

export default Mystudents
