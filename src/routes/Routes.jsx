import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashbord from "../comp/dashboard/Dashbord";
import WishList from "../comp/WishProduct/WishList";
import ProductDashBord from "../comp/Product/ProductDashBord";
import CartProduct from "../comp/cartProduct/CartProduct";
import SignIn from "../comp/signIn/SigIn";
import SignUp from "../comp/signUp/SignUp";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "../comp/ProtectedRoute";



function ApplicationRoutes() {
  const userDetail = useSelector((state) => state.userReducer);
  
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
       
          <Route exact path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />

         
          {userDetail.name && (
            <Route
              path="/productdashboard"
              element={
                <Dashbord>
                  <ProductDashBord />
                </Dashbord>
              }
            />
          )}
          {userDetail.name && (
            <Route
              path="/WishListdashboard"
              element={
                <Dashbord>
                  <WishList />
                </Dashbord>
              }
            />
          )}
          {userDetail.name && (
            <Route
              path="/Cartdashboard"
              element={
                <Dashbord>
                  <CartProduct />
                </Dashbord>
              }
            />
          )} 
       
            {/* <Route
              path="/productdashboard"
              element={
                  <ProtectedRoute>
                <Dashbord>

                  <ProductDashBord />
                </Dashbord>
                  </ProtectedRoute>
              }
            />
         
       
            <Route
              path="/WishListdashboard"
              element={
                  <ProtectedRoute>
                <Dashbord>

                  <WishList />
                </Dashbord>
                  </ProtectedRoute>
              }
            />
       
       
            <Route
              path="/Cartdashboard"
              element={
                  <ProtectedRoute>
                  <Dashbord>
                      <CartProduct />
                  </Dashbord>
                  </ProtectedRoute>
              }
            />
         */}

      
        </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default ApplicationRoutes;
