import React, { useEffect } from 'react'
import style from "./Dashbord.module.css"
import logo from "../../asert/logo.svg"
import Home from "../../asert/Home.svg"
import ArrowHome from "../../asert/ArrowHome.svg"
import UserProfile from "../../asert/UserProfile.svg"
import HeartIcon from "../../asert/HeartIcon.svg"
import Cart from "../../asert/Cart.svg"
import ProductDashBord from '../Product/ProductDashBord'
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogoutUser } from "../../redux/action/User";
import { ToastContainer } from 'react-toastify'

const Dashbord = ({children}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userdetail = useSelector((state) => state.userReducer);
  const WishList = useSelector((state) => state.WishProductReducer);
  const cartproduct = useSelector((state) => state.CartproductReducer);
  // console.log(WishList.length, "length");

  const handleLogOut = () => {
    signOut(auth);
    const userdata = {
     name:"",
     email: "",
     pasword:"",
     uid: "",
    };
    dispatch(LogoutUser(userdata));
    navigate("/");
  };

  return (
    <>
      <div className={style.Maincontainer}>
        <div className={style.Sidesection}>
          <div className={style.LogoSection}>
            <div className={style.logoIcon}>
              <div className={style.logoMain}>
                <img className={style.logoImage} src={logo} alt="logo" />
              </div>
              <div className={style.logoText}>
                <h3>LEGO LAND</h3>
                <p>RED BRICK</p>
              </div>
            </div>
            <div className={style.HomeMain}>
              <img src={Home} alt="Home" />
              <div className={style.HomeLogoText}>
                <Link to="/productdashboard" className={style.HomeLogoLink}>
                  <h4>Main page </h4>
                </Link>
                <img
                  className={style.ArrowHome}
                  src={ArrowHome}
                  alt="arrow"
                ></img>
                <h3>Catalog</h3>
              </div>
            </div>
          </div>
        </div>

        <div className={style.HeaderSection}>
          <ToastContainer />
          <div className={style.UserProfile}>
            <img src={UserProfile}></img>
            <h3>{userdetail?.name}</h3>
            <button
              className="btn btn-danger btn-sm rounder rounded-pill ms-3"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </div>

          <div className={style.Navbar}>
            <div className={style.NavbarItem}>
              <div className={style.WishNavbar}>
                <div className={style.NavIconHEart}>
                  <Link to="/WishListdashboard" className={style.WishLink}>
                    <img src={HeartIcon} alt="heart" />
                    <h5>Wish List ({WishList.length})</h5>
                  </Link>
                </div>
                <div className={style.NavIcon}>
                  <Link to="/Cartdashboard" className={style.WishLink}>
                    <img src={Cart} alt="Cart" />
                    <h5>({cartproduct.length}) Products -</h5>
                  </Link>
                  <h4>$1000</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.ProductDashBord}>{children}</div>
      </div>
    </>
  );
}

export default Dashbord;
 