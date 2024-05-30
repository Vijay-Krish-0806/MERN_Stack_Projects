import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {isAuth } from "./Helpers";

export const Signup = () => {
  const [values, setValues] = useState({
    name: "hellomern",
    email: "callmevk611@gmail.com",
    password: "hello123",
    buttonText: "Submit",
  });
  const navigate=useNavigate();

  const { name, email, password, buttonText } = values;
  const handleChange = (name) => (e) => {
    //
    setValues({...values,[name]:e.target.value});
  };
  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({...values,buttonText:'Submitting'});
    axios({
        method:'POST',
        url:`${process.env.REACT_APP_API}/signup`,
        data:{name,email,password}
    })
    .then(response=>{
        console.log('Signup success',response);
        setValues({...values,name:'',email:"",password:'',buttonText:'Submitted'});
        toast.success(response.data.message);

    })
    .catch(err=>{
        console.log('Signup error',err.response.data);
        setValues({...values,buttonText:'Submit'});
        toast.error(err.response.data.error);
    })

  };
  const signupForm = () => {
    return (
      <form>
        <div className="row mb-3">
          <label htmlFor="inputTextl3" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input
              onChange={handleChange("name")}
              value={name}
              type="text"
              className="form-control"
              id="inputTextl3"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              value={email}
              onChange={handleChange("email")}
              type="email"
              className="form-control"
              id="inputEmail3"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              value={password}
              type="password"
              className="form-control"
              id="inputPassword3"
              onChange={handleChange("password")}
            />
          </div>
        </div>
        <button onClick={clickSubmit} type="submit" className="btn btn-primary">
          {buttonText}
        </button>
      </form>
    );
  };
  return (
    <div className="col-d-6 offset-md-3">
      <ToastContainer />
      {isAuth()?navigate('/'):null}
      <h1>Signup</h1>
      {signupForm()}
      <br/>
      <Link className="btn btn-sm btn-outline-danger" to='/auth/password/forget'>Forgot Password??</Link>
    </div>
  );
};
