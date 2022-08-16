import { React, useEffect } from "react";
// import { Get_CurrentUser } from "../redux/currentUser/currentUserAction";
import {Get_User} from "./action/User"

import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

const CurrentUser = () => {
  const [user, loading, error] = useAuthState(auth);
  // console.log(user)
  const dispatch = useDispatch();
  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "user"), where("uid", "==", user?.uid));  
      const doc = await getDocs(q); 
      const data = doc.docs[0].data();  
      const dataId = doc.docs[0].id;
      const userData = {
          name:data.name,
          email: data.email,
          password:data.password,
          role:data.role,
          uid: dataId,
        };
        console.log(userData,"userData")
        dispatch(Get_User(userData));
        // console.log(doc);
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    console.log("user")
    if (loading) return;
    if (!user) return error;
    fetchUserData(); 
  }, [user, loading]);

  return <></>;
};

export default CurrentUser;
