import React from "react";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../redux/services/eCommerceApi";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const FeaturedCategory = () => {
    const { data, isLoading } = useGetCategoriesQuery();
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId, categoryName) => {
        navigate(`/shop?category_ids=${categoryId}`);
    };

    if (isLoading) {
        return (
            <div className="px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] bg-dark2 lg:px-20">
                <p className="text-center text-cream text-xl">
                    Loading Categories...
                </p>
            </div>
        );
    }

    // যদি ডেটা না থাকে
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] bg-dark2 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-cream text-center mb-12 tracking-wide">
                    Featured Categories
                </h2>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={2}
                    navigation={false}
                    arrow={false}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    loop={data.length > 6}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        768: { slidesPerView: 4, spaceBetween: 24 },
                        1024: { slidesPerView: 5, spaceBetween: 24 },
                        1280: { slidesPerView: 6, spaceBetween: 30 }, // ৬টা ডেস্কটপে
                        1536: { slidesPerView: 6, spaceBetween: 32 },
                    }}
                    className="featured-category-swiper"
                >
                    {data.map((cate) => (
                        <SwiperSlide key={cate?.id}>
                            <div
                                onClick={() =>
                                    handleCategoryClick(cate?.id, cate?.name)
                                }
                                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-3 mt-8"
                            >
                                <div className="relative overflow-hidden rounded-lg shadow-2xl ring-4 ring-transparent group-hover:ring-red/50 transition-all duration-500">
                                    <div className="aspect-square w-full">
                                        <img
                                            src={
                                                cate?.image ||
                                                "/placeholder-category.jpg"
                                            }
                                            alt={cate?.name}
                                            className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src =
                                                    "/placeholder-category.jpg";
                                            }}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-center mt-4 text-cream font-semibold text-sm md:text-base tracking-wide group-hover:text-red transition-colors duration-300">
                                    {cate?.name}
                                </h3>

                                <div className="mt-1 h-0.5 bg-red w-0 group-hover:w-full mx-auto transition-all duration-500 rounded-full"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows */}
                <div className="flex justify-center gap-4 mt-8">
                    <button className="swiper-button-prev w-12 h-12 bg-red/20 border-2 border-red/50 rounded-full flex items-center justify-center text-cream hover:bg-red hover:border-red transition-all duration-300 shadow-lg">
                        ←
                    </button>
                    <button className="swiper-button-next w-12 h-12 bg-red/20 border-2 border-red/50 rounded-full flex items-center justify-center text-cream hover:bg-red hover:border-red transition-all duration-300 shadow-lg">
                        →
                    </button>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate("/shop")}
                        className="px-8 py-3 bg-red/20 border-2 border-red/50 text-cream font-bold rounded-full hover:bg-red hover:border-red hover:text-white transition-all duration-300 shadow-lg hover:shadow-red/50"
                    >
                        View All Categories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategory;
