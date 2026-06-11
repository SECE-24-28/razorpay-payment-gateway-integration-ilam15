import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { order_id, payment_id, signature } = body;

        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(order_id + "|" + payment_id)
            .digest("hex");

        const isValid = signature === generatedSignature;

        if (!isValid) {
            return Response.json({
                status: "failure",
                message: "Signature verification failed"
            });
        }
        console.log("rz_pay payment: ", payment_id);
        console.log("rz_pay order_id: ", order_id);
        console.log("rz_pay signature: ", signature);

        return Response.json({
            status: "success"
        });
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return Response.json({
            status: "error",
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}

// get payment_id, order_id, signature from request objext
// generate a signature
// match the signatire with the returned razorpay signature
// if (match) -> return Response as success otherwise fail