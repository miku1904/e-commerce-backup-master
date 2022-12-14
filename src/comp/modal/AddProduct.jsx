import React, { useEffect, useState } from "react";
import { getDownloadURL, ref,  uploadBytesResumable } from "firebase/storage";
import { storage, db } from "../../firebase";
import {v4} from "uuid"
import { collection, addDoc, setDoc ,doc } from "firebase/firestore"; 
import "./AddProduct.css"
import { useDispatch, useSelector } from "react-redux";
import { Add_Product } from "../../redux/action/ProductAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const AddProduct = () => {
  const dispatch = useDispatch(); 
  const [productData, setProductData] = useState({
    ProductName: "",
    ProductPrice: "",
  });
  const [productImg, setProductimg] = useState(null);

  const productImageHandler = (e) => {
    if (e.target.files[0]) {
      setProductimg(e.target.files[0]);
    }
  };

  const handlechange = (e) => {
    const value = e.target.value;
    setProductData({
      ...productData,
      [e.target.name]: value,
    });
  };

  
  
  const handelSubmit = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `product-images/${productImg.name + v4()}`);
    const upload = uploadBytesResumable(storageRef, productImg);
    
    upload.on("state_changed",(snapshot) =>{
      const prog = Math.round(
        (snapshot.bytesTransferred/snapshot.totalBytes) * 100
        );  
      },(err)=>console.log(err),
      () =>{
        getDownloadURL(upload.snapshot.ref)
        .then(async (url) => {
         productData.ProductImg = url;
          const data = await addDoc(collection(db, "Products"), {
            ProductName: productData.ProductName,
            ProductPrice: Number(productData.ProductPrice),
            ProductImg: url,
          })
          const Uproductdata = {
            ProductName: productData.ProductName,
            ProductPrice: Number(productData.ProductPrice),
            ProductImg: url,
            id: data?.id
          };
          await setDoc(doc(db, "Products", data?.id), Uproductdata);
          
          dispatch(Add_Product(Uproductdata)); 
          toast.success("Add product successfully")
        });
      }
      )
      e.target.reset();
    }


  return (
    <div>
      <button
        type="button"
        className="btn btn-primary shadow-none btn-sm ms-3"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add product
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handelSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile02"
                    onChange={productImageHandler}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="ProductName"
                    className="form-control mb-3"
                    id="exampleFormControlInput1"
                    placeholder="Product Name"
                    onChange={handlechange}
                  />
                  <input
                    type="number"
                    name="ProductPrice"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Product Prize"
                    onChange={handlechange}
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Add Product
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
    </div>
  );
  };

export default AddProduct;
