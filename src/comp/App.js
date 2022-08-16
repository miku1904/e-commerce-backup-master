// import SignIn from "./signIn/SigIn";
// import SignUp from "../comp/signUp/SignUp";
import ApplicationRoutes from "../routes/Routes";
import Dashbord from "./dashboard/Dashbord";
import CurrentUser from "../redux/user";
import React from "react";
// import { ToastContainer } from "react-bootstrap";


function App() {
  React.useEffect(()=>{
    console.log("App")
  },[])
  return (
    <>
      <ApplicationRoutes />
      <CurrentUser />
    </>
  );
}

export default App;
