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
import { Edit_CartProduct } from "../../redux/action/CartAction";
import { Fetch_Product } from "../../redux/action/ProductAction";
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
  const productdetail = useSelector((state) => state.productReducer);
  const [tPrice, setTPrice] = useState();
  const [CartData, setCartData] = useState([]);

  const fetchProductData = async () => {
    try {
      const q = query(collection(db, "Products"));
      const doc = await getDocs(q);

      doc.forEach((doc) => {
        dispatch(Fetch_Product({ ...doc.data(), id: doc.id }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchCartData = async () => {
    try {
      const q = query(collection(db, "cart"));
      const doc = await getDocs(q);
      doc.forEach(async (doc) => {
        // console.log({ ...doc.data() });
        dispatch(Fetch_CartProduct({ ...doc.data() }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    const data = cartproduct.filter((item) => item.userId === userdetail.uid);
    const productId = [];
    data.map((item) =>
      item.prodectDetail.map((data) =>
        productId.push({ ...data, cartId: item.cartId })
      )
    );
    const carddata = productdetail.filter((item) => {
      for (var i = 0; i <= productId.length; i++) {
        if (productId[i]?.id === item.id) {
          item["quantity"] = productId[i]?.quantity;
          item["cartId"] = productId[i]?.cartId;
          return item;
        }
      }
    });
    setCartData(carddata);
  }, [cartproduct, productdetail]);

  const Removecart = async (prod) => {
    const data = cartproduct.map((item) => {
      if (item.cartId === prod.cartId && item.userId === userdetail.uid) {
        item.prodectDetail.map((data) =>{
          if(data.id === prod.id){
            
          }
        } );
      }
    });
        console.log(data)

    // try {
    //   const cartProduct = {
    //     userId: userdetail?.uid,
    //     cartId: cartData.cartId,
    //     prodectDetail: [
    //       ...cartData.prodectDetail,
    //       { id: product.id, quantity: 1 },
    //     ],
    //   };
    //   await setDoc(doc(db, "cart", prod.cartId), cartProduct);
    //   toast.info("Product deleted from cart successfully", {
    //     theme: "colored",
    //   });
    //   dispatch(Edit_CartProduct(cartProduct));
    // } catch (error) {
    //   console.log(error);
    // }
  };

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

  const PlaceOrder = () => {
    let data = cartproduct.map((item) => {
      if (item.userId === userdetail.uid) {
        return item;
      }
    });
    // data = data.filter((item) => item !== undefined);
    const a = [];
    data.forEach((item) => {
      a.push(item);
    });

    console.log(a, "dha");
  };

  return (
    <>
      <div className={style.cartpagemain}>
        <div className={style.middelsection}>
          {CartData.map((prod, index) => {
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
                    <button
                      className={style.RmoveButton}
                      onClick={() => Removecart(prod)}
                    >
                      Remove
                    </button>
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
                            value={prod.quantity}
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
            <p>$ {tPrice}</p>
          </div>
          <hr />
          <div className={style.pricetotalAmount}>
            <p>Total Amount</p>
            <p>$ {tPrice}</p>
          </div>
          <button class={style.PlaceOrderButton} onClick={PlaceOrder}>
            place order
          </button>
        </div>
      </div>
    </>
  );
};

export default CartProduct;
