import React from "react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import RecomendedSection from "../components/RecomendedSection";
import EssentialSection from "../components/EssentialSection";
import HotProducts from "../components/HotProducts";
import CustomOrderBanner from "../components/CustomOrderBanner";
import {
    useGetCategoryProductsQuery,
    useGetProductsByTypeQuery,
} from "../redux/services/eCommerceApi";
import CategorySection from "../components/CategorySection";

const Home = () => {
    const { data } = useGetProductsByTypeQuery();
    const { data: categoryProducts, isLoading: categoryLoading } =
        useGetCategoryProductsQuery();

    return (
        <>
            <Hero />
            {data?.newArrival?.length > 0 && <ProductSection />}
            {/* custom order banner */}
            <CustomOrderBanner />
            {/* recomended section */}
            {data?.bestProduct?.length > 0 && <RecomendedSection />}

            {/* your every day essential */}
            {data?.featuredProduct?.length > 0 && <EssentialSection />}

            {/* hot products */}
            {data?.topProduct?.length > 0 && <HotProducts />}
            {/* <CategorySection products={products} /> */}
            {categoryLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="mt-2 text-gray-600">Products Loading...</p>
                </div>
            ) : (
                categoryProducts?.homeProducts
                    ?.filter((cat) => cat.products.length > 0)
                    .map((cat, index) => (
                        <CategorySection
                            key={cat.id}
                            products={cat}
                            index={index}
                            categorySlug={cat.slug}
                        />
                    ))
            )}
        </>
    );
};

export default Home;
