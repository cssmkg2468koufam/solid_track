import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Success.css"; 

const Success = () => {
    const [searchParams] = useSearchParams();
    const order_id = searchParams.get("order_id");
    const remain_balance = searchParams.get("remain_balance");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");
    const [message, setMessage] = useState("Processing Payment...");
    const [isProcessing, setIsProcessing] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const updateOrderStatus = async () => {
            if (!order_id) {
                setMessage("Invalid payment session. No Order ID found");
                setIsProcessing(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:5001/routes/paymentRoutes/update-order-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        order_id,
                        status: remain_balance ? "advanced-paid" : "paid",
                        remain_balance: remain_balance || null,
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(remain_balance
                        ? `Advance payment successful!`
                        : "Full payment successful!"
                    );
                } else {
                    setMessage("Payment succeeded, but we couldn't update your order status. Please contact support.");
                    console.error("Update failed:", data.error);
                }
            } catch (error) {
                console.error("Error updating order:", error);
                setMessage("An error occurred while processing your payment");
            } finally {
                setIsProcessing(false);
            }
        };

        updateOrderStatus();
    }, [order_id, remain_balance]);

    const handleInvoice = () => {
        if (isProcessing) return;
        
        const paymentData = {
            order_id,
            amount,
            remain_balance,
            status
        };
        sessionStorage.setItem('tempPaymentData', JSON.stringify(paymentData));
        navigate(`/invoice/${order_id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">{message}</p>
                {order_id && (
                    <>
                        <p className="mb-2">Your Order ID: {order_id}</p>
                        {amount && <p className="mb-2">Amount Paid: LKR {amount/100}</p>}
                        <p className="mb-2">Payment Status: {status}</p>
                        {remain_balance && <p className="mb-4">Remaining Balance: LKR {remain_balance/100}</p>}
                    </>
                )}
                <button
                    onClick={handleInvoice}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'View Invoice'}
                </button>
            </div>
        </div>
    );
};

export default Success;