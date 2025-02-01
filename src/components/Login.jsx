import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { storeUserData,getUserData } from "./storage";

export default function LoginPage() {
    const navigate=useNavigate();
    const[email,setemail]=useState('');
    const[phonenumber,setphonenumber]=useState('');
    const[logindata,setlogindata]=useState([]);

    const userdata=JSON.parse(getUserData());
    
    useEffect(()=>{
      if(userdata){
        navigate('/quiz');
       }
    },[userdata]);
     
    
    const handlelogin=async(e)=>{
         e.preventDefault();
         setlogindata([])
        const data={
            email:email,
            phone:phonenumber
        }
        console.log(email,phonenumber)
       await axios.post('https://onlinetestbackend-66yo.onrender.com/student',data)
       .then((response)=>{
        console.log(response)
        
        if(response.data.length==0){
          alert("invalid email please check");
        }else{
          if(response.data[0].phoneNumber==data.phone){
            if(response.data[0].teststatus==1){
              alert('This User Already Completed Quiz')
              }else{
                logindata.push(response.data[0])
                storeUserData(logindata[0]);
                console.log(logindata[0].phoneNumber);
                navigate('/quiz')
              }
           
             }else{
              alert("Phone Number not match with Email");
             }
         

        
        }
        
       
    })
       .catch(err=>console.log(err))
    }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-white">
        <div>
          <img
            src="/logokodebloom.png"
            alt="KodeBloom Logo"
            className="logo ms-5"
            style={{ width: "180px" }}
          />
        </div>
        <h3 className="me-5">Testing Platform</h3>
      </header>

      {/* Login Card */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card shadow-lg" style={{ width: "22rem" }}>
          <div className="card-body">
            <h2 className="card-title text-center fw-bold mb-4">Login</h2>
           <form onSubmit={handlelogin}>
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(event)=>{setemail(event.target.value)}}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              
               <span>Phone Number</span> 
             
              <input
                type="text"
                id="phone"
                className="form-control"
                value={phonenumber}
                onChange={(event)=>{setphonenumber(event.target.value)}}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-100" >Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
