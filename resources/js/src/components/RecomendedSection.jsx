import React from "react"; // Adjust the import path
import SectionTitle from "./UI/SectionTitle";
import ProductCardTwo from "./ProductCardTwo";
import { useGetProductsByTypeQuery } from "../redux/services/eCommerceApi";

const RecomendedSection = () => {
    // Fetch products by type using the RTK Query hook
    const { data, error, isLoading } = useGetProductsByTypeQuery();

    return (
        <div className="px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] bg-dark2 lg:px-20">
            <div className="mb-5">
                <SectionTitle
                    title="Recommended For You"
                    subtitle={`Check out our best-selling items, including bags, t-shirts, and more!`}
                    btnUrl="/shop"
                />
            </div>
            <div>
                {/* product card start */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                        {/* Render 4 skeleton loaders to match the grid layout */}
                        {Array(4)
                            .fill()
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                                >
                                    <div className="w-full h-48 bg-gray-200 rounded-md mb-3"></div>
                                    <div className="w-3/5 h-5 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-2/5 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-600 text-center p-5 rounded-lg">
                        Error: {error.message}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-[20px]">
                        {data?.bestProduct?.map((product) => (
                            <ProductCardTwo
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
                {/* product card end */}
            </div>
        </div>
    );
};

export default RecomendedSection;
