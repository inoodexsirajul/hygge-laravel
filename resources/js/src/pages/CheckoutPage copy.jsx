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
    const [codPayment, { isLoading: codPaymentLoading }] =
        useCodPaymentMutation();
    const [paypalPayment, { isLoading: paypalPaymentLoading }] =
        usePaypalPaymentMutation();

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
        paypalEmail: "",
        shippingMethod: "",
        pickupLocationId: "",
        deliveryType: "shipping",
        termsAgreed: false,
        bill_firstName: "",
        bill_lastName: "",
        bill_email: "",
        bill_phone: "",
        bill_address: "",
        bill_city: "",
        bill_state: "",
        bill_zipCode: "",
        bill_country: "",
        shipToDifferentAddress: false,
    });

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

        if (name === "shipToDifferentAddress") {
            if (checked) {
                setFormData((prev) => ({
                    ...prev,
                    shipToDifferentAddress: true,
                    deliveryType: "shipping",
                    pickupLocationId: "",
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    shipToDifferentAddress: false,
                }));
            }
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let orderData = {
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

        if (formData.shipToDifferentAddress) {
            orderData.billing_address = {
                name: `${formData.bill_firstName} ${formData.bill_lastName}`.trim(),
                email: formData.bill_email,
                phone: formData.bill_phone,
                address: formData.bill_address,
                city: formData.bill_city,
                state: formData.bill_state,
                zip: formData.bill_zipCode,
                country: formData.bill_country,
            };
        }

        if (formData.deliveryType === "shipping") {
            const selected = checkoutData?.shipping_methods?.find(
                (m) => m.id.toString() === formData.shippingMethod
            );
            orderData.shipping_method = selected || { id: 0, cost: 0 };
        } else if (formData.deliveryType === "pickup") {
            const selectedPickup = checkoutData?.pickup_methods?.find(
                (p) => p.id.toString() === formData.pickupLocationId
            );
            orderData.pickup_location = selectedPickup || null;
            orderData.shipping_method = { id: 3, name: "Pick Up", cost: 0 };
        }

        try {
            if (formData.paymentMethod === "cashOnDelivery") {
                await codPayment(orderData).unwrap();
                navigate("/success");
            } else if (formData.paymentMethod === "paypal") {
                if (!formData.paypalEmail)
                    return alert("PayPal email required");
                const res = await paypalPayment(orderData).unwrap();
                if (res.redirect_url) window.location.href = res.redirect_url;
            }
        } catch (err) {
            alert(`Payment failed: ${err?.data?.message || "Try again"}`);
        }
    };

    if (checkoutLoading || summerLoading) {
        return (
            <div className="min-h-screen bg-dark1 flex items-center justify-center">
                <div className="text-cream text-xl">Loading...</div>
            </div>
        );
    }

    const currencyIcon = cartSummery?.data?.currency_icon || "$";
    const subtotal = parseFloat(cartSummery?.data?.sub_total || 0);
    const discount = parseFloat(cartSummery?.data?.discount || 0);

    let shippingCost = 0;
    if (formData.deliveryType === "shipping") {
        const selected = checkoutData?.shipping_methods?.find(
            (m) => m.id.toString() === formData.shippingMethod
        );
        shippingCost = selected ? selected.cost : 0;
    }

    const total = subtotal - discount + shippingCost;

    const cartItems =
        cartSummery?.data?.cart_items?.map((item) => {
            const options = JSON.parse(item.options || "{}");
            return {
                id: item.id,
                name: item.product.name,
                price: parseFloat(item.price),
                quantity: item.quantity,
                image: options.image || item.product.thumb_image || "",
                thumb_image: item.product.thumb_image || "",
                front_image: item.front_image || "",
                back_image: item.back_image || "",
                currency_icon: currencyIcon,
            };
        }) || [];

    const hasImage = (path) =>
        path && path.trim() !== "" && path !== "null" && !path.includes("null");

    const isPickupDisabled = formData.shipToDifferentAddress;

    return (
        <div className="min-h-screen bg-dark1 2xl:px-20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-cream mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
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

                                <div className="space-y-4 mt-4">
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
                                                <option value="">
                                                    Select Country
                                                </option>
                                                {checkoutData?.countries?.map(
                                                    (c) => (
                                                        <option
                                                            key={c}
                                                            value={c}
                                                        >
                                                            {c}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray/30">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="shipToDifferentAddress"
                                            checked={
                                                formData.shipToDifferentAddress
                                            }
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-red focus:ring-red rounded"
                                        />
                                        <span className="text-red font-bold text-lg">
                                            Do you want to ship to a different
                                            address?
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Billing Address Form */}
                            {formData.shipToDifferentAddress && (
                                <div className="mt-8 p-6 bg-dark1/50 rounded-lg border border-red/40">
                                    <h3 className="text-xl font-bold text-cream mb-4">
                                        Billing Address (Different)
                                    </h3>
                                    {/* ... বিলিং ফর্ম ... (আগের মতোই) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="bill_firstName"
                                                required
                                                value={formData.bill_firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 focus:border-red rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Billing first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bill_lastName"
                                                value={formData.bill_lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 focus:border-red rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Billing last name"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="bill_email"
                                                required
                                                value={formData.bill_email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 focus:border-red rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Billing email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="bill_phone"
                                                value={formData.bill_phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 focus:border-red rounded-md focus:outline-none bg-dark1 text-cream"
                                                placeholder="Billing phone"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="bill_address"
                                            required
                                            value={formData.bill_address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-red/50 focus:border-red rounded-md focus:outline-none bg-dark1 text-cream"
                                            placeholder="Billing address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="bill_city"
                                                required
                                                value={formData.bill_city}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 rounded-md bg-dark1 text-cream"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="bill_state"
                                                required
                                                value={formData.bill_state}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 rounded-md bg-dark1 text-cream"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                ZIP *
                                            </label>
                                            <input
                                                type="text"
                                                name="bill_zipCode"
                                                required
                                                value={formData.bill_zipCode}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 rounded-md bg-dark1 text-cream"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray mb-2">
                                                Country *
                                            </label>
                                            <select
                                                name="bill_country"
                                                required
                                                value={formData.bill_country}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-red/50 rounded-md bg-dark1 text-cream"
                                            >
                                                <option value="">
                                                    Select Country
                                                </option>
                                                {checkoutData?.countries?.map(
                                                    (c) => (
                                                        <option
                                                            key={c}
                                                            value={c}
                                                        >
                                                            {c}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* Delivery Method */}
                            <div>
                                <h2 className="text-xl font-semibold text-cream mb-4">
                                    Delivery Method
                                </h2>

                                <div className="space-y-2 mb-4">
                                    {checkoutData?.shipping_methods?.map(
                                        (method) => (
                                            <label
                                                key={method.id}
                                                className="flex items-center space-x-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryType"
                                                    value="shipping"
                                                    checked={
                                                        formData.deliveryType ===
                                                        "shipping"
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

                                {!isPickupDisabled && (
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="pickup"
                                                checked={
                                                    formData.deliveryType ===
                                                    "pickup"
                                                }
                                                onChange={handleInputChange}
                                                className="text-red focus:ring-red"
                                            />
                                            <span className="text-red font-bold">
                                                Pickup from Store (Free)
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {isPickupDisabled && (
                                    <p className="text-sm text-gray italic mt-2">
                                        Pickup from store is not available when
                                        shipping to a different address.
                                    </p>
                                )}

                                {formData.deliveryType === "pickup" &&
                                    checkoutData?.pickup_methods?.length >
                                        0 && (
                                        <div className="mt-4 p-4 bg-dark1/50 rounded-lg border border-red/40">
                                            <h4 className="text-lg font-semibold text-cream mb-3">
                                                Select Pickup Location
                                            </h4>
                                            <div className="space-y-3">
                                                {checkoutData.pickup_methods.map(
                                                    (location) => (
                                                        <label
                                                            key={location.id}
                                                            className="flex items-start space-x-3 cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="pickupLocationId"
                                                                value={location.id.toString()}
                                                                checked={
                                                                    formData.pickupLocationId ===
                                                                    location.id.toString()
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className="mt-1 text-red focus:ring-red"
                                                                required
                                                            />
                                                            <div>
                                                                <p className="text-cream font-medium">
                                                                    {
                                                                        location.store_name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray">
                                                                    Address:{" "}
                                                                    {
                                                                        location.address
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray">
                                                                    Phone:{" "}
                                                                    {
                                                                        location.phone
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray">
                                                                    Email:{" "}
                                                                    {
                                                                        location.email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

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

                    {/* Right: Order Summary — পুরোপুরি ফিক্সড ও সুন্দর */}
                    <div className="bg-dark2 rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-2xl font-bold text-cream mb-6 border-b border-gray/30 pb-3">
                            Order Summary
                        </h2>

                        <div className="space-y-5">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => {
                                    const mainImage = hasImage(item.image)
                                        ? `/${item.image}`
                                        : null;
                                    const thumb = hasImage(item.thumb_image)
                                        ? `/${item.thumb_image}`
                                        : null;
                                    const front = hasImage(item.front_image)
                                        ? `/${item.front_image}`
                                        : null;
                                    const back = hasImage(item.back_image)
                                        ? `/${item.back_image}`
                                        : null;
                                    const itemTotal = (
                                        item.price * item.quantity
                                    ).toFixed(2);

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 pb-5 border-b border-gray/20 last:border-0"
                                        >
                                            <div className="flex-shrink-0">
                                                {mainImage ? (
                                                    <img
                                                        src={mainImage}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray/40 shadow-sm"
                                                        onError={(e) =>
                                                            (e.target.style.display =
                                                                "none")
                                                        }
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-cream text-sm line-clamp-2">
                                                    {item.name}
                                                </h3>

                                                {(thumb || front || back) && (
                                                    <div className="flex gap-2 mt-2">
                                                        {thumb && (
                                                            <img
                                                                src={thumb}
                                                                alt="Thumb"
                                                                className="w-12 h-12 object-contain rounded border border-gray/40 bg-white p-1"
                                                            />
                                                        )}
                                                        {front && (
                                                            <img
                                                                src={front}
                                                                alt="Front"
                                                                className="w-12 h-12 object-contain rounded border border-gray/40 bg-white p-1"
                                                            />
                                                        )}
                                                        {back && (
                                                            <img
                                                                src={back}
                                                                alt="Back"
                                                                className="w-12 h-12 object-contain rounded border border-gray/40 bg-white p-1"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs text-gray">
                                                        Qty: {item.quantity}
                                                    </span>
                                                    <span className="text-sm font-bold text-cream">
                                                        {currencyIcon}
                                                        {itemTotal}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray py-8">
                                    Your cart is empty
                                </p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray/40 space-y-3">
                            <div className="flex justify-between text-cream">
                                <span>Subtotal</span>
                                <span className="font-medium">
                                    {currencyIcon}
                                    {subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-cream">
                                <span>Discount</span>
                                <span className="text-green-400">
                                    -{currencyIcon}
                                    {discount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-cream">
                                <span>Shipping</span>
                                <span
                                    className={
                                        shippingCost === 0
                                            ? "text-green-400"
                                            : ""
                                    }
                                >
                                    {shippingCost === 0
                                        ? "Free"
                                        : `${currencyIcon}${shippingCost.toFixed(
                                              2
                                          )}`}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-gray/40 flex justify-between text-lg font-bold text-cream">
                                <span>Total</span>
                                <span className="text-red">
                                    {currencyIcon}
                                    {total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {formData.deliveryType === "pickup" && (
                            <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                                <p className="text-sm text-green-300 font-medium text-center">
                                    Pickup from Store Selected (Free Shipping)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
