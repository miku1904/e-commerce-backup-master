import {
  FETCH_WISHPRODUCT,
  ADD_WISHPRODUCT,
  DELETE_WISHPRODUCT,
  EDIT_WISHPRODUCT,
} from "../actionType/WishType";
let initialState = [];

const WishProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHPRODUCT:
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
      // console.log(state);
      return state;

    case ADD_WISHPRODUCT:
      return [...state, action.payload];

    case EDIT_WISHPRODUCT:
      const updatedState = state.map((product) =>
         product.id === action.payload.id ? action.payload : product
       );
       return updatedState;

    case DELETE_WISHPRODUCT:
      return state.filter((item) => item.Wishid !== action.payload);
    // const Wstate = state.filter
    // return [...state, action.payload];

    default:
      return state;
  }
};

export default WishProductReducer;
