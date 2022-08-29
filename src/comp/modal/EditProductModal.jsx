import React, { useEffect, useState } from "react";
import "./EditProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { Edit_product } from "../../redux/action/ProductAction";
import { storage, db } from "../../firebase";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const EditProductModal = ({ prodId }) => {
  const dispatch = useDispatch();
  
  const [productImg, setProductimg] = useState();
  const [productData, setProductData] = useState({
    ProductName: "",
    ProductPrice: "",
    id: "",
  });
  const productdetail = useSelector((state) => state.productReducer);
  let currentProject = productdetail.find((item) => item.id === prodId);

  const productImageHandler = (e) => {
    if (e.target.files[0]) {
      setProductimg(e.target.files[0]);
    }
  };

  useEffect(() => {
    setProductData(currentProject);
  }, [prodId, productdetail]);

  const handlechange = (e) => {
    const value = e.target.value;
    setProductData({
      ...productData,
      [e.target.name]: value,
    });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (productImg) {
      const storageRef = ref(storage, `product-images/${productImg + v4()}`);
      const upload = uploadBytesResumable(storageRef, productImg);
      upload.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(upload.snapshot.ref).then(async (url) => {
            await setDoc(doc(db, "Products", prodId), {
              ProductName: productData.ProductName,
              ProductImg: url,
              ProductPrice: productData.ProductPrice,
              id: prodId,
            }).catch((err) => console.log(err));
            toast.success("Edit data successfully");
            dispatch(
              Edit_product({
                ProductName: productData.ProductName,
                ProductImg: url,
                ProductPrice: productData.ProductPrice,
                id: prodId,
              })
            );
          });
        }
      );
    } else {
      await setDoc(doc(db, "Products", prodId ), {
        ProductName: productData.ProductName,
        ProductImg: productData.ProductImg,
        ProductPrice: productData.ProductPrice,
        id: prodId,
      }).catch((err) => console.log(err));
      toast.success("Edit data successfully")
      dispatch(
        Edit_product({
          ProductName: productData.ProductName,
          ProductImg: productData.ProductImg,
          ProductPrice: productData.ProductPrice,
          id: prodId,
        })
      );
    } 
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleEditProductModal"
        aria-labelledby="exampleEditProductLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog editModal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title me-5" id="exampleEditProductLabel">
                Edit product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="input-group mb-3">
                  <img
                    src={productData?.ProductImg}
                    alt="image"
                    className="img-fluid w-50 m-auto h-25 d-inline-block"
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    onChange={productImageHandler}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="ProductName"
                    className="form-control mb-3"
                    id="exampleFormControlInput1"
                    placeholder="productName"
                    value={productData?.ProductName}
                    onChange={handlechange}
                  />
                  <input
                    type="number"
                    name="ProductPrice"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Product Prize"
                    value={productData?.ProductPrice}
                    onChange={handlechange}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  data-bs-dismiss="modal"
                >
                  Edit Product
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProductModal;
