import React, { useEffect, useState } from "react";
import style from "./CartProduct.module.css";
import {
  collection,
  getDocs,
  query,
  setDoc,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  Add_Qty,
  Dec_Qty,
  Fetch_CartProduct,
  Remove_CartProduct,
} from "../../redux/action/CartAction";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { async } from "@firebase/util";

const CartProduct = () => {
  const dispatch = useDispatch();
  const userdetail = useSelector((state) => state.userReducer);
  const cartproduct = useSelector((state) => state.CartproductReducer);

  const [tPrice, setTPrice] = useState();

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

  const Removecart =async (prod) =>{
    try {
      await deleteDoc(doc(db, "cartproduct", prod.cartId));
      toast.info("Remove cartproduct successfully", { icon: "🛒" });
      dispatch(Remove_CartProduct(prod.cartId));
    } catch (CartDeleteError) {
      console.log(CartDeleteError, "CartDeleteError");
    }
  }

  const onIncrementQty = async (product) => {
    console.log("prod");
    totalPrice();
    dispatch(Add_Qty(product.id));
    const qty = product.qty;
    const prodObj = { ...product, qty: qty };
    await setDoc(doc(db, "cartproduct", product?.cartId), prodObj);
  };

  const onDecrementQty = async (product) => {
    totalPrice();
    dispatch(Dec_Qty(product.id));
    const qty = product.qty;
    const prodObj = { ...product, qty: qty };
    await setDoc(doc(db, "cartproduct", product?.cartId), prodObj);
  };

  const totalPrice = () => {
    let price = 0;
    cartproduct.map((item) => {
      const p = item.ProductPrice * item.qty;
      price += p;
    });
    setTPrice(price);
  };

  useEffect(totalPrice, [totalPrice]);

  return (
    <>
      <div className={style.cartpagemain}>
        <div className={style.middelsection}>
          {cartproduct.map((prod, index) => {
            return (
              <div className={style.cartpagecontain}>
                <div className={style.CartPRoductImgMain}>
                  <img
                    src={prod.ProductImg}
                    className={style.CartPRoductImg}
                  ></img>
                </div>
                <div className={style.CartProductSideSection}>
                  <div className={style.RemoveMainDiv}>
                    <h5>Product Name : {prod.ProductName}</h5>
                    <button className={style.RmoveButton} onClick={()=>Removecart(prod)}>Remove</button>
                  </div>
                  <p>Promo Code: 10521</p>
                  <div className={style.MainPriceButton}>
                    <div className={style.ProductPrizeMain}>
                      <p> price : ${prod.ProductPrice}</p>
                      <p className={style.ProductPrize}>$2000</p>
                    </div>
                    <div className={style.prductQty}>
                      <ul class="pagination justify-content-end set_quantity">
                        <li class="page-item">
                          <button
                            class="btn btn-primary"
                            onClick={() => onDecrementQty(prod)}
                          >
                            -
                          </button>
                        </li>
                        <li class="page-item">
                          <input
                            type="text"
                            className={style.QtyInput}
                            value={prod.qty}
                            id="textbox"
                          />
                        </li>
                        <li class="page-item">
                          <button
                            class="btn btn-primary"
                            onClick={() => onIncrementQty(prod)}
                          >
                            +
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={style.cartsidesection}>
          <h4>PRICE DETAILS</h4>
          <hr />
          <div className={style.pricetotal}>
            <div className={style.PeiceTotalQty}>
              <p>price :</p>
              <p> (1 item)</p>
            </div>
            <p>$ 1500</p>
          </div>
          <hr />
          <div className={style.pricetotalAmount}>
            <p>Total Amount</p>
            <p>$ {tPrice}</p>
          </div>
          {/* <button class={style.PlaceOrderButton}>place order</button> */}
        </div>
      </div>
    </>
  );
};

export default CartProduct;
