import React, { useEffect, useState } from "react";
import style from "./ProductCart.module.css";
import CartIcon from "../../asert/Cart.svg";
import {
  Edit_CartProduct,
  Add_CartProduct,
} from "../../redux/action/CartAction";
import {
  Edit_WishProduct,
  Add_wishProduct,
} from "../../redux/action/WishAction";
import DotMenu from "../../asert/DotMenu.svg";
import WishIcon from "../../asert/CartIconBlanck.svg";
import WishIconREd from "../../asert/WIshIConRed.svg";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  query,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import EditProductModal from "../modal/EditProductModal";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Product } from "../../redux/action/ProductAction";
import DeletModal from "../modal/DeletModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCart = ({ search }) => {
  const [prodId, setprodId] = useState();
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch();
  const WishPoduct = useSelector((state) => state.WishProductReducer);
  let productdetail = useSelector((state) => state.productReducer);
  const CartproductReducer = useSelector((state) => state.CartproductReducer);
  const userdetail = useSelector((state) => state.userReducer);

  useEffect(() => {
    setProductData(productdetail);
  }, [productdetail]);

  //add to wishlist product

  const addToWishList = async (product) => {
    const wishListData = WishPoduct.find((item) => item.id === product.id);
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

  //add to cart product

  const AddToCartProduct = async (product) => {
    const cartData = CartproductReducer.find(
      (item) => item.userId === userdetail?.uid
    );
    const id = cartData?.prodectDetail.map((item) => {
      return item.id;
    });
    if (cartData) {
      if (id?.includes(product.id)) {
        let prodectDetail = cartData?.prodectDetail.map(
          (item) =>{if(item.id === product.id){
            return {id:product.id, quantity:item.quantity + 1 }
          }} 
        );
        prodectDetail = prodectDetail.filter( (element)=> {
          return element !== undefined;
        });
        let data = cartData?.prodectDetail.filter((item)=>item.id !== product.id);
        try {
          const cartProduct = {
            ...cartData,
            prodectDetail: [...data, prodectDetail[0]],
          };
          await setDoc(doc(db, "cart", cartData.cartId), cartProduct);
          toast.info("Same Product Quantity inc successfully", {
            theme: "colored",
          });
          dispatch(Edit_CartProduct(cartProduct));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const cartProduct = {
            userId: userdetail?.uid,
            cartId: cartData.cartId,
            prodectDetail: [
              ...cartData.prodectDetail,
              { id: product.id, quantity: 1 },
            ],
          };
          await setDoc(doc(db, "cart", cartData.cartId), cartProduct);
          toast.info("Add to cart successfully", { theme: "colored" });
          dispatch(Edit_CartProduct(cartProduct));
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        const data = await addDoc(collection(db, "cart"), {
          userId: userdetail?.uid,
          prodectDetail: [{ id: product.id, quantity: 1 }],
        });
        const cartPoduct = {
          userId: userdetail?.uid,
          prodectDetail: [{ id: product.id, quantity: 1 }],
          cartId: data?.id,
        };
        await setDoc(doc(db, "cart", data?.id), cartPoduct);
        dispatch(Add_CartProduct(cartPoduct));
        toast.info("Add to cart successfully", { theme: "colored" });
      } catch (error) {
        console.log(error, "Add to cart error");
      }
    }
  };


  

  const fetchProductData = async () => {
    try {
      const q = query(collection(db, "Products"));
      const doc = await getDocs(q);

      doc.forEach((doc) => {
        dispatch(Fetch_Product({ ...doc.data() }));
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

  const filteredproducts = () => {
    const data = productdetail.filter((product) => {
      return product.ProductName.toLowerCase().includes(search.toLowerCase());
    });
    setProductData(data);
  };
  useEffect(() => {
    if (search) {
      filteredproducts();
    } else {
      setProductData(productdetail);
    }
  }, [search]);

  return (
    <>
      {productData.map((prod, index) => {
        return (
          <div className={style.ProductCart} key={index}>
            <div className={style.IconImage_wrapper}>
              <div className={style.CartIconBlanck}>
                {wishListpro.includes(prod.id) ? (
                  <>
                    <img src={WishIconREd} alt="" type="button" />
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
                    className="btn dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                )}
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item"
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
                      className="dropdown-item"
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
