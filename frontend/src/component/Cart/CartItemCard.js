import React from 'react'
import "./CartItemCard.css"
import { Link } from "react-router-dom"

const CartItemCard = ({ item , deleteCartItems}) => {
  return (
    <div className='CartItemCard'>
        <img src={item.image} alt='ssa' />
        <div>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <span>{`Price : ₹${item.price}`}</span>

            {/* <p onClick={deleteCartItems(item.product)}>Remove</p>   this will be called when the page renders */}


            <p onClick={()=>deleteCartItems(item.product)}>Remove</p> {/* this will be called on click*/}
        </div>
    </div>
  )
}

export default CartItemCard