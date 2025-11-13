import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    useCheckoutQuery,
    useGetCartSummeryQuery,
    useCodPaymentMutation,
    usePaypalPaymentMutation,
} from "../redux/services/eCommerceApi";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { data: checkoutData, isLoading: checkoutLoading } =
        useCheckoutQuery();
    const { data: cartSummery, isLoading: summerLoading } =
        useGetCartSummeryQuery();
    const [
        codPayment,
        { isLoading: codPaymentLoading, error: codPaymentError },
    ] = useCodPaymentMutation();
    const [
        paypalPayment,
        { isLoading: paypalPaymentLoading, error: paypalPaymentError },
    ] = usePaypalPaymentMutation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        paymentMethod: "cashOnDelivery",
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        paypalEmail: "",
        payoneerEmail: "",
        mobilePayNumber: "",
        shippingMethod: "",
        giftMessage: "",
        termsAgreed: false,
    });

    // Set default shipping method
    useEffect(() => {
        if (
            checkoutData?.shipping_methods?.length > 0 &&
            !formData.shippingMethod
        ) {
            setFormData((prev) => ({
                ...prev,
                shippingMethod: checkoutData.shipping_methods[0].id.toString(),
            }));
        }
    }, [checkoutData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            shipping_method: checkoutData?.shipping_methods?.find(
                (method) => method.id.toString() === formData.shippingMethod
            ) || { id: 0, name: "", type: "", cost: 0 },
            shipping_address: {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zipCode,
                country: formData.country,
            },
        };

        try {
            if (formData.paymentMethod === "cashOnDelivery") {
                const response = await codPayment(orderData).unwrap();
                console.log("COD Payment Response:", response);
                navigate("/success");
            } else if (formData.paymentMethod === "paypal") {
                if (!formData.paypalEmail) {
                    alert("Please provide a PayPal email address.");
                    return;
                }
                const paypalData = { ...orderData };
                const response = await paypalPayment(paypalData).unwrap();
                console.log("PayPal Payment Response:", response);
                if (response.status === "success" && response.redirect_url) {
                    window.location.href = response.redirect_url;
                } else {
                    throw new Error("No redirect URL provided by PayPal.");
                }
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert(
                `Payment failed: ${error?.data?.message || "Please try again."}`
            );
        }
    };

    if (checkoutLoading || summerLoading) {
        return (
            <div className="min-h-screen bg-dark1 flex items-center justify-center">
                <div className="text-cream text-xl">Loading...</div>
            </div>
        );
    }

    // Process cart items with front/back images
    const cartItems =
        cartSummery?.data?.cart_items?.map((item) => {
            const options = JSON.parse(item.options || "{}");
            return {
                id: item.id,
                name: item.product.name,
                price: parseFloat(item.price),
                quantity: item.quantity,
                image: options.image || item.product.thumb_image,
                thumb_image: item.product.thumb_image,
                front_image: item.front_image,
                back_image: item.back_image,
                currency_icon: cartSummery?.data?.currency_icon || "$",
            };
        }) || [];

    // Calculate totals
    const subtotal = parseFloat(cartSummery?.data?.sub_total || 0);
    const discount = parseFloat(cartSummery?.data?.discount || 0);
    const currencyIcon = cartSummery?.data?.currency_icon || "$";
    const selectedShippingMethod = checkoutData?.shipping_methods?.find(
        (method) => method.id.toString() === formData.shippingMethod
    );
    const shipping = selectedShippingMethod ? selectedShippingMethod.cost : 0;
    const total = subtotal - discount + shipping;

    // Helper: Check if image exists
    const hasImage = (path) => path && path.trim() !== "" && path !== "null";

    return (
        <div className="min-h-screen bg-dark1 2xl:px-20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-cream mb-8">Checkout</h1>

                {(codPaymentError || paypalPaymentError) && (
                    <div className="mb-4 p-4 bg-red-900/20 border border-red-500 text-red-400 rounded">
                        Error processing payment:{" "}
                        {(codPaymentError || paypalPaymentError)?.data
                            ?.message || "Please try again."}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Checkout Form */}
                    <div className="bg-dark2 rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-xl font-semibold text-cream mb-4">
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Your email address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="text-xl font-semibold text-cream mb-4">
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Enter your city"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Enter your state"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                required
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                Country *
                                            </label>
                                            <select
                                                name="country"
                                                required
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray/30 focus:border-gray rounded-md focus:outline-none bg-dark1 text-cream"
                                            >
                                                <option
                                                    value=""
                                                    className="text-dark1"
                                                >
                                                    Select Country
                                                </option>
                                                {checkoutData?.countries?.map(
                                                    (country) => (
                                                        <option
                                                            key={country}
                                                            value={country}
                                                            className="text-dark1"
                                                        >
                                                            {country}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-xl font-semibold text-cream mb-4">
                                    Payment Method
                                </h2>
                                <div className="space-y-2">
                                    {[
                                        "cashOnDelivery",
                                        "paypal",
                                        "payoneer",
                                        "mobilePay",
                                    ].map((method) => (
                                        <label
                                            key={method}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={
                                                    formData.paymentMethod ===
                                                    method
                                                }
                                                onChange={handleInputChange}
                                                className="text-red focus:ring-red"
                                            />
                                            <span className="text-gray capitalize">
                                                {method
                                                    .replace(/([A-Z])/g, " $1")
                                                    .trim()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Payment Fields */}
                            {formData.paymentMethod === "paypal" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray mb-2">
                                        PayPal Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="paypalEmail"
                                        required
                                        value={formData.paypalEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray/30 rounded-md bg-dark1 text-cream"
                                        placeholder="Enter your PayPal email"
                                    />
                                </div>
                            )}

                            {/* Shipping Method */}
                            <div>
                                <h2 className="text-xl font-semibold text-cream mb-4">
                                    Shipping Method
                                </h2>
                                <div className="space-y-2">
                                    {checkoutData?.shipping_methods?.map(
                                        (method) => (
                                            <label
                                                key={method.id}
                                                className="flex items-center space-x-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name="shippingMethod"
                                                    value={method.id.toString()}
                                                    checked={
                                                        formData.shippingMethod ===
                                                        method.id.toString()
                                                    }
                                                    onChange={handleInputChange}
                                                    className="text-red focus:ring-red"
                                                />
                                                <span className="text-gray">
                                                    {method.name} -{" "}
                                                    {currencyIcon}
                                                    {method.cost}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="termsAgreed"
                                    required
                                    checked={formData.termsAgreed}
                                    onChange={handleInputChange}
                                    className="text-red focus:ring-red"
                                />
                                <span className="text-sm text-cream">
                                    I agree to the terms and conditions *
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={
                                    codPaymentLoading || paypalPaymentLoading
                                }
                                className={`w-full bg-red text-white py-3 px-4 rounded-md transition ${
                                    codPaymentLoading || paypalPaymentLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-red/90"
                                }`}
                            >
                                {codPaymentLoading || paypalPaymentLoading
                                    ? "Processing..."
                                    : "Complete Order"}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-dark2 rounded-lg shadow-md p-6 h-fit">
                        <h2 className="text-xl font-semibold text-cream mb-6">
                            Order Summary
                        </h2>

                        {/* Cart Items */}
                        <div className="space-y-6 mb-6">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => {
                                    const thumb = hasImage(item.thumb_image)
                                        ? `/${item.thumb_image}`
                                        : null;
                                    const front = hasImage(item.front_image)
                                        ? `/${item.front_image}`
                                        : null;
                                    const back = hasImage(item.back_image)
                                        ? `/${item.back_image}`
                                        : null;
                                    const hasAnyImage = thumb || front || back;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 border-b border-gray/30 pb-4"
                                        >
                                            {/* Main Thumbnail */}
                                            <img
                                                src={`/${item.image}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded border border-gray/40"
                                                onError={(e) =>
                                                    (e.target.style.display =
                                                        "none")
                                                }
                                            />

                                            {/* Custom Images: Thumb, Front, Back */}
                                            <div className="flex flex-wrap gap-2">
                                                {thumb && (
                                                    <img
                                                        src={thumb}
                                                        alt="Thumbnail"
                                                        className="w-20 h-20 object-contain rounded border border-gray/40 bg-white p-1"
                                                        onError={(e) =>
                                                            (e.target.style.display =
                                                                "none")
                                                        }
                                                    />
                                                )}
                                                {front && (
                                                    <img
                                                        src={front}
                                                        alt="Front"
                                                        className="w-20 h-20 object-contain rounded border border-gray/40 bg-white p-1"
                                                        onError={(e) =>
                                                            (e.target.style.display =
                                                                "none")
                                                        }
                                                    />
                                                )}
                                                {back && (
                                                    <img
                                                        src={back}
                                                        alt="Back"
                                                        className="w-20 h-20 object-contain rounded border border-gray/40 bg-white p-1"
                                                        onError={(e) =>
                                                            (e.target.style.display =
                                                                "none")
                                                        }
                                                    />
                                                )}
                                                {!hasAnyImage && (
                                                    <div className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-cream">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-gray">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-sm font-medium text-cream">
                                                {item.currency_icon}
                                                {item.price * item.quantity}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-cream">Your cart is empty</p>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 border-t border-gray/60 pt-4">
                            <div className="flex justify-between text-cream">
                                <span>Subtotal</span>
                                <span>
                                    {currencyIcon}
                                    {subtotal}
                                </span>
                            </div>
                            <div className="flex justify-between text-cream">
                                <span>Discount</span>
                                <span>
                                    {currencyIcon}
                                    {discount}
                                </span>
                            </div>
                            <div className="flex justify-between text-cream">
                                <span>Shipping</span>
                                <span>
                                    {currencyIcon}
                                    {shipping}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t border-gray/60 pt-3 text-cream">
                                <span>Total</span>
                                <span>
                                    {currencyIcon}
                                    {total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
