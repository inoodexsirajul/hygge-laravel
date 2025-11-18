import React from "react";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../redux/services/eCommerceApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Skeleton Card Component (একদম তোর ডিজাইনের মতো)
const CategorySkeleton = () => (
    <div className="group cursor-pointer transform transition-all duration-300 mt-8">
        <div className="relative overflow-hidden rounded-lg shadow-2xl ring-4 ring-transparent">
            <div className="aspect-square w-full bg-gray-800 rounded-lg animate-pulse">
                <div className="w-full h-full bg-linear-to-br from-gray-700 via-gray-800 to-gray-900"></div>
            </div>
        </div>
        <div className="mt-4 h-5 bg-gray-700 rounded-full w-24 mx-auto animate-pulse"></div>
        <div className="mt-3 h-0.5 bg-gray-700 rounded-full w-0 mx-auto animate-pulse"></div>
    </div>
);

const FeaturedCategory = () => {
    const { data, isLoading } = useGetCategoriesQuery();
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId, categoryName) => {
        navigate(`/shop?category_ids[]=${categoryId}`);
    };

    // লোডিং স্টেট — সুন্দর স্কেলিটন
    if (isLoading) {
        return (
            <div className="px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] bg-dark2 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-cream text-center mb-12 tracking-wide">
                        Featured Categories
                    </h2>

                    {/* Skeleton Grid — তোর আসল গ্রিডের মতো */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
                        {[...Array(6)].map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))}
                    </div>

                    {/* Skeleton Button */}
                    <div className="text-center mt-12">
                        <div className="inline-block px-8 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-full w-64 h-12 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // যদি ডেটা না থাকে
    if (!data || data.length === 0) {
        return null;
    }

    // তোর আসল কন্টেন্ট — একদম আগের মতোই
    return (
        <div className="px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] bg-dark2 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-cream text-center mb-12 tracking-wide">
                    Featured Categories
                </h2>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={2}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={data.length > 6}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        768: { slidesPerView: 4, spaceBetween: 24 },
                        1024: { slidesPerView: 5, spaceBetween: 24 },
                        1280: { slidesPerView: 6, spaceBetween: 30 },
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
                                            src={cate?.image}
                                            alt="category image"
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
