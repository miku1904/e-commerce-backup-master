import {
  FETCH_CARTPRODUCT,
  ADD_CARTPRODUCT,
  ADD_QTY,
  DEC_QTY
} from "../actionType/CartActionType";

let initialState = [];



const CartproductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CARTPRODUCT:
      const uState = [...state, action.payload];
      const uniqueIds = [];
      const unique = uState.filter((element) => {
        console.log(element.id,"cartid")
        const isDuplicate = uniqueIds.includes(element.id);
        if (!isDuplicate) {
          uniqueIds.push(element.id);
          return true;
        }
        return false;
      });
      state = unique; 
      return state;

    case ADD_CARTPRODUCT:
      return [...state, action.payload];

    case ADD_QTY:
      let prods = [...state]
      let new_Prods = []
      let prodID = action.payload
    
      prods?.map(
        (item)=>{
          if(item.id == prodID){
            console.log(item.qty,'qty')
            item.qty += 1
            new_Prods.push(item)
          }
          else{
            new_Prods.push(item)
          }
        } 
      )
     
      return new_Prods

    case DEC_QTY:
      let prod = [...state]
      let new_Prod = []
      let prodId = action.payload
    
      prod?.map(
        (item)=>{
          if(item.id == prodId){
            console.log(item.qty,'qty')
            if(item.qty != 1){
              item.qty -= 1
            }
              new_Prod.push(item)
          }
          else{
            new_Prod.push(item)
          }
        } 
      )
     
      return new_Prod
    default:
      return state;
  }
};


export default CartproductReducer;