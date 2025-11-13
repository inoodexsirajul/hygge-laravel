import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
    useGetCartSummeryQuery,
    useRemoveFromCartMutation,
    useUpdateCartQuantityMutation,
} from "../redux/services/eCommerceApi";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
// import baseurl from "../utils/url";

const CartPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    // Fetch cart summary
    const {
        data: cartSummery,
        isLoading: isSummaryLoading,
        error: summaryError,
    } = useGetCartSummeryQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    console.log(cartSummery);

    // Mutations for removing, updating cart items, and applying coupon
    const [removeFromCartMutation] = useRemoveFromCartMutation();
    const [updateCartQuantityMutation] = useUpdateCartQuantityMutation();

    // Handle cart errors
    useEffect(() => {
        if (summaryError) {
            if (summaryError?.status === 401) {
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else {
                toast.error(
                    summaryError?.data?.message || "Failed to fetch cart data"
                );
                // console.log(cartError);
            }
        }
    }, [summaryError, navigate]);

    // Handle cart summary errors
    useEffect(() => {
        if (summaryError) {
            if (summaryError?.status === 401) {
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else {
                toast.error(summaryError?.data?.message);
            }
        }
    }, [summaryError, navigate]);

    // Handle quantity change
    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartQuantityMutation({
                id,
                quantity: newQuantity,
            }).unwrap();
            toast.success("Quantity updated successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update quantity");
        }
    };

    // Remove item from cart
    const removeFromCart = async (id) => {
        try {
            await removeFromCartMutation(id).unwrap();
            toast.success("Item removed from cart!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to remove item");
        }
    };

    return (
        <div className="min-h-screen py-8 px-5 2xl:px-20 bg-dark1">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl md:text-3xl md:font-bold text-cream mb-8">
                    Your Shopping Cart
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="md:col-span-2">
                        <div className="bg-dark2 rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray/30">
                                <h2 className="text-xl font-semibold text-gray">
                                    Cart Items (
                                    {cartSummery?.data?.cart_items?.length || 0}
                                    )
                                </h2>
                            </div>

                            <div className="divide-y divide-gray/30">
                                {/* Loading State */}
                                {isSummaryLoading ? (
                                    <div className="p-6 text-center">
                                        <p className="text-gray">Loading...</p>
                                    </div>
                                ) : cartSummery?.data?.cart_items?.length ===
                                  0 ? (
                                    /* Empty Cart */
                                    <div className="p-6 text-center">
                                        <p className="text-gray">
                                            Your cart is empty
                                        </p>
                                    </div>
                                ) : (
                                    /* Cart Items */
                                    cartSummery?.data?.cart_items?.map(
                                        (item) => {
                                            // Helper: Check if image path is valid
                                            const hasImage = (path) =>
                                                path && path.trim() !== "";

                                            const thumb = hasImage(
                                                item.product?.thumb_image
                                            )
                                                ? `/${item.product.thumb_image}`
                                                : null;
                                            const front = hasImage(
                                                item?.front_image
                                            )
                                                ? `/${item.front_image}`
                                                : null;
                                            const back = hasImage(
                                                item?.back_image
                                            )
                                                ? `/${item.back_image}`
                                                : null;

                                            const hasAnyImage =
                                                thumb || front || back;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                                                >
                                                    {/* Images Section */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Show images only if they exist */}
                                                        {thumb && (
                                                            <img
                                                                src={thumb}
                                                                alt={
                                                                    item.product
                                                                        .name
                                                                }
                                                                className="w-24 h-24 object-cover rounded-lg"
                                                            />
                                                        )}
                                                        {front && (
                                                            <img
                                                                src={front}
                                                                alt={`${item.product.name} - Front`}
                                                                className="w-24 h-24 object-contain rounded-lg"
                                                            />
                                                        )}
                                                        {back && (
                                                            <img
                                                                src={back}
                                                                alt={`${item?.product.name} - Back`}
                                                                className="w-24 h-24 object-cover rounded-lg"
                                                            />
                                                        )}

                                                        {/* No Image Placeholder */}
                                                        {!hasAnyImage && (
                                                            <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-cream">
                                                            {
                                                                item?.product
                                                                    ?.name
                                                            }
                                                        </h3>

                                                        <p className="text-sm md:text-lg font-bold text-gray mt-1">
                                                            ${" "}
                                                            {Number(item.price)}
                                                        </p>

                                                        <p className="text-sm md:text-sm font-bold text-gray mt-1">
                                                            Extra Price $
                                                            {Number(
                                                                item.extra_price
                                                            )}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-3 mt-4">
                                                            {/* Quantity Controls */}
                                                            <div className="flex">
                                                                <button
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            item.quantity -
                                                                                1
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                                    disabled={
                                                                        item.quantity <=
                                                                        1
                                                                    }
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-12 h-8 flex items-center justify-center bg-gray-100 font-medium">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            item.quantity +
                                                                                1
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {/* <Link
                                                                to={`/product/${item?.product?.slug}/customize`}
                                                                className="text-green-600 hover:text-green-400 text-sm md:text-base transition"
                                                            >
                                                                Customize
                                                                Product
                                                            </Link> */}

                                                            <button
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="text-red-600 cursor-pointer hover:text-red-700 text-sm md:text-sm transition"
                                                            >
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total Price */}
                                                    <div className="mt-2 sm:mt-0">
                                                        <p className="text-lg font-bold text-cream">
                                                            $
                                                            {Number(
                                                                item.price
                                                            ) * item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="md:col-span-1">
                        <div className="bg-dark2 rounded-lg shadow-md sticky top-8">
                            <div className="p-6 border-b border-gray/30">
                                <h2 className="text-xl font-semibold text-cream">
                                    Order Summary
                                </h2>
                            </div>

                            <div className="p-6">
                                {isSummaryLoading ? (
                                    <p className="text-gray">
                                        Loading summary...
                                    </p>
                                ) : (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-cream">
                                                Subtotal
                                            </span>
                                            <span className="font-medium text-cream">
                                                $
                                                {cartSummery?.data?.sub_total ||
                                                    0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between mb-4">
                                            <span className="text-cream">
                                                Discount
                                            </span>
                                            <span className="font-medium text-green-600">
                                                -$
                                                {Number(
                                                    cartSummery?.data
                                                        ?.discount || 0
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray/30">
                                            <span className="text-cream">
                                                Total
                                            </span>
                                            <span className="text-cream">
                                                $
                                                {cartSummery?.data?.sub_total ||
                                                    0}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <button
                                        onClick={() => {
                                            if (!token) {
                                                toast.warn(
                                                    "Please login to proceed to checkout!",
                                                    {
                                                        position: "top-center",
                                                        autoClose: 3000,
                                                    }
                                                );
                                            } else {
                                                navigate("/checkout");
                                            }
                                        }}
                                        className="w-full block text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={
                                            isSummaryLoading ||
                                            (cartSummery?.data?.cart_items
                                                ?.length || 0) === 0
                                        }
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
