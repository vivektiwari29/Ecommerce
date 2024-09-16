import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstant";
import axios from "axios";

// Base API URL from environment variables
const apiUrl = process.env.REACT_APP_API_URL;

// add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    try {
        // Use the environment variable for the API URL
        const { data } = await axios.get(`/api/v1/product/${id}`);

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.Stock,
                quantity
            }
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
};

// remove from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
};
