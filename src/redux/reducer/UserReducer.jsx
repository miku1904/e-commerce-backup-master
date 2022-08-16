import { USER, LOGOUT } from "../actionType/UserType";
let initialState = {
    name:"",
    email: "",
    password:"",
    uid: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return action.payload;  
    case LOGOUT:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;