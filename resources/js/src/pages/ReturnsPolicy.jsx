// pages/Returns.jsx  অথবা components/ReturnsPolicy.jsx
import React from "react";
import {
    FaUndoAlt,
    FaEnvelope,
    FaClock,
    FaHeart,
    FaBoxOpen,
} from "react-icons/fa";

const ReturnsPolicy = () => {
    return (
        <div className="min-h-screen bg-cream py-20 px-6 2xl:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-dark2 mb-4">
                        Refunds & Returns
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700">
                        Your happiness is our priority ♡
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 text-center">
                        <FaHeart className="text-6xl text-cream mx-auto mb-4" />
                        <p className="text-cream text-2xl font-medium">
                            We want you to love everything you buy from us
                        </p>
                    </div>

                    <div className="p-12 md:p-16 space-y-12">
                        {/* Main Policy */}
                        <div className="text-center max-w-3xl mx-auto">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                If you receive a{" "}
                                <strong>defective or incorrect item</strong>,
                                we’re happy to offer a{" "}
                                <strong>full refund or replacement</strong> — no
                                questions asked.
                            </p>
                            <p className="text-lg text-gray-700 mt-6">
                                Custom-made products are{" "}
                                <strong>non-refundable</strong> unless they
                                arrive damaged or incorrect.
                            </p>
                        </div>

                        {/* Key Info Grid */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <FaClock className="text-3xl text-green-700" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    Return Window
                                </h3>
                                <p className="text-gray-700">
                                    Contact us within <strong>14 days</strong>{" "}
                                    of delivery
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <FaEnvelope className="text-3xl text-green-700" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    How to Start
                                </h3>
                                <p className="text-gray-700">
                                    Email us at
                                    <br />
                                    <a
                                        href="mailto:hyggecotton2025@gmail.com"
                                        className="text-green-700 font-bold hover:underline"
                                    >
                                        hyggecotton2025@gmail.com
                                    </a>
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <FaUndoAlt className="text-3xl text-green-700" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    Refund Time
                                </h3>
                                <p className="text-gray-700">
                                    Processed within{" "}
                                    <strong>5–10 business days</strong> once
                                    approved
                                </p>
                            </div>
                        </div>

                        {/* What to Include */}
                        <div className="bg-green-50 rounded-2xl p-8 text-center">
                            <FaBoxOpen className="text-4xl text-green-700 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-800">
                                Please include your{" "}
                                <strong>order number</strong> and{" "}
                                <strong>photos</strong> if the item is damaged
                                or incorrect.
                            </p>
                        </div>

                        {/* Final Message */}
                        <div className="pt-10 border-t border-gray-200 text-center">
                            <p className="text-2xl text-gray-800 font-medium italic">
                                We’re here to make things right — always.
                                <br />
                                <span className="text-green-700">
                                    Just reach out. We’ve got you.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600 mt-12 text-sm">
                    Questions? Email us anytime at hyggecotton2025@gmail.com
                </p>
            </div>
        </div>
    );
};

export default ReturnsPolicy;
