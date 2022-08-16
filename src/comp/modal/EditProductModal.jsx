import React, { useEffect, useState } from "react";
import "./EditProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { storage, db } from "../../firebase";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const EditProductModal = ({ prodId, getProducts }) => {
  
  const [productImg, setProductimg] = useState();
  const [productData, setProductData] = useState({
    ProductName: "",
    ProductPrice: "",
    id: "",
  });
  const productdetail = useSelector((state) => state.productReducer);
  // console.log(projectDetail,'product')
  let currentProject = productdetail.find((item) => item.id === prodId);
  // console.log(productData, "currentProduct");

  const productImageHandler = (e) => {
    if (e.target.files[0]) {
      setProductimg(e.target.files[0]);
    }
  };

  useEffect(() => {
    setProductData(currentProject);
    // console.log(productData, "productData");
  }, [prodId]);

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
          console.log(prog);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(upload.snapshot.ref).then(async (url) => {
            await setDoc(doc(db, "Products", prodId), {
              ProductName: productData.ProductName,
              ProductImg: url,
              ProductPrice: productData.ProductPrice,
            }).catch((err) => console.log(err));
            toast.success("Edit data successfully");
          });
        }
      );
    } else {
      await setDoc(doc(db, "Products", prodId ), {
        ProductName: productData.ProductName,
        ProductImg: productData.ProductImg,
        ProductPrice: productData.ProductPrice,
      }).catch((err) => console.log(err));
      // toast.success("Edit data successfully")
    }
    getProducts();
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
              {/* <h5>{productData?.id}</h5> */}
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
                    class="form-control"
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
                    // defaultValue={productName}
                    value={productData?.ProductName}
                    // defaultValue={productdetail?.ProductName}
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
                <button className="btn btn-primary" type="submit">
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

// try {
//   await setDoc(doc(db, "Products", editproductId), productData);
// } catch (error) {
//   console.log(error);
// }

// productData.id = editproductId;
// console.log(productData.id);
//   try {
//   const q = query(
//     collection(db, "Products"),
//     where("id", "==", productData.id)
//   )
//   console.log(q)
//   const querySnapshot = await getDocs(q);
//   console.log(querySnapshot);
//   let docId;
//   querySnapshot.forEach((doc) => {
//     docId = doc.id
//     {console.log(docId)}
//   })
//   const collectionRef = doc(db, "Products", docId);
//   console.log(collectionRef)
//   // await updateDoc(collectionRef, {
//   //       ProductName: productData.ProductName,
//   //       ProductPrice: Number(productData.ProductPrice),
//   //       // ProductImg: url,
//   // });
//   }catch (error) {
//   console.log(error);
// }

// // Pid = productdetail;
// // const storageRef = ref(storage, `product-images/${productImg.name + v4()}`);
// // const upload = uploadBytesResumable(storageRef, productImg);
// const q = query(collection(db, "Products"), where("id", "=="));
// const querySnapshot = await getDocs(q);
// // console.log(querySnapshot, "querySnapshot");
// let docId
// querySnapshot.forEach((doc) => {
//  docId = doc.id;
// });
// console.log(docId)
//  const collectionRef = doc(db, "Products", docId);
//   await updateDoc(collectionRef, {
//     ProductName: productData.ProductName,
//     ProductPrice: Number(productData.ProductPrice),
//     // ProductImg: url,
//   }).catch((err) => console.log(err));

// upload.on(
//   "state_changed",
//   (snapshot) => {
//     const prog = Math.round(
//       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//     );
//     console.log(prog);
//   },
//   (err) => console.log(err),
// () => {
// getDownloadURL(upload.snapshot.ref)
// }
// );
