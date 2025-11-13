import React from "react";
import { GoArrowRight } from "react-icons/go";
import Button from "./UI/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetSliderQuery } from "../redux/services/eCommerceApi";

// Import Swiper styles
import "swiper/css";

const Hero = () => {
    const { data: sliderData, isLoading, error } = useGetSliderQuery();

    return (
        <div className="px-4 sm:px-6 lg:px-20 xl:px-20 bg-dark1">
            {isLoading && (
                <div className="text-cream text-center py-10">
                    Loading sliders...
                </div>
            )}
            {error && (
                <div className="text-red-600 text-center py-10">
                    Error loading sliders: {error.message}
                </div>
            )}
            <Swiper spaceBetween={20} slidesPerView={1} className="w-full">
                {sliderData?.sliders?.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center py-8 sm:py-12 lg:py-[100px] gap-6">
                            {/* Hero banner image */}
                            <div className="w-full flex justify-center items-center order-2 lg:order-1">
                                <img
                                    src={slide.banner && `/${slide.banner}`}
                                    alt={slide.title}
                                    className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] object-contain"
                                />
                            </div>

                            {/* Hero content */}
                            <div className="w-full order-1 lg:order-2 text-center lg:text-left px-4 sm:px-6 lg:px-0">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-[100px] text-yellow font-vidaloka leading-tight sm:leading-snug lg:leading-[1.2] mb-6 sm:mb-8">
                                    {slide.type}
                                </h2>

                                <p className="text-cream text-sm sm:text-base lg:text-lg font-light mb-6 sm:mb-8 max-w-[90%] sm:max-w-[470px] mx-auto lg:mx-0">
                                    {slide.title ||
                                        "Handcrafted with precision and timeless detail. Luxury materials meet modern minimalism."}
                                </p>

                                <Button
                                    href={slide.btn_url}
                                    className="inline-flex items-center gap-2 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 rounded-[10px] text-cream"
                                    variant="border"
                                    color="cream"
                                    size="md"
                                >
                                    Buy Products
                                    <GoArrowRight />
                                </Button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Hero;
