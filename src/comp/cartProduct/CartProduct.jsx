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
  addDoc,
} from "firebase/firestore";
import { Remove_CartProduct } from "../../redux/action/CartAction";
import { Edit_CartProduct } from "../../redux/action/CartAction";
import { Fetch_Product } from "../../redux/action/ProductAction";
import { useDispatch, useSelector } from "react-redux";
import {
  Add_Qty,
  Dec_Qty,
  Fetch_CartProduct,
} from "../../redux/action/CartAction";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { async } from "@firebase/util";
// import { async } from "@firebase/util";

const CartProduct = () => {
  const navigate = useNavigate();
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
    const updatedData = [];
    const data = cartproduct.map(async (item) => {
      if (item.cartId === prod.cartId && item.userId === userdetail.uid) {
        if (item.prodectDetail.length === 1) {
          // console.log("ja")
          await deleteDoc(doc(db, "cart", item.cartId));
          dispatch(Remove_CartProduct(item.cartId));
        } else {
          item.prodectDetail.map(async (data) => {
            // console.log(data.id, "id")
            if (data.id !== prod.id) {
              // console.log(data.id, "id")
              updatedData.push({ id: data.id, quantity: data.quantity });
            }
            // console.log(data)
          });
          console.log(item.cartId);
          await setDoc(doc(db, "cart", item.cartId), {
            cartId: item.cartId,
            prodectDetail: updatedData,
            userId: item.userId,
          });
          dispatch(
            Edit_CartProduct({
              cartId: item.cartId,
              prodectDetail: updatedData,
              userId: item.userId,
            })
          );
        }
      }
    });
    // console.log(updatedData, "updatedData");
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

  const onIncrementQty = async (prod) => {
    const updatedData = [];
    const data = cartproduct.map(async (item) => {
      if (item.cartId === prod.cartId && item.userId === userdetail.uid) {
        item.prodectDetail.map(async (data) => {
          if (data.id !== prod.id) {
            updatedData.push({ id: data.id, quantity: data.quantity });
          } else {
            updatedData.push({ id: data.id, quantity: data.quantity + 1 });
          }
        });
        await setDoc(doc(db, "cart", item.cartId), {
          cartId: item.cartId,
          prodectDetail: updatedData,
          userId: item.userId,
        });
        dispatch(
          Edit_CartProduct({
            cartId: item.cartId,
            prodectDetail: updatedData,
            userId: item.userId,
          })
        );
      }
    });
  };

  const onDecrementQty = async (prod) => {
    const updatedData = [];
    const data = cartproduct.map(async (item) => {
      if (item.cartId === prod.cartId && item.userId === userdetail.uid) {
        item.prodectDetail.map(async (data) => {
          if (data.id !== prod.id) {
            updatedData.push({ id: data.id, quantity: data.quantity });
          } else {
            updatedData.push({ id: data.id, quantity: data.quantity - 1 });
          }
        });
        await setDoc(doc(db, "cart", item.cartId), {
          cartId: item.cartId,
          prodectDetail: updatedData,
          userId: item.userId,
        });
        dispatch(
          Edit_CartProduct({
            cartId: item.cartId,
            prodectDetail: updatedData,
            userId: item.userId,
          })
        );
      }
    });
  };

  const totalPrice = () => {
    let price = 0;
    CartData.map((item) => {
      const p = item.ProductPrice * item.quantity;
      price += p;
    });
    setTPrice(price);
  };

  useEffect(totalPrice, [totalPrice]);

  const PlaceOrder = async () => {
    try {
      await addDoc(collection(db, "orderDetail"), {productDetail:CartData,userEmail:userdetail.email});
       toast.success("place order successfully");
       await deleteDoc(doc(db, "cart", CartData[0].cartId));
       dispatch(Remove_CartProduct(CartData[0].cartId));
      navigate("/productdashboard");
    } catch(Err) {
      console.log(Err, "plcae order");
    }
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
                          {prod.quantity === 1 ? (
                            <button
                              class="btn btn-primary"
                              onClick={() => onDecrementQty(prod)}
                              disabled
                            >
                              -
                            </button>
                          ) : (
                            <button
                              class="btn btn-primary"
                              onClick={() => onDecrementQty(prod)}
                            >
                              -
                            </button>
                          )}
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
              <p> ({CartData.length} item)</p>
            </div>
            <p>$ {tPrice}</p>
          </div>
          <hr />
          <div className={style.pricetotalAmount}>
            <p>Total Amount</p>
            <p>$ {tPrice}</p>
          </div>
          <button class={style.PlaceOrderButton} onClick={PlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CartProduct;
