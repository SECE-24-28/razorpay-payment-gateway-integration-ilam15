"use client";

import Script from "next/script";

export default function PaymentPage() {
  async function payNow() {
    try {
      const orderResponse = await fetch("/api/createOrder", {
        method: "POST",
      });

      const data = await orderResponse.json();
      const order = data.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        order_id: order.id,
        amount: order.amount,
        currency: order.currency,

        name: "My Shop",
        description: "Payment of Rs. 500",

        handler: async function (response: any) {
          const verifyPaymentResponse = await fetch(
            "/api/verifyPayment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            }
          );

          const finalResponse = await verifyPaymentResponse.json();

          if (finalResponse.status === "success") {
            alert("Payment Verified");
          } else {
            alert("Payment Verification Failed");
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <h1>Pay Now</h1>

      <button onClick={payNow}>
        Pay ₹500
      </button>
    </>
  );
}