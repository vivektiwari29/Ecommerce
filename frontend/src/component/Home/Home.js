import React, { Fragment, useEffect } from 'react'
// import { CgMouse } from 'react-icons/all'
import "./Home.css"
import Product from "./ProductCard.js"
import Metadata from '../layout/MetaData.js'
import { clearErrors, getProduct } from "../../actions/productAction.js"
import {useDispatch , useSelector} from 'react-redux'
import Loader from '../layout/Loader/Loader.js'
import {useAlert} from "react-alert"

const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch();
  const { loading , error , products} = useSelector((state) => state.products)

 
  useEffect(() => {

    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }

    dispatch(getProduct());

  }, [dispatch , error , alert]);



  return (
    <Fragment >
      {loading ? (<Loader />) : (
            <Fragment>
            <Metadata title="ECOMMERCE" />
              <div className='banner'>
                  <p>Welcome to Ecommerce</p>
                  <h1>FIND AMAZING PRODUCTS BELOW</h1>
      
                  <a href="#container">
                      <button>
                          Scroll 
                      </button>
      
                  </a>
      
      
              </div>
      
              <h2 className='homeHeading'>FEATURED PRODUCTS</h2>
      
              <div className='container' id='container'>
      
                {products && products.map((product) => <Product product={product} /> )}
      
              </div>
      
          </Fragment>
      ) }
    </Fragment>
  )
}

export default Home