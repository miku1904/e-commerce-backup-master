import React, { useEffect } from "react";
import style from "./ProductDashBord.module.css";
import SearchIcon from "../../asert/SearchIcon.svg";
import ProductCart from "./ProductCart";
import AddProduct from "../modal/AddProduct";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_CartProduct } from "../../redux/action/CartAction";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Fetch_wishProduct } from "../../redux/action/WishAction";
import { useState } from "react";

const ProductDashBord = () => {
  const dispatch = useDispatch();
  const userdetail = useSelector((state) => state.userReducer);
  const [search , setsearch] = useState ()



  const handlesearch = (e) =>{
    setsearch(e.target.value);
  }
  //Fetch cart product data //

  const fetchCartData = async () => {
    try {
      const q = query(collection(db, "cart"));
      const doc = await getDocs(q);
      doc.forEach(async (doc) => {
        dispatch(Fetch_CartProduct({ ...doc.data() }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  //Fetch Wish product data //

  const fetchWishListData = async () => {
    try {
      const q = query(collection(db, "wishlist"));
      const doc = await getDocs(q);
      const data = [];

      doc.forEach(async (doc) => {
        data.push({ ...doc.data() });
        dispatch(Fetch_wishProduct({ ...doc.data()}));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishListData();
  }, []);

  return (
    <div className={style.ProductPageContainer}>
      <div className={style.productHeader}>
        <h1>Catalog</h1>
        {userdetail.role === "admin" && <AddProduct />}
      </div>

      <div className={style.Searchbar}>
        <button className={style.SearchButton}>
          <img src={SearchIcon} />
        </button>
        <input
          className={style.SearchBarInput}
          placeholder="Search among 1000+ products"
          onChange={handlesearch}
        />
      </div>
      <div className={style.ProductCartWrapper}>
        <ProductCart search={search}/>
      </div>
    </div>
  );
};

export default ProductDashBord;
