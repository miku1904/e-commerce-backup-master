import {
    FETCH_WISHPRODUCT,
    ADD_WISHPRODUCT,
    DELETE_WISHPRODUCT
  } from "../actionType/WishType";
  
  export function Fetch_wishProduct(data) {
    return {
      type: FETCH_WISHPRODUCT,
      payload: data,
    };
  }
  export function Add_wishProduct(data) {
    return {
      type: ADD_WISHPRODUCT,
      payload: data,
    };
  }
  export function Delete_WishProduct(data) {
    return {
      type: DELETE_WISHPRODUCT,
      payload: data,
      
    };
  }