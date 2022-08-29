import {
  FETCH_PRODUCT,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  DELETE_PRODUCT,
} from "../actionType/ProductType";
let initialState = [];

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      const uState = [...state, action.payload];
      const uniqueIds = [];
      const unique = uState.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.id);
        if (!isDuplicate) {
          uniqueIds.push(element.id);
          return true;
        }
        return false;
      });
      state = unique;
      return state;

    case ADD_PRODUCT:
      return [...state, action.payload];

    case EDIT_PRODUCT:
       const updatedState = state.map((product) =>
         product.id === action.payload.id ? action.payload : product
       );
       return updatedState;

    case DELETE_PRODUCT:
      return state.filter((item) => item.id !== action.payload);


    default:
      return state;
  }
};

export default productReducer;
