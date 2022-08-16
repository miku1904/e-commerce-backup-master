import React, { useEffect } from 'react'
import style from "./ProductDashBord.module.css"
import SearchIcon from "../../asert/SearchIcon.svg"
import ProductCart from './ProductCart';
import AddProduct from '../modal/AddProduct';
import { useDispatch, useSelector } from 'react-redux';
import { Fetch_CartProduct } from "../../redux/action/CartAction";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const ProductDashBord = () => {

  const dispatch = useDispatch();
  const userdetail = useSelector((state) => state.userReducer);

  //Fetch cart product data // 
  const fetchCartData = async () => {
    try {
      const q = query(
        collection(db, "cartproduct"),
        where("userId", "==", userdetail?.uid)
      );

      const doc = await getDocs(q);
      const data = [];

      doc.forEach(async (doc) => {
        data.push({ ...doc.data() });
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
        />
      </div>
      <div className={style.ProductCartWrapper}>
        <ProductCart />
      </div>
    </div>
  );
}

export default ProductDashBord
