// Title
// Description
// Price -> cents

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51IfLRhDHco0tJVJSBfkjim6BrzzxjgeGjnkD9TxwBe0oshRuQ3gx1lqv7ZBXHZ38TgoJOqcB7YQ2ZNgSLkGSbDnB00qRaTuyAB"
);

const item = {
  id: 1,
  title: "Product 1",
  description: "Description for product 1",
  price: 10,
  priceId: "price_1IfNkpDHco0tJVJS3sNn9hlC",
};

// [product1, product2, etc]

const Products = () => {
  // Cart is going to be a list of product ids
  const [cart, setCart] = useState([]);

  const addToCart = () => {
    setCart([...cart, item]);
  };

  const calculateCartTotal = () => {
    return cart.reduce((acc, item) => (acc += item.price), 0);
  };

  const calculateLineItems = () => {
    // { [priceId]: quantity }
    const priceIdToQuantityObj = cart.reduce((acc, item) => {
      const alreadyExists = !!acc[item.priceId];

      if (alreadyExists) {
        acc[item.priceId] += 1;
      } else {
        acc[item.priceId] = 1;
      }

      return acc;
    }, {});

    return Object.keys(priceIdToQuantityObj).map((key) => ({
      price: key,
      quantity: priceIdToQuantityObj[key],
    }));
    // return cart.reduce((acc, item) => {
    //   const alreadyExists = acc.some((obj) => obj.priceId === item.priceId)

    //   if (alreadyExists) {
    //     const existingItem = acc.find((obj) => obj.priceId === item.priceId)
    //     existingItem.quantity += 1
    //     acc
    //   }
    // }, [])
  };

  const handleClick = async (event) => {
    // console.log(calculateLineItems());
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    console.log(stripe);
    const { error } = await stripe.redirectToCheckout({
      lineItems: calculateLineItems(),
      mode: "payment",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
  };

  return (
    <div>
      <h1>Products Page!</h1>
      <div>
        <p>{item.title}</p>
        <p>{item.description}</p>
        <p>{item.price}</p>
        <button onClick={addToCart}>Add to cart</button>
      </div>
      <div>
        <h3>Cart</h3>
        {cart.map((i) => (
          <div key={i}>{i.title}</div>
        ))}
        <p>{calculateCartTotal()}</p>
        <button onClick={handleClick}>Checkout</button>
      </div>
    </div>
  );
};

export default Products;
