import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import userReducer from "./redux/reducer/UserReducer";
import productReducer from "./redux/reducer/ProductReducer";
import WishProductReducer from "./redux/reducer/WishReducer";
import thunk from "redux-thunk";
import CartproductReducer from "./redux/reducer/CartReducer"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  productReducer,
  userReducer,
  WishProductReducer,
  CartproductReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
