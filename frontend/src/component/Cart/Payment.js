import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const alert = useAlert();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const [paymentMethod, setPaymentMethod] = useState("stripe"); // Default is Stripe

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (paymentMethod === "cod") {
            // Handle Cash on Delivery
            order.paymentInfo = {
                id: `COD-${Date.now()}`,
                status: "Cash on Delivery",
            };

            dispatch(createOrder(order));
            navigate("/success");
        } else {
            payBtn.current.disabled = true;
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                const { data } = await axios.post("/api/v1/payment/process", paymentData, config);
                const client_secret = data.client_secret;

                if (!stripe || !elements) return;

                const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name,
                            email: user.email,
                            address: {
                                line1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                postal_code: shippingInfo.pinCode,
                                country: shippingInfo.country,
                            },
                        },
                    },
                });

                if (result.error) {
                    payBtn.current.disabled = false;
                    alert.error(result.error.message);
                } else {
                    if (result.paymentIntent.status === "succeeded") {
                        order.paymentInfo = {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status,
                        };

                        dispatch(createOrder(order));
                        navigate("/success");
                    } else {
                        alert.error("There's some issue while processing payment");
                    }
                }
            } catch (error) {
                payBtn.current.disabled = false;
                alert.error(error.response.data.message);
            }
        }
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />

            <div className="paymentPageContainer">
                <div className="paymentMethodContainer">
                    <Typography>Select Payment Method</Typography>
                    <div className="paymentMethod">
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="stripe"
                                checked={paymentMethod === "stripe"}
                                onChange={() => setPaymentMethod("stripe")}
                            /> Stripe (Credit / Debit)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                            /> Cash on Delivery                        </label>
                    </div>
                </div>

                <div className="paymentContainer">
                    {paymentMethod === "stripe" && (
                        <form className="paymentForm" onSubmit={submitHandler}>
                            <Typography>Card Info</Typography>

                            <div>
                                <CreditCardIcon />
                                <CardNumberElement className="paymentInput" />
                            </div>
                            <div>
                                <EventIcon />
                                <CardExpiryElement className="paymentInput" />
                            </div>
                            <div>
                                <VpnKeyIcon />
                                <CardCvcElement className="paymentInput" />
                            </div>

                            <input
                                type="submit"
                                value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                                ref={payBtn}
                                className="paymentFormBtn"
                            />
                        </form>
                    )}

                    {paymentMethod === "cod" && (
                        <div className="codContainer">
                            <Typography>
                                You have selected Cash on Delivery. Confirm your order to proceed.
                            </Typography>
                            <button className="codBtn" onClick={submitHandler}>
                                Confirm Order
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default Payment;
