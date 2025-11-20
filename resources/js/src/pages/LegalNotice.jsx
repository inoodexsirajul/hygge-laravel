// pages/LegalNotice.jsx
import React from "react";
import {
    FaCopyright,
    FaHome,
    FaEnvelope,
    FaPhoneAlt,
    FaShieldAlt,
} from "react-icons/fa";

const LegalNotice = () => {
    return (
        <div className="min-h-screen bg-cream py-20 px-6 2xl:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-dark2 mb-4">
                        Legal Notice
                    </h1>
                    <p className="text-md md:text-xl text-gray-700">
                        Protecting creativity, one stitch at a time
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Copyright Section */}
                    <div className="p-8 md:p-16 border-b border-gray-100">
                        <div className="flex flex-col xl:flex-row items-start gap-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full shrink-0 flex items-center justify-center">
                                <FaCopyright className="text-3xl text-red-700" />
                            </div>
                            <div>
                                <h2 className="text-xl lg:text-3xl font-bold text-dark2 mb-6">
                                    Copyright & Intellectual Property
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    All images, designs, logos, text, and
                                    content on this website are the exclusive
                                    property of <strong>Hygge Cotton</strong> or
                                    its licensors.
                                </p>
                                <p className="text-lg text-gray-700 mt-6 leading-relaxed">
                                    Unauthorized reproduction, distribution,
                                    modification, or use of any material from
                                    this website is{" "}
                                    <strong>strictly prohibited</strong> without
                                    prior written consent from Hygge Cotton.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="p-12 md:p-16 bg-linear-to-r from-green-50 to-emerald-50">
                        <h2 className="text-lg lg:text-3xl  font-bold text-dark2 mb-10 flex items-center gap-4">
                            <FaShieldAlt
                                className="text-3xl text-red "
                                size={40}
                            />
                            Official Company Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 text-lg">
                            <div className="flex items-start gap-4">
                                <FaHome className="text-2xl text-red  mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Company Name
                                    </p>
                                    <p className="text-gray-700">
                                        Hygge Cotton
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FaHome className="text-2xl text-red  mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Registered Address
                                    </p>
                                    <p className="text-gray-700">
                                        Frederiksberggade 25A
                                        <br />
                                        1459 København K<br />
                                        Denmark
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FaEnvelope className="text-2xl text-red mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Email
                                    </p>
                                    <p className="text-gray-700">
                                        <a
                                            href="mailto:hyggecotton2025@gmail.com"
                                            className="hover:text-green-700 underline"
                                        >
                                            hyggecotton2025@gmail.com
                                        </a>
                                        <br />
                                        <a
                                            href="mailto:support@hyggecotton.dk"
                                            className="hover:text-green-700 underline"
                                        >
                                            support@hyggecotton.dk
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FaPhoneAlt className="text-2xl text-red mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Phone
                                    </p>
                                    <a
                                        href="tel:+4553713518"
                                        className="text-gray-700 hover:text-green-700 underline"
                                    >
                                        +45 53 71 35 18
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Message */}
                    <div className="bg-red/80 py-12 text-center">
                        <p className="text-cream text-2xl font-medium">
                            Thank you for respecting our work and creativity
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 mt-12 text-sm">
                    © {new Date().getFullYear()} Hygge Cotton – Copenhagen,
                    Denmark
                </p>
            </div>
        </div>
    );
};

export default LegalNotice;
