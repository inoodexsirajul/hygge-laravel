// pages/AboutPage.jsx
import React from "react";
import { Link } from "react-router";
import { FaLeaf, FaHeart, FaHandsHelping, FaStar } from "react-icons/fa";
import founder from "../assets/founder.jpg";

const About = () => {
    return (
        <div className="min-h-screen bg-cream text-dark2">
            {/* Hero Section */}
            <section className="relative py-24 px-5 2xl:px-20 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Welcome to{" "}
                        <span className="text-red">Hygge Cotton</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-xl mx-auto leading-relaxed">
                        Where comfort meets conscience. Inspired by the Danish
                        art of living well —
                        <span className="font-medium text-red">hygge</span> — we
                        craft everyday essentials that feel soft on your skin
                        and gentle on the earth.
                    </p>
                </div>
                <div className="absolute inset-0 -z-10 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-green-100 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-5 2xl:px-20 bg-dark1/5">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Our Story
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-6">
                            Hygge Cotton was born in the heart of Copenhagen as
                            a brother brand of{" "}
                            <span className="font-semibold text-green-700">
                                Danish Souvenir
                            </span>
                            .
                        </p>
                        <p className="text-lg leading-relaxed text-gray-700">
                            Founded by <strong>Mohammed Tofayel</strong> with
                            nothing but a dream, a small budget, and an
                            unbreakable passion for authentic Danish
                            craftsmanship — what started as a one-man journey
                            has now blossomed into a beloved lifestyle brand.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-700 mt-6">
                            In 2025, we took a brave step forward. We wanted
                            more than souvenirs. We wanted to bring{" "}
                            <em>true comfort</em> into people's daily lives —
                            sustainably, thoughtfully, and beautifully.
                        </p>
                        <p className="text-lg leading-relaxed font-medium text-green-800 mt-6">
                            That’s when Hygge Cotton was born.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src={founder}
                            alt="Mohammed Tofayel - Founder"
                            className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-red text-cream p-6 rounded-xl shadow-xl">
                            <p className="text-2xl font-bold">
                                Mohammed Tofayel
                            </p>
                            <p className="text-sm opacity-90">
                                Founder & Dreamer
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Cards */}
            <section className="py-20 px-5 2xl:px-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Our Philosophy
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: (
                                    <FaHeart className="text-5xl text-red-500" />
                                ),
                                title: "Comfort is a Way of Life",
                                desc: "Soft fabrics, calm minds, warm hearts — every piece is made to help you slow down and feel at home.",
                            },
                            {
                                icon: (
                                    <FaLeaf className="text-5xl text-green-600" />
                                ),
                                title: "Sustainability First",
                                desc: "Natural, recycled cotton. Ethical production. A lighter footprint — because comfort should never cost the earth.",
                            },
                            {
                                icon: (
                                    <FaHandsHelping className="text-5xl text-amber-600" />
                                ),
                                title: "Made with Love & Honesty",
                                desc: "From sketch to stitch, every product carries the care of skilled hands and a transparent heart.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-shadow text-center"
                            >
                                <div className="mb-6 flex justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customization Section */}
            {/* <section className="py-20 px-5 2xl:px-20 bg-green-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        Customization — Made for You
                    </h2>
                    <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
                        Your comfort should feel personal. That’s why every
                        T-shirt, hoodie, or tote bag can be custom-made with
                        your design, your words, your story.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <img
                                src="/images/custom1.jpg"
                                alt="Custom Print"
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                            <p className="font-semibold">Upload Your Art</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <img
                                src="/images/custom2.jpg"
                                alt="Custom Hoodie"
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                            <p className="font-semibold">We Perfect It</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <img
                                src="/images/custom3.jpg"
                                alt="Happy Customer"
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                            <p className="font-semibold">Wear Your Story</p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Values Grid */}
            <section className="py-20 px-5 2xl:px-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            title: "Peace of Mind",
                            desc: "Shop with confidence. We're here for you — always.",
                            icon: "🤍",
                        },
                        {
                            title: "Dedication",
                            desc: "Every stitch tells a story of care and craftsmanship.",
                            icon: "🪡",
                        },
                        {
                            title: "Our Promise",
                            desc: "Never compromise on quality, ethics, or comfort.",
                            icon: (
                                <FaStar
                                    className="text-yellow-500 text-4xl"
                                    size={60}
                                />
                            ),
                        },
                        {
                            title: "Conscious Growth",
                            desc: "Growing slowly, sustainably, and with purpose.",
                            icon: (
                                <FaLeaf
                                    className="text-green-600 text-4xl"
                                    size={60}
                                />
                            ),
                        },
                    ].map((val, i) => (
                        <div
                            key={i}
                            className="text-center flex flex-col items-center"
                        >
                            <div className="text-6xl mb-4">{val.icon}</div>
                            <h3 className="text-2xl font-bold mb-3">
                                {val.title}
                            </h3>
                            <p className="text-gray-600">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-5 2xl:px-20 bg-dark1 text-cream">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Our Mission
                        </h2>
                        <p className="text-lg leading-relaxed opacity-90">
                            To make comfort a part of everyday life —
                            physically, emotionally, and ethically. We want
                            every Hygge Cotton piece to feel like a warm hug
                            from someone who truly cares.
                        </p>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Our Vision
                        </h2>
                        <p className="text-lg leading-relaxed opacity-90">
                            To become a globally trusted name for simplicity,
                            sustainability, and soulful living — one soft,
                            honest, beautiful product at a time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-5 2xl:px-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        You’re not just buying cotton.
                        <br />
                        <span className="text-green-700">
                            You’re choosing comfort.
                        </span>
                    </h2>
                    <Link
                        to="/shop"
                        className="inline-block bg-green-700 text-cream px-12 py-5 rounded-full text-xl font-semibold hover:bg-green-800 transition shadow-xl"
                    >
                        Explore Our Collection →
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
