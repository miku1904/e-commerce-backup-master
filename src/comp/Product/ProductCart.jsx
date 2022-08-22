import React, { useEffect, useState } from "react";
import style from "./ProductCart.module.css";
import CartIcon from "../../asert/Cart.svg";
import { Edit_WishProduct } from "../../redux/action/WishAction";
import DotMenu from "../../asert/DotMenu.svg";
import WishIcon from "../../asert/CartIconBlanck.svg";
import WishIconREd from "../../asert/WIshIConRed.svg";
import { collection, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EditProductModal from "../modal/EditProductModal";
import { useDispatch, useSelector } from "react-redux";
import {
  query,
  where,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Fetch_Product } from "../../redux/action/ProductAction";
import DeletModal from "../modal/DeletModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Add_wishProduct } from "../../redux/action/WishAction";
import { Add_CartProduct } from "../../redux/action/CartAction";

const ProductCart = () => {
  const [prodId, setprodId] = useState();
  // const productsCollectionRef = collection(db, "Products");
  const dispatch = useDispatch();
  const WishPoduct = useSelector((state) => state.WishProductReducer);
  const productdetail = useSelector((state) => state.productReducer);
  const CartproductReducer = useSelector((state) => state.CartproductReducer);
  const userdetail = useSelector((state) => state.userReducer);

  const addToWishList = async (product) => {
    const wishListData = WishPoduct.find((item) => item.id === product.id);
    // console.log(userdetail?.uid);
    if (wishListData) {
      try {
        const WishPd = {
          ...product,
          userId: [...wishListData.userId, userdetail?.uid],
          Wishid: wishListData.Wishid,
        };
        await setDoc(doc(db, "wishlist", wishListData.Wishid), WishPd);
        toast.info("Add to wishlist successfully", { theme: "colored" });
        dispatch(Edit_WishProduct(WishPd));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await addDoc(collection(db, "wishlist"), {
          ...product,
          userId: [userdetail?.uid],
        });
        const WishPd = {
          ...product,
          userId: [userdetail?.uid],
          Wishid: data?.id,
        };
        await setDoc(doc(db, "wishlist", data?.id), WishPd);
        dispatch(Add_wishProduct(WishPd));
        toast.info("Add to wishlist successfully", { theme: "colored" });
      } catch (error) {
        console.log(error, "Add to wish error");
      }
    }
  };




  const AddToCartProduct = async (product) => {
    const UserCartData = CartproductReducer.find(
      (item) => item.userId === userdetail?.uid
    );
  console.log(UserCartData);
        if (UserCartData) {
          try{
            const cd = {
              producId: product.id,
              quantity: 1,
            };
            const pd = {
              userId: userdetail?.uid,
              cartId: UserCartData.cartId,
              cartproduct: [
                ...UserCartData.cartproduct,
                cd
              ],
            };
            await setDoc(doc(db, "cartproduct", UserCartData.cartId), pd);
            dispatch(Add_CartProduct(pd));
          }catch{

          }
        }
     


      // const data = await addDoc(collection(db, "cartproduct"), {
      //   // cartproduct: [product.id],
      //   userId: userdetail?.uid,
      // });

      // const pd = {
      //   // cartproduct: [product.id],
      //   userId: userdetail?.uid,
      //   cartId: data?.id,
      //   cartproduct: [
      //     { producId: product.id, quantity: 1 },
      //     { producId: product.id, quantity: 1 },
      //     // { producId: "abcd", quantity: 2 },
      //   ],
      // };
      // await setDoc(doc(db, "cartproduct", data?.id), pd);
    

    // try {
    //   let repeat = false;
    //   CartproductReducer?.map((item) => {
    //     if (item.id == product.id) {
    //       repeat = true;
    //     }
    //   });
    //   if (repeat == false) {
    //     const data = await addDoc(collection(db, "cartproduct"), {
    //       ...product,
    //       userId: userdetail?.uid,
    //       qty: 1,
    //     });
    //     const pd = {
    //       ...product,
    //       userId: userdetail?.uid,
    //       qty: 1,
    //       cartId: data?.id,
    //     };
    //     await setDoc(doc(db, "cartproduct", data?.id), pd);
    //     dispatch(Add_CartProduct(pd));
    //     toast.info("Add to cart successfully", { icon: "🛒" });
    //   } else {
    //     toast.error("This product already added", { icon: "🛒" });
    //   }
    // } catch (error) {
    //   console.log(error, "Addtocart");
    // }
  };

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

  const getProductId = (prod) => {
    setprodId(prod);
    // console.log(prod)
  };

  const [wishListpro, setWishListpro] = useState([]);
  useEffect(() => {
    let data = WishPoduct.map((item) => {
      if (item.userId.includes(userdetail.uid)) {
        return item;
      }
    });
    data = data.filter((item) => item !== undefined);
    const a = [];
    data.forEach((item) => {
      a.push(item.id);
    });
    setWishListpro(a);
  }, [WishPoduct]);

  return (
    <>
      {productdetail.map((prod, index) => {
        return (
          <div className={style.ProductCart} key={index}>
            <div className={style.IconImage_wrapper}>
              <div className={style.CartIconBlanck}>
                {wishListpro.includes(prod.id) ? (
                  <>
                    <img
                      src={WishIconREd}
                      alt=""
                      type="button"
                      // onClick={() => addToWishList(prod)}
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={WishIcon}
                      alt=""
                      type="button"
                      onClick={() => addToWishList(prod)}
                    />
                  </>
                )}
              </div>
              <div className={style.ProductImage}>
                <img src={prod.ProductImg} alt="" />
              </div>
            </div>
            <div className={style.ProductDetail}>
              <div className={style.menu_wrapper}>
                <p>Promo Code : 10521</p>
                {userdetail.role === "admin" && (
                  <img
                    src={DotMenu}
                    alt=""
                    type="button"
                    class="btn dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                )}
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a
                      class="dropdown-item"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleEditProductModal "
                      onClick={() => getProductId(prod.id)}
                    >
                      Edit Product
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleDeleteProductModal"
                      onClick={() => getProductId(prod.id)}
                    >
                      Delet Product
                    </a>
                  </li>
                </ul>
                <DeletModal prodId={prodId} />
              </div>
              <h3>{prod.ProductName}</h3>
              <div className={style.ProductPriceMain}>
                <p>Price</p>
                <div className={style.ProductPrice}>
                  <h2 className={style.ProductPrize}>${prod.ProductPrice}</h2>
                  <h4 className={style.ProductDiscountPrize}>$600</h4>
                  <img
                    src={CartIcon}
                    className={style.CartIcon}
                    type="button"
                    onClick={() => AddToCartProduct(prod)}
                    alt=""
                  ></img>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <EditProductModal prodId={prodId} />
    </>
  );
};

export default ProductCart;
