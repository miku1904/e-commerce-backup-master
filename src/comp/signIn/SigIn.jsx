import React, { useState } from "react";
import Style from "./SignIn.module.css"
import { Link, useNavigate} from "react-router-dom";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 



const SignIn = () => {
  const [emailErr, SetEmailError] = useState({});
  const [passwordErr, SetPasswordError] = useState({});
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();
  const [ldata, setLData] = useState({
    email: "",
    password: "",
  }); 

const handleLogInChange = (e) =>{
  const value = e.target.value;
  setLData({
    ...ldata,
    [e.target.name]: value,
  });
  
}
console.log(ldata)

const handleSubmit = (e) =>{
   e.preventDefault();
   const isValid = Formvalidation();
   if(isValid){
   signInWithEmailAndPassword(auth, ldata.email, ldata.password)
   .then(async (res) => {
        toast.success("Log In sucess Welcome")  
        console.log(res.user);
        navigate("/productdashboard");
      })
      .catch((err) => {
        setFirebaseError(err.message);
      });
  };

}


   const validateEmail = (email) => {
     return String(email)
       .toLowerCase()
       .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
       );
   };
   const Formvalidation = () => {
     const emailErr = {};
     const passwordErr = {};
     let isValid = true;

     // if(validateEmail(data.email)){
     const email = ldata.email;
     if (validateEmail(email)) {
     } else {
       emailErr.firstNameShort = `${email} is Invalid`;
       isValid = false;
     }
     // }
     if (ldata.password.trim().length < 8) {
       passwordErr.passwordShot = "password is to short";
       isValid = false;
     }
     SetPasswordError(passwordErr);
     SetEmailError(emailErr);
     return isValid;
   };

  return (
    <>
      <div className={Style.SigInMain}>
        <div className={Style.SignIn}>
          <p>Welcome back! 👋</p>
          <h3>Sign in to your account</h3>
          <form className={Style.SignInForm} onSubmit={handleSubmit}>
            <label className={Style.InputLable}>Your email</label>
            <input
              className={Style.SigInInput}
              onChange={handleLogInChange}
              value={ldata.email}
              name="email"
              type="text"
            ></input>
            {Object.keys(emailErr).map((key) => {
              return <p className={Style.InputError}>{emailErr[key]}</p>;
            })}
            <lebel className={Style.InputLable}>Password</lebel>
            <input
              className={Style.SigInInput}
              name="password"
              onChange={handleLogInChange}
              value={ldata.password}
              type="password"
            ></input>
            {Object.keys(passwordErr).map((key) => {
              return <p className={Style.InputError}>{passwordErr[key]}</p>;
            })}
            <div className={Style.FirebaseError}>
              <p className={Style.error}>{firebaseError.slice(16)}</p>
            </div>
            <button src={Style.SignInButton} type="submit">
              CONTINUE
            </button>
          </form>
        </div>
        <div className={Style.link}>
          <p>
            Don’t have an account?<Link to="/SignUp">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;