import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Forget = () => {
  const [values, setValues] = useState({
    email: "callmevk611@gmail.com",
    buttonText: "Submit",
  });

  const {email, buttonText } = values;
  const handleChange = (name) => (e) => {
    //
    setValues({...values,[name]:e.target.value});
  };
  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({...values,buttonText:'Submitting'});
    axios({
        method:'PUT',
        url:`${process.env.REACT_APP_API}/forget-password`,
        data:{email}
    })
    .then(response=>{
        console.log('Forgot password success',response);
        toast.success(response.data.message);
        setValues({...values,buttonText:'Requested'})
    })
    .catch(err=>{
        console.log('forgot password error',err.response.data);
        toast.error(err.response.data.error);
        setValues({...values,buttonText:'Submit'});
    })

  };
  const paaswordForgotForm = () => {
    return (
      <form>
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
        <button onClick={clickSubmit} type="submit" className="btn btn-primary">
          {buttonText}
        </button>
      </form>
    );
  };
  return (
    <div className="col-d-6 offset-md-3">
      <ToastContainer />
      <h1>Forgot Password</h1>
      {paaswordForgotForm()}
    </div>
  );
};
