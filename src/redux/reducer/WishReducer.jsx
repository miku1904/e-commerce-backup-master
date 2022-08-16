import {
  FETCH_WISHPRODUCT,
  ADD_WISHPRODUCT,
  DELETE_WISHPRODUCT,
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

    case DELETE_WISHPRODUCT:
      return [];

    default:
      return state;
  }
};

export default WishProductReducer;
