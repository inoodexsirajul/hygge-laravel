// pages/PrivacyPolicy.jsx
import React from "react";
import { FaShieldAlt, FaCookieBite, FaLock, FaHeart } from "react-icons/fa";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-cream py-20 px-6 2xl:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl lg:text-4xl font-bold text-dark2 mb-6">
                        Privacy & Cookies Policy
                    </h1>
                    <p className="text-md lg:text-xl text-gray-700">
                        Your trust means everything to us ♡
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Privacy Section */}
                    <div className="p-4 md:p-16 border-b border-gray-100">
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full shrink-0 flex items-center justify-center">
                                <FaShieldAlt className="text-3xl text-green-700" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-dark2 mb-4">
                                    Your Privacy is Sacred
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    We collect and process{" "}
                                    <strong>
                                        only the information necessary
                                    </strong>{" "}
                                    to:
                                </p>
                                <ul className="mt-6 space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 mt-1">
                                            ✓
                                        </span>
                                        Fulfill and ship your orders
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 mt-1">
                                            ✓
                                        </span>
                                        Improve our products and services
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 mt-1">
                                            ✓
                                        </span>
                                        Provide you with caring customer support
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red/10 rounded-2xl p-8 mt-10">
                            <p className="inline-flex text-xl font-medium text-red items-center gap-3  ">
                                <FaLock className="text-2xl" size={30} />
                                We never sell or share your personal data with
                                third parties for marketing purposes.
                            </p>
                        </div>
                    </div>

                    {/* Cookies Section */}
                    <div className="p-4 md:p-16">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                <FaCookieBite className="text-3xl text-amber-700" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-dark2 mb-4">
                                    Cookies & Ads
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    We use cookies to:
                                </p>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-600 mt-1">
                                            •
                                        </span>
                                        Make your browsing experience smooth and
                                        personal
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-600 mt-1">
                                            •
                                        </span>
                                        Remember your preferences (like cart
                                        items)
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-600 mt-1">
                                            •
                                        </span>
                                        Understand how we can serve you better
                                    </li>
                                </ul>
                                <p className="text-lg text-gray-700 mt-8">
                                    You can{" "}
                                    <strong>manage or disable cookies</strong>{" "}
                                    anytime in your browser settings — we’ll
                                    still love you the same ♡
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Message */}
                    <div className="bg-red/80 py-12 text-center px-4">
                        <p className="text-cream text-2xl font-medium flex items-center justify-center gap-3">
                            <FaHeart className="text-3xl" />
                            Your data is safe with us — always
                            <FaHeart className="text-3xl" />
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 mt-12 text-sm">
                    Last updated: November 2025 · Copenhagen, Denmark
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
