import {
  FETCH_PRODUCT,
  ADD_PRODUCT,
  EDIT_PRODUCT
} from "../actionType/ProductType";
  
  export function Fetch_Product(data) {
    return {
      type: FETCH_PRODUCT,
      payload: data,
    };
  }
  
  export function Add_Product(data) {
    return {
      type: ADD_PRODUCT,
      payload: data,
    };
  }

  export function Edit_product(data) {
    return {
      type: EDIT_PRODUCT,
      payload: data,
    };
  }
  