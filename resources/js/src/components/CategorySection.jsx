import React from "react";
import SectionTitle from "./UI/SectionTitle";
import ProductCardTwo from "./ProductCardTwo";

const CategorySection = ({ products, index, categorySlug }) => {
    const bgClass = index % 2 === 0 ? "bg-dark1" : "bg-dark2";
    const dynamicBtnUrl = `/shop/category/${categorySlug}`;
    return (
        <div
            className={`px-[18px] pt-[19px] lg:pt-[125px] pb-[33px] lg:pb-[100px] ${bgClass} lg:px-20`}
        >
            <div className="mb-5">
                <SectionTitle
                    title={`${products?.name}`}
                    btnUrl={dynamicBtnUrl}
                />
            </div>

            <div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                    {products.products.length > 0 &&
                        products.products.map((product) => (
                            <ProductCardTwo
                                key={product.id}
                                product={product}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySection;
