import { useSelector } from "react-redux";
import {
  FETCH_CARTPRODUCT,
  ADD_CARTPRODUCT,
  EDIT_CARTPRODUCT,
  ADD_QTY,
  DEC_QTY,
  REMOVE_CARTPRODUCT,
} from "../actionType/CartActionType";

let initialState = [];

const CartproductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CARTPRODUCT:
      const uState = [...state, action.payload];
      const uniqueIds = [];
      const unique = uState.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.cartId);
        if (!isDuplicate) {
          uniqueIds.push(element.cartId);
          return true;
        }
        return false;
      });
      state = unique;
      return state;

      
    case ADD_CARTPRODUCT:
      return [...state, action.payload];

    case EDIT_CARTPRODUCT:
      const updatedState = state.map((product) =>
        product.cartId === action.payload.cartId ? action.payload : product
      );
      return updatedState;

    case REMOVE_CARTPRODUCT:
      return state.filter((item) => item.cartId !== action.payload);

    default:
      return state;
  }
};

export default CartproductReducer;
