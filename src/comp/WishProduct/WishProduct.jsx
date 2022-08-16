import React, { useEffect, useState } from "react";
import CartIcon from "../../asert/Cart.svg";
import WishIconREd from "../../asert/WIshIConRed.svg";
import style from "../Product/ProductCart.module.css";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { query, where, addDoc, doc, deleteDoc } from "firebase/firestore";
import { Fetch_wishProduct } from "../../redux/action/WishAction";
import { Delete_WishProduct } from "../../redux/action/WishAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishProduct = () => {
  const dispatch = useDispatch();
  const userdetail = useSelector((state) => state.userReducer);
  const wishlist = useSelector((state) => state.WishProductReducer);

  const RemoveWishItem = async (prod) => {
    try {
      await deleteDoc(doc(db, "wishlist", prod.Wishid));
      toast.info("Remove wishlist successfully", { theme: "colored" });
      const docRef = doc(db, "Products", prod.id);
      const docSnap = await updateDoc(docRef, { IsWishList: false });
    } catch (WIshDeleteError) {
      console.log(WIshDeleteError, "WIshDeleteError");
    }
  };
  
  const fetchWishListData = async () => {
    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", userdetail?.uid)
      );
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
    <>
      {wishlist.map((prod, index) => {
          // console.log(prod.id,"product.id")
        // console.log(prod.Wishid,"product.id")
        return (
          <div className={style.ProductCart} key={index}>
            <div className={style.IconImage_wrapper}>
              <div className={style.CartIconBlanck}>
                <img
                  src={WishIconREd}
                  alt=""
                  type="button"
                  onClick={() => RemoveWishItem(prod)}
                />
              </div>
              <div className={style.ProductImage}>
                <img src={prod.ProductImg} alt="" />
              </div>
            </div>
            <div className={style.ProductDetail}>
              <div className={style.menu_wrapper}>
                <p>Promo Code : 10521</p>
              </div>
              <h3>{prod.ProductName}</h3>
              <div className={style.ProductPriceMain}>
                <p>Price</p>
                <div className={style.ProductPrice}>
                  <h2 className={style.ProductPrize}>${prod.ProductPrice}</h2>
                  <h4 className={style.ProductDiscountPrize}>$600</h4>
                  <img src={CartIcon} className={style.CartIcon} alt=""></img>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default WishProduct;
