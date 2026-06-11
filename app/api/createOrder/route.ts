import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST() {
    try {
        const order = await razorpay.orders.create({
            amount: 100 * 1, 
            currency: "INR",
        });
        console.log(order);
        return Response.json({ status: "success", order: order });
    } catch (error) {
        console.log(error);
        return Response.json({ status: "error" });
    }
}