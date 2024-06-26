import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import axios from 'axios';
import baseUrl from '../../api/utils';
const Paymenttransactions = () => {
    const token=sessionStorage.getItem("token")
    const MySwal = withReactContent(Swal);
    const[paymenthistory,setpaymenthistory]=useState([{
       id:"",
       orderId:"",
       userId:"",
       courseId:"",
       courseName:"",
	    paymentId:"",
	    installmentnumber:"",
        status:"",
        amountReceived:"",
         amountNeedTopay:"",
	    date:""
    }]);

    const filterData = () => {
      if (filterOption === "All") {
        return paymenthistory;
      } else if (filterOption === "created") {
        return paymenthistory.filter(pay => pay.status === "created");
      } else if (filterOption === "attempted") {
        return paymenthistory.filter(pay => pay.status === "attempted");
      } else if(filterOption==="paid"){
      return paymenthistory.filter(pay=>pay.status==="paid")
      }
      else if(filterOption==="search"){
        return paymenthistory.filter(pay => pay.courseName && pay.courseName.toLowerCase().includes(searchQuery.toLowerCase()));
      }
    };
    
  const [filterOption, setFilterOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        // Simulating fetching data from the server
        const fetchData = async () => {
          try {
            // Fetch data from server
            const response = await axios.get(`${baseUrl}/viewAllTransactionHistory`,{
              headers:{
                Authorization:token
              }
            });
            const data = response.data;
            const payhistory =data.reverse();
            setpaymenthistory(payhistory);
          } catch (error) {
            if(error.response && error.response.status===401){
              window.location.href="/unauthorized"
            }
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
  return (
    <div className='contentbackground'>
    <div className='contentinner'> <div style={{ display: 'grid', gridTemplateColumns: '25fr 10fr 6fr 6fr' }} className='mb-4'>
        <h1>Payment History</h1>
        <input
        className="form-control"
        style={{ marginTop: "10px" }}
        type="search"
        placeholder="Search by Course Name"
        aria-label="Search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setFilterOption("search");
        }}/>
                   <select
                    className="form-select btn btn-success mr-5 ml-5 text-left p-2 "
                   
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option  className='bg-light text-dark ' value="All">All</option>
                    <option className='bg-light text-dark' value="created">Created</option>
                    <option className='bg-light text-dark' value="attempted">Attempted</option>
                    <option className='bg-light text-dark' value="paid">Paid</option>
                  </select>
        {/* <a href="/addStudent" className='btn btn-primary'><i className="fa-solid fa-plus"></i> Add Student</a> */}
      </div>
      <div className="table-container">
        <table className="table table-hover table-bordered table-sm">
          <thead className='thead-dark'>
            <tr>
            <th scope="col">User name</th>
            <th scope="col">Email</th>
              <th scope="col">Course Name</th>
              <th scope="col">Installment Number</th>
              <th scope="col">Payment Id</th>
              <th scope="col">Order Id</th>
              <th scope="col">Amount Paid</th>
              <th scope="col"> Date </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
          {filterData().map((payment) => (
             <tr key={payment.id}>
                <td className='py-2'>{payment.username}</td>
                <td className='py-2'>{payment.email}</td>
                <td className='py-2'>{payment.courseName}</td>
                <td  className='py-2'> {payment.installmentnumber}</td>
                <td className='py-2'>{payment.paymentId}</td>
                <td className='py-2'>{payment.orderId}</td>
                <td className='py-2'>{payment.amountReceived}</td>
                <td className='py-2'>{payment.date}</td>
                <td className='py-2'>{payment.status}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default Paymenttransactions
