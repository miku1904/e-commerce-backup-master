import { USER, LOGOUT } from "../actionType/UserType";

export function Get_User(data) {
  return {
    type: USER,
    payload: data,
  };
}

export function LogoutUser(data) {
  return {
    type: LOGOUT,
    payload: data,
  };
}