import {
  FETCH_CARTPRODUCT,
  ADD_CARTPRODUCT,
  EDIT_CARTPRODUCT,
  ADD_QTY,
  DEC_QTY,
  REMOVE_CARTPRODUCT,
} from "../actionType/CartActionType";

  export function Fetch_CartProduct(data) {
    return {
      type: FETCH_CARTPRODUCT,
      payload: data,
    };
  }

  export function Add_CartProduct(data) {
    return {
      type: ADD_CARTPRODUCT,
      payload: data,
    };
  }

   export function Edit_CartProduct(data) {
     return {
       type:EDIT_CARTPRODUCT,
       payload: data,
     };
   }

  

  export function Remove_CartProduct(data) {
    return {
      type: REMOVE_CARTPRODUCT,
      payload: data,
    };
  }

  export function Add_Qty(data) {
    return {
      type: ADD_QTY,
      payload: data,
    };
  }

  export function Dec_Qty(data) {
    return {
      type: DEC_QTY,
      payload: data,
    };
  }