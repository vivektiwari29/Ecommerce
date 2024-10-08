// import React, { Fragment, useState } from 'react'
// import "./Search.css"

// const Search = ({ history }) => {

//     const [keyword , setKeyword] = useState("");
//     console.log(history)

//     const searchSubmitHandler = (e) => {

//         e.preventDefault();

//         if(keyword.trim()){
//             history.push(`/products/${keyword}`);
//         }
//         else{
//             history.push(`/products`);
//         }
//     }

//   return (
//     <Fragment>
//         <form className='searchBox' onSubmit={searchSubmitHandler}>

//             <input
//             type='text'
//             placeholder='Search a Product ...'
//             onChange={(e) => setKeyword(e.target.value)}
//             />

//             <input type='submit' value="Search"/>

//         </form>
//     </Fragment>
//   )
// }

// export default Search





import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Search.css";
import MetaData from '../layout/MetaData';

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <Fragment>
      <MetaData title="Search a Product -- ECOMMERCE"/>
      <form className='searchBox' onSubmit={searchSubmitHandler}>
        <input
          type='text'
          placeholder='Search a Product ...'
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type='submit' value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;