import React from 'react'
import style from "./WishList.module.css"
import SearchIcon from "../../asert/SearchIcon.svg";
import WishProduct from './WishProduct';
import { useState } from 'react';



const WishList = () => {
  const [searchdata, setsearchdata] = useState();


  const WishSearch = (e) => {
    setsearchdata(e.target.value);
  };
  return (
    <div>
      <div className={style.WishPageContainer}>
        <div className={style.WishHeader}>
          <h1>Wish List</h1>
        </div>
        <div className={style.Searchbar}>
          <button className={style.SearchButton}>
            <img src={SearchIcon} />
          </button>
          <input
            className={style.SearchBarInput}
            placeholder="Search among 1000+ products"
            onChange={WishSearch}
          />
        </div>
        <div className={style.WishCartWrapper}>
          <WishProduct searchdata={searchdata} />
        </div>
      </div>
    </div>
  );
}

export default WishList
