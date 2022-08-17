import React, { useEffect, useState } from "react";
import CartIcon from "../../asert/Cart.svg";
import WishIconREd from "../../asert/WIshIConRed.svg";
import { Edit_WishProduct } from "../../redux/action/WishAction";
import style from "../Product/ProductCart.module.css";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { query, where, addDoc, doc, deleteDoc,setDoc } from "firebase/firestore";
import { Fetch_wishProduct } from "../../redux/action/WishAction";
import { Delete_WishProduct } from "../../redux/action/WishAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishProduct = () => {
  const dispatch = useDispatch();
  const userdetail = useSelector((state) => state.userReducer);
  const wishlist = useSelector((state) => state.WishProductReducer);
  const [wishlistData, setWishListData] = useState([]);

  //Fetch Wish product data //

  const fetchWishListData = async () => {
    try {
      const q = query(collection(db, "wishlist"));
      const doc = await getDocs(q);
      const data = [];

      doc.forEach(async (doc) => {
        data.push({ ...doc.data() });
        dispatch(Fetch_wishProduct({ ...doc.data() }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishListData();
  }, []);

  const RemoveWishItem = async (prod) => {
    if (prod.userId.length === 1) {
      try {
        await deleteDoc(doc(db, "wishlist", prod.Wishid));
        toast.info("Remove wishlist successfully", { theme: "colored" });
        dispatch(Delete_WishProduct(prod.Wishid));
      } catch (WIshDeleteError) {
        console.log(WIshDeleteError, "WIshDeleteError");
      }
    }
    else{
      const index = wishlist.indexOf(prod);
      let data = wishlist[index];
      const i = data.userId.indexOf(userdetail.uid);
      if (i > -1) {
        data.userId.splice(i, 1);
      }
       try {
         const WishPd = {
           ...prod,
          //  userId: [...wishListData.userId, userdetail?.uid],
         };
         await setDoc(doc(db, "wishlist",prod.Wishid), WishPd);
         toast.info("Remove wishlist successfully", { theme: "colored" });
         dispatch(Edit_WishProduct(WishPd));
       } catch (error) {
         console.log(error);
       }
    }
  };

  useEffect(() => {
    const data = wishlist.filter((item) =>
      item.userId.includes(userdetail.uid)
    );
    setWishListData(data);
  }, [wishlist]);

  return (
    <>
      {wishlistData.map((prod, index) => {
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
