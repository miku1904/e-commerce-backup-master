import React, {useState} from "react";
import Style from "./SignUp.module.css"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db} from "../../firebase";
import { collection, addDoc } from "firebase/firestore"; 
import { Link,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const SignUp = () => {
  const [nameErr , SetNameError] = useState({})
  const [emailErr , SetEmailError] = useState({})
  const [passwordErr , SetPasswordError] = useState({})
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  const [data, setData] = useState({
    name:"",
    email:"",
    password:"",
    role:"user"
  });



  function handleChange(e) {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  }
  console.log(data);

  const  handleSubmit = (e) =>{
    e.preventDefault();
    const isValid = Formvalidation();
    console.log(isValid)
    if(isValid){
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (r) => {
        const user = r.user;
        await addDoc(collection(db, "user"), {
          uid:user.uid,
          name: data.name,
          email: data.email,
          password: data.password,
          role:data.role,
        });
        toast.success("Sign Up successfully")
        navigate("/productdashboard");
      })
      .catch((err) => { 
        setFirebaseError(err.message);
      });
    }
    
    }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
const Formvalidation = () => {
  const nameErr = {}
  const emailErr = {}
  const passwordErr = {}
  let isValid = true;
  console.log(data.name.trim().length)
  if(data.name.trim().length < 5) {

    nameErr.firstNameShort = "name is to short"
    isValid = false;
  }

  // if(validateEmail(data.email)){
    const email = data.email;
    if (validateEmail(email)) {
    
    }else{
      emailErr.firstNameShort =  `${email} is Invalid`
      isValid = false;
    }
  // }
  if(data.password.trim().length < 8){
    passwordErr.passwordShot  = "password is to short"
    isValid = false; 
  }
  SetPasswordError(passwordErr);
  SetNameError(nameErr);
  SetEmailError(emailErr);
  return isValid;
}

  return (
    <>
      <div className={Style.SigUpMain}>
        <div className={Style.SignUp}>
          <p>Welcome 👋</p>
          <h3>Sign Up your account</h3>
          <form className={Style.SignUpForm} onSubmit={handleSubmit}>
            <label className={Style.InputLable}>NAME</label>
            <input
              className={Style.SigUpInput}
              value={data.name}
              name="name"
              type="text"
              onChange={handleChange}
            ></input>
            {Object.keys(nameErr).map((key) => {
              return <p className={Style.InputError}>{nameErr[key]}</p>;
            })}
            <label className={Style.InputLable}>Your email</label>
            <input
              className={Style.SigUpInput}
              value={data.email}
              type="text"
              name="email"
              onChange={handleChange}
            ></input>
            {Object.keys(emailErr).map((key) => {
              return <p className={Style.InputError}>{emailErr[key]}</p>;
            })}
            <lebel className={Style.InputLable}>Password</lebel>
            <input
              className={Style.SigUpInput}
              value={data.password}
              type="Password"
              name="password"
              onChange={handleChange}
            ></input>
            {Object.keys(passwordErr).map((key) => {
              return <p className={Style.InputError}>{passwordErr[key]}</p>;
            })}
            <div className={Style.FirebaseError}>
              <p className={Style.error}>{firebaseError.slice(16)}</p>
            </div>
            <button className={Style.SigupButton} type="submit">
              CONTINUE
            </button>
          </form>
        </div>
        <div className={Style.link}>
          <p>
            you have an account?<Link to="/">SignIn</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
