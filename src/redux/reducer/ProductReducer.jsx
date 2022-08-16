import {
  FETCH_PRODUCT,
  ADD_PRODUCT,
  EDIT_PRODUCT,
} from "../actionType/ProductType";
let initialState = [];

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      return [...state, action.payload];

    case ADD_PRODUCT:
      return [...state, action.payload];

    case EDIT_PRODUCT:
      return [...state, action.payload];

    default:
      return state;
  }
};

export default productReducer;
