import {
  FETCH_CARTPRODUCT,
  ADD_CARTPRODUCT,
  ADD_QTY,
  DEC_QTY
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