// import React, { Fragment, useEffect } from 'react'
// import Carousel from "react-material-ui-carousel"
// import "./ProductDetails.css"
// import { useSelector , useDispatch  } from 'react-redux'
// import { getProductDetails } from '../../actions/productAction'

// const ProductDetails = ({match}) => {
//     const dispatch = useDispatch();

//     const {product , loading , error } = useSelector(
//         (state) => state.productDetails 
//     )

//     useEffect(() => {

//         dispatch(getProductDetails(match.params.id))

//     } , [dispatch , match.params.id])
//   return (
//     <Fragment>
//         <div className='ProductDetails'>
//             <div>
//                 <Carousel>
//                     {product.images && product.images.map((item , i) => (
//                         <img
//                             className='CarouselImage'
//                             key={item.url}
//                             src={item.url}
//                             alt={`${i} Slide`}
//                         />
//                     ))}
//                 </Carousel>
//             </div>
//         </div>
//     </Fragment>
//     )
// }

// export default ProductDetails





import React, { Fragment, useEffect, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useDispatch, useSelector } from 'react-redux'; // Correct import statement
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom'; // Import useParams
import ReviewCard from "./ReviewCard.js"
import Loader from '../layout/Loader/Loader.js';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData.js';
import { addItemsToCart } from "../../actions/cartAction.js"
import { Dialog , DialogActions , DialogContent , DialogTitle , Button } from "@material-ui/core"
import { Rating } from "@material-ui/lab"
import { NEW_REVIEW_RESET } from '../../constants/productConstant.js';



const ProductDetails = () => {
    const dispatch = useDispatch();
    const alert = useAlert()

    const { id } = useParams(); // Destructure the id from useParams

    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );

    const { success , error : reviewError} = useSelector(
        (state) => state.newReview
    )


    const [quantity , setQuantity] = useState(1);
    const [open , setOpen] = useState(false);
    const [rating , setRating] = useState(0);
    const [comment , setComment] = useState("");

    const increaseQuantity = () => {

        if ( product.Stock <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {

        if( 1 >= quantity ) return;

        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id , quantity));
        alert.success("Item Added To Cart");
    }


    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating" , rating);
        myForm.set("comment" , comment);
        myForm.set("productId" , id);

        dispatch(newReview(myForm)); 

        setOpen(false);
    }
    
    
    const options = {
        size : "large",
        value : product.ratings,        
        readOnly : true,
        precision : 0.5
    }
    
    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors());
        }
        if(reviewError){
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Review Submitted Successfully");
            dispatch({type : NEW_REVIEW_RESET})
        }
        if (id) {
            dispatch(getProductDetails(id)); // Use id from useParams
        }
    }, [dispatch, id , error , alert , reviewError , success]);


    return (
        <Fragment >
            {loading ? <Loader/> : 
            (
                <Fragment>
                    <MetaData title={`${product.name} -- ECOMMERCE`}/>
            <div className='ProductDetails'>
                <div>
                    <Carousel 
                        sx={{ width: '100%', maxWidth: 'none', overflow: 'hidden' }} 
                        indicatorIconButtonProps={{
                            style: {
                                padding: '8px',         // Adjusted padding for better spacing
                                color: '#888888',       // Neutral gray for inactive indicators
                                backgroundColor: 'transparent',  // No background for inactive indicators
                            }
                        }}
                        activeIndicatorIconButtonProps={{
                            style: {
                                color: '#ff5722',       // Orange color for the active indicator (without background)
                                backgroundColor: 'transparent',  // No background for the active indicator
                            }
                        }}
                        indicatorContainerProps={{
                            style: {
                                marginTop: '30px',      // Moved slightly further down for better separation
                                textAlign: 'center',    // Centered indicators for a balanced look
                            }
                        }}
                    >
                        {product && product.images && product.images.map((item, i) => (
                            <img
                                className='CarouselImage'
                                key={item.url}
                                src={item.url}
                                alt={`${i} Slide`} // Use template string syntax
                            />
                        ))}
                    </Carousel>
                </div>
                <div>
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className='detailsBlock-2'>
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'> ({product.numOfReviews} Reviews) </span>
                            </div>
                            <div className='detailsBlock-3'>
                                <h1>{`₹ ${product.price}`}</h1>
                                <div className='detailsBlock-3-1'>
                                    <div className='detailsBlock-3-1-1'>
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly value={quantity} type="number" />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button disabled={product.Stock < 1 ? true : false} onClick ={addToCartHandler}>Add to Cart</button>
                                </div>

                                <p>
                                    Status: 
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>

                            </div>
                            <div className='detailsBlock-4'>
                                Description : <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>

                </div>
            </div>

            <h3 className='reviewsHeading'>REVIEWS</h3>

            <Dialog
                aria-labelledby='simple-dialog-title'
                open = { open}
                onClose={submitReviewToggle}
            >

                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent
                    className='submitDialog'
                >
                    <Rating
                        onChange = {(e)=> setRating(e.target.value)}
                        value = {rating}
                        size = "large"
                    />

                    <textarea
                        className='submitDialogTextArea'
                        cols = "30"
                        rows = "5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                </DialogContent>

                <DialogActions>
                    <Button color='secondary' onClick={submitReviewToggle}>Cancel</Button>
                    <Button color='primary' onClick={reviewSubmitHandler}>Submit</Button>
                </DialogActions>

            </Dialog>

            {product.reviews && product.reviews[0] ? (
                <div className='reviews'>
                    {product.reviews && product.reviews.map((review) => <ReviewCard review = {review} />)}
                </div>
            ) : (
                <p className='noReviews'> No Reviews Yet</p>
            )}
        </Fragment>
            )
            }
        </Fragment>
    );
};

export default ProductDetails;
