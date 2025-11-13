import React, { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import CustomOrderBanner from "../components/CustomOrderBanner";
import ProductCardTwo from "../components/ProductCardTwo";
import { IoMdClose } from "react-icons/io";
import { RiSoundModuleLine } from "react-icons/ri";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
    useGetProductsQuery,
    useGetHomeCategoriesQuery,
    useGetBrandsQuery,
} from "../redux/services/eCommerceApi";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // States
    const [activePage, setActivePage] = useState(1);
    const [rangeValues, setRangeValues] = useState([0, 5000]);
    const [filter, setFilter] = useState(false); // মোবাইল ফিল্টার
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    // URL Params
    const searchQuery = searchParams.get("q") || "";
    const sortBy = searchParams.get("sort_by") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const urlCategories = searchParams.getAll("category_ids[]");
    const urlBrands = searchParams.getAll("brand_ids[]");

    // Sync URL → State
    useEffect(() => {
        setSelectedCategories(
            urlCategories.length > 0
                ? urlCategories.map((id) => parseInt(id))
                : []
        );
        setSelectedBrands(
            urlBrands.length > 0 ? urlBrands.map((id) => parseInt(id)) : []
        );
    }, [searchParams]);

    useEffect(() => {
        if (minPrice) setRangeValues((prev) => [parseInt(minPrice), prev[1]]);
        if (maxPrice) setRangeValues((prev) => [prev[0], parseInt(maxPrice)]);
    }, [minPrice, maxPrice]);

    // Data Fetch
    const { data: homeCats } = useGetHomeCategoriesQuery();
    const { data: brands = [] } = useGetBrandsQuery();
    const categories = homeCats?.categories || [];

    // Products Query
    const { data: allData, isLoading: allLoading } = useGetProductsQuery({
        page: activePage,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        sort_by: sortBy || undefined,
        q: searchQuery || undefined,
        category_ids:
            selectedCategories.length > 0 ? selectedCategories : undefined,
        brand_ids: selectedBrands.length > 0 ? selectedBrands : undefined,
    });

    const products = allData?.products?.data || [];
    const totalPages = allData?.products?.last_page || 1;
    const totalProducts = allData?.products?.total || 0;

    // URL Update
    const updateURL = useCallback(
        (overrides) => {
            const newParams = new URLSearchParams(searchParams);

            if ("categories" in overrides) {
                newParams.delete("category_ids[]");
                overrides.categories.forEach((id) =>
                    newParams.append("category_ids[]", id)
                );
                delete overrides.categories;
            }
            if ("brands" in overrides) {
                newParams.delete("brand_ids[]");
                overrides.brands.forEach((id) =>
                    newParams.append("brand_ids[]", id)
                );
                delete overrides.brands;
            }

            Object.entries(overrides).forEach(([key, value]) => {
                if (
                    value === undefined ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    newParams.delete(key);
                } else if (Array.isArray(value)) {
                    newParams.delete(key);
                    value.forEach((v) => newParams.append(key, v));
                } else {
                    newParams.set(key, value);
                }
            });

            if (newParams.get("page") === "1") newParams.delete("page");
            setSearchParams(newParams, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    // Toggle
    const toggleCategory = (id) => {
        const newSelected = selectedCategories.includes(id)
            ? selectedCategories.filter((x) => x !== id)
            : [...selectedCategories, id];
        setSelectedCategories(newSelected);
        updateURL({ categories: newSelected, page: 1 });
    };

    const toggleBrand = (id) => {
        const newSelected = selectedBrands.includes(id)
            ? selectedBrands.filter((x) => x !== id)
            : [...selectedBrands, id];
        setSelectedBrands(newSelected);
        updateURL({ brands: newSelected, page: 1 });
    };

    const isChecked = (id, type = "cat") =>
        type === "brand"
            ? selectedBrands.includes(id)
            : selectedCategories.includes(id);

    // Handlers
    const handleRangeChange = (values) => {
        setRangeValues(values);
        updateURL({
            min_price: values[0] > 0 ? values[0] : "",
            max_price: values[1] < 5000 ? values[1] : "",
            page: 1,
        });
    };

    const handleSortChange = (value) => updateURL({ sort_by: value, page: 1 });
    const handlePageClick = (page) => {
        setActivePage(page);
        updateURL({ page });
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setRangeValues([0, 5000]);
        updateURL({
            categories: [],
            brands: [],
            min_price: "",
            max_price: "",
            sort_by: "",
            q: "",
            page: 1,
        });
    };

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        minPrice ||
        maxPrice ||
        sortBy ||
        searchQuery;

    // Pagination
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (activePage > 3) pages.push("...");
            const start = Math.max(2, activePage - 1);
            const end = Math.min(totalPages - 1, activePage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (activePage < totalPages - 2) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div>
            <div className="xl:px-20 bg-dark1 pb-[140px]">
                {/* Breadcrumb */}
                <div className="px-4 py-4 lg:py-[47px]">
                    <ul className="flex justify-end gap-4">
                        <li>
                            <Link to="/" className="text-cream text-[18px]">
                                Home
                            </Link>
                        </li>
                        <li className="text-cream text-[18px]">/</li>
                        <li className="text-cream text-[18px]">Shop</li>
                    </ul>
                </div>

                <div className="flex gap-4 relative">
                    {/* Overlay - মোবাইলে */}
                    {filter && (
                        <div
                            className="fixed inset-0 bg-dark1 bg-opacity-60 z-40 xl:hidden"
                            onClick={() => setFilter(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <div
                        className={`fixed top-0 left-0 h-full w-full max-w-[350px] bg-dark2 z-50 transition-transform duration-300 ease-in-out xl:static xl:z-0 xl:translate-x-0 ${
                            filter ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        <div className="p-4 h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-cream">
                                    Filters
                                </h3>
                                <button
                                    onClick={() => setFilter(false)}
                                    className="xl:hidden"
                                >
                                    <IoMdClose className="text-cream text-2xl" />
                                </button>
                            </div>

                            <button
                                onClick={clearAllFilters}
                                className="text-red-400 text-sm mb-6 block"
                            >
                                Clear All Filters
                            </button>

                            {/* Categories */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-3">
                                    Categories
                                </h4>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        updateURL({ categories: [], page: 1 });
                                    }}
                                    className={`flex items-center gap-3 w-full text-left ${
                                        selectedCategories.length === 0
                                            ? "text-cream font-bold"
                                            : "text-gray"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedCategories.length === 0
                                        }
                                        readOnly
                                        className="accent-cream"
                                    />
                                    All Categories ({totalProducts})
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`flex items-center gap-3 w-full text-left mt-2 ${
                                            isChecked(cat.id)
                                                ? "text-cream font-medium"
                                                : "text-gray"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked(cat.id)}
                                            readOnly
                                            className="accent-cream"
                                        />
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Brands */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-3">
                                    Brands
                                </h4>
                                {brands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        onClick={() => toggleBrand(brand.id)}
                                        className={`flex items-center gap-3 w-full text-left mt-2 cursor-pointer ${
                                            isChecked(brand.id, "brand")
                                                ? "text-cream font-medium"
                                                : "text-gray"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked(
                                                brand.id,
                                                "brand"
                                            )}
                                            readOnly
                                            className="accent-cream"
                                        />
                                        {/* <img
                                            src={`http://127.0.0.1:8000/${brand.logo}`}
                                            alt={brand.name}
                                            className="w-6 h-6 object-contain"
                                        /> */}
                                        {brand.name}
                                    </button>
                                ))}
                            </div>

                            {/* Price Range */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-3">
                                    Price Range
                                </h4>
                                <div className="flex justify-between text-gray mb-2">
                                    <span>${rangeValues[0]}</span>
                                    <span>${rangeValues[1]}</span>
                                </div>
                                <Slider
                                    range
                                    min={0}
                                    max={5000}
                                    value={rangeValues}
                                    onChange={handleRangeChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full xl:w-4/5">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setFilter(true)}
                            className="xl:hidden fixed bottom-4 left-4 bg-dark2 text-cream px-5 py-3 rounded-full shadow-2xl z-30 flex items-center gap-2"
                        >
                            <RiSoundModuleLine /> Filter
                        </button>

                        <div className="px-4 pb-6 flex flex-wrap justify-between items-center gap-4">
                            <p className="text-cream">
                                Showing {products.length} of {totalProducts}{" "}
                                products
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="bg-dark2 text-cream px-4 py-2 rounded"
                            >
                                <option value="">Default</option>
                                <option value="latest">Latest</option>
                                <option value="lowtohigh">Low to High</option>
                                <option value="hightolow">High to Low</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-4 xl:px-0">
                            {allLoading ? (
                                Array(12)
                                    .fill()
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-300 animate-pulse rounded-lg h-72"
                                        />
                                    ))
                            ) : products.length === 0 ? (
                                <p className="col-span-full text-center text-cream text-2xl py-10">
                                    No products found
                                </p>
                            ) : (
                                products.map((product) => (
                                    <ProductCardTwo
                                        key={product.id}
                                        product={product}
                                    />
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    disabled={activePage === 1}
                                    onClick={() =>
                                        handlePageClick(activePage - 1)
                                    }
                                    className="p-2 disabled:opacity-50"
                                >
                                    <TfiAngleLeft />
                                </button>
                                {getPageNumbers().map((p, i) =>
                                    typeof p === "number" ? (
                                        <button
                                            key={i}
                                            onClick={() => handlePageClick(p)}
                                            className={`w-10 h-10 rounded ${
                                                activePage === p
                                                    ? "bg-cream text-black"
                                                    : "bg-dark2 text-cream"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ) : (
                                        <span key={i}>...</span>
                                    )
                                )}
                                <button
                                    disabled={activePage === totalPages}
                                    onClick={() =>
                                        handlePageClick(activePage + 1)
                                    }
                                    className="p-2 disabled:opacity-50"
                                >
                                    <TfiAngleRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CustomOrderBanner />
        </div>
    );
};

export default Shop;
