import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { db } from "../../firebase";
import { Delete_product } from "../../redux/action/ProductAction";
import "./DeletModal.css"

const DeletModal = ({prodId}) => {
  const dispatch = useDispatch();
 

    const deleteProduct = async(id) => { 
      try{
        await deleteDoc(doc(db , "Products", id))
        dispatch(Delete_product(id));
      }catch{

      }
    };


  return (
    <>
      <div
        className="modal fade"
        id="exampleDeleteProductModal"
        aria-labelledby="exampleDeleteProductLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog DeleteModal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title m-auto" id="exampleDeleteProductLabel">
                are you sure you want delet ?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body m-auto">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => deleteProduct(prodId)}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-3"
                data-bs-dismiss="modal"
              >
                no
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletModal;
