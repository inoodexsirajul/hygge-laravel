import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import {
    useGetProductDetailsQuery,
    useProductCustomizeMutation,
    useAddToCartMutation,
    useGetCartDetailsQuery,
    eCommerceApi,
} from "../redux/services/eCommerceApi";
import { useParams, useNavigate } from "react-router";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        zIndex: 1001,
        overflowY: "auto",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 999,
    },
};

const CustomizeProduct = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentSide, setCurrentSide] = useState("front");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("text");
    const [isUpdating, setIsUpdating] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(null);

    const {
        data,
        isLoading,
        error: productError,
    } = useGetProductDetailsQuery(slug);

    const [productCustomize, { isLoading: isCustomizeLoading }] =
        useProductCustomizeMutation();

    const [addToCart, { isLoading: isCartLoading }] = useAddToCartMutation();

    const { data: cartData } = useGetCartDetailsQuery();

    const containerSizes = { width: "220px", height: "238px" };

    const [designs, setDesigns] = useState({
        front: {
            title: "",
            titlePosition: "custom",
            titleColor: "black",
            textSize: 18,
            fontFamily: "Story Script",
            xAxis: 50,
            yAxis: 50,
            uploadedImage: null,
            imagePosition: "below",
            imageXAxis: 50,
            imageYAxis: 30,
            imageSize: 50,
            containerXAxis: 50,
            containerYAxis: 50,
        },
        back: {
            title: "",
            titlePosition: "custom",
            titleColor: "black",
            textSize: 18,
            fontFamily: "Story Script",
            xAxis: 50,
            yAxis: 50,
            uploadedImage: null,
            imagePosition: "below",
            imageXAxis: 50,
            imageYAxis: 30,
            imageSize: 50,
            containerXAxis: 50,
            containerYAxis: 50,
        },
    });

    const fileInputRef = useRef(null);
    const previewRef = useRef(null);
    const textContainerRef = useRef(null);

    const currentDesign = designs[currentSide];

    const customPositionStyle = {
        left: `${currentDesign.xAxis}%`,
        top: `${currentDesign.yAxis}%`,
        transform: "translate(-50%, -50%)",
    };

    const imagePositionStyle = {
        left: `${currentDesign.imageXAxis}%`,
        top: `${currentDesign.imageYAxis}%`,
        transform: "translate(-50%, -50%)",
        width: `${currentDesign.imageSize}%`,
        maxWidth: "200px",
        zIndex: currentDesign.imagePosition === "below" ? 1 : 10,
    };

    const textStyle = {
        fontSize: `${currentDesign.textSize}px`,
        color: currentDesign.titleColor,
        fontFamily: currentDesign.fontFamily,
        ...(currentDesign.titlePosition === "custom" && customPositionStyle),
        zIndex: currentDesign.imagePosition === "below" ? 10 : 1,
    };

    const containerStyle = {
        width: containerSizes.width,
        height: containerSizes.height,
        left: `${currentDesign.containerXAxis}%`,
        top: `${currentDesign.containerYAxis}%`,
        transform: "translate(-50%, -50%)",
    };

    const fontOptions = [
        { id: "story", name: "Story Script", value: "Story Script" },
        { id: "monsieur", name: "Monsieur", value: "Monsieur La Doulaise" },
        { id: "michroma", name: "Michroma", value: "Michroma" },
        { id: "vidaloka", name: "Vidaloka", value: "Vidaloka" },
        { id: "manrope", name: "Manrope", value: "Manrope" },
    ];

    const colorOptions = [
        { id: "black", name: "Black", value: "black" },
        { id: "red", name: "Red", value: "red" },
        { id: "blue", name: "Blue", value: "blue" },
        { id: "green", name: "Green", value: "green" },
        { id: "purple", name: "Purple", value: "purple" },
    ];

    const updateDesign = (updates) => {
        setDesigns((prev) => ({
            ...prev,
            [currentSide]: { ...prev[currentSide], ...updates },
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateDesign({ uploadedImage: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        updateDesign({ uploadedImage: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const generateImageForSide = async (side) => {
        const originalSide = currentSide;
        setCurrentSide(side);
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!previewRef.current || !textContainerRef.current) {
            setCurrentSide(originalSide);
            throw new Error(`Preview not ready for ${side}`);
        }

        let originalClassName = textContainerRef.current.className;
        try {
            textContainerRef.current.className = originalClassName.replace(
                /border-2 border-dotted border-white/,
                ""
            );

            const baseImage = previewRef.current.querySelector("img");
            if (!baseImage) throw new Error(`Base image not found for ${side}`);

            if (baseImage.complete === false || baseImage.naturalWidth === 0) {
                await new Promise((resolve, reject) => {
                    baseImage.onload = resolve;
                    baseImage.onerror = () =>
                        reject(new Error(`Failed to load ${side} image`));
                    if (baseImage.complete && baseImage.naturalWidth !== 0)
                        resolve();
                });
            }

            const uploadedImage = previewRef.current.querySelector(
                "img[alt='Uploaded sticker']"
            );
            if (
                uploadedImage &&
                (uploadedImage.complete === false ||
                    uploadedImage.naturalWidth === 0)
            ) {
                await new Promise((resolve, reject) => {
                    uploadedImage.onload = resolve;
                    uploadedImage.onerror = () =>
                        reject(
                            new Error(`Failed to load uploaded ${side} image`)
                        );
                    if (
                        uploadedImage.complete &&
                        uploadedImage.naturalWidth !== 0
                    )
                        resolve();
                });
            }

            const dataUrl = await toPng(previewRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                canvasWidth: 700,
                canvasHeight: 600,
                style: {
                    fontFamily: designs[side].fontFamily,
                    transform: "none",
                    width: "700px",
                    height: "600px",
                },
            });

            textContainerRef.current.className = originalClassName;
            setCurrentSide(originalSide);
            return dataUrl;
        } catch (error) {
            textContainerRef.current.className = originalClassName;
            setCurrentSide(originalSide);
            setImageLoadError(
                `Failed to generate ${side} image: ${error.message}`
            );
            throw error;
        }
    };

    const productInCart = cartData?.data?.cart_items?.some(
        (item) => item.product_id === data?.product?.id
    );

    // ==================== MAIN ACTION: CUSTOMIZE + ADD TO CART IF NOT EXISTS ====================
    const handleUpdateProduct = async () => {
        if (isUpdating || isCustomizeLoading || isCartLoading) return;
        setIsUpdating(true);

        try {
            // কাস্টমাইজেশন চেক
            const isFrontCustomized =
                designs.front.title !== "Your Title" ||
                designs.front.uploadedImage ||
                designs.front.textSize !== 18 ||
                designs.front.xAxis !== 50 ||
                designs.front.yAxis !== 50 ||
                designs.front.containerXAxis !== 50 ||
                designs.front.containerYAxis !== 50 ||
                designs.front.imageXAxis !== 50 ||
                designs.front.imageYAxis !== 30 ||
                designs.front.imageSize !== 50 ||
                designs.front.titleColor !== "black" ||
                designs.front.fontFamily !== "Story Script";

            const isBackCustomized =
                designs.back.title !== "Back Title" ||
                designs.back.uploadedImage ||
                designs.back.textSize !== 18 ||
                designs.back.xAxis !== 50 ||
                designs.back.yAxis !== 50 ||
                designs.back.containerXAxis !== 50 ||
                designs.back.containerYAxis !== 50 ||
                designs.back.imageXAxis !== 50 ||
                designs.back.imageYAxis !== 30 ||
                designs.back.imageSize !== 50 ||
                designs.back.titleColor !== "black" ||
                designs.back.fontFamily !== "Story Script";

            if (!isFrontCustomized && !isBackCustomized) {
                alert("Please customize at least one side before proceeding.");
                return;
            }

            if (
                !data?.product?.customization?.front_image &&
                isFrontCustomized
            ) {
                throw new Error("Front base image is missing.");
            }
            if (!data?.product?.customization?.back_image && isBackCustomized) {
                throw new Error("Back base image is missing.");
            }

            let frontImage = "",
                backImage = "";
            if (isFrontCustomized)
                frontImage = await generateImageForSide("front");
            if (isBackCustomized)
                backImage = await generateImageForSide("back");

            const side =
                isFrontCustomized && isBackCustomized
                    ? "both"
                    : isFrontCustomized
                    ? "front"
                    : "back";
            const frontDesign = designs.front;
            const backDesign = designs.back;

            // ১. সবসময় productCustomize কল করো
            const customizePayload = {
                product_id: data?.product?.id,
                side,
                front_price: isFrontCustomized
                    ? data?.product?.customization?.front_price
                    : 0,
                back_price: isBackCustomized
                    ? data?.product?.customization?.front_price
                    : 0,
                both_price:
                    isFrontCustomized && isBackCustomized
                        ? data?.product?.customization?.both_price
                        : 0,
                front_image: frontImage,
                back_image: backImage,
                custom_text_front: isFrontCustomized ? frontDesign.title : "",
                custom_text_back: isBackCustomized ? backDesign.title : "",
                font_color_front: frontDesign.titleColor || "black",
                font_color_back: backDesign.titleColor || "black",
                font_size_front: `${frontDesign.textSize || 18}px`,
                font_size_back: `${backDesign.textSize || 18}px`,
                text_front: JSON.stringify({
                    title: frontDesign.title || "Your Title",
                    x_position: `${frontDesign.xAxis || 50}%`,
                    y_position: `${frontDesign.yAxis || 50}%`,
                    size: `${frontDesign.textSize || 18}px`,
                    color: frontDesign.titleColor || "black",
                    style: "bold",
                    font_family: frontDesign.fontFamily || "Story Script",
                }),
                text_back: JSON.stringify({
                    title: backDesign.title || "Back Title",
                    x_position: `${backDesign.xAxis || 50}%`,
                    y_position: `${backDesign.yAxis || 50}%`,
                    size: `${backDesign.textSize || 18}px`,
                    color: backDesign.titleColor || "black",
                    style: "bold",
                    font_family: backDesign.fontFamily || "Story Script",
                }),
                container_front: JSON.stringify({
                    x_position: `${frontDesign.containerXAxis || 50}%`,
                    y_position: `${frontDesign.containerYAxis || 50}%`,
                }),
                container_back: JSON.stringify({
                    x_position: `${backDesign.containerXAxis || 50}%`,
                    y_position: `${backDesign.containerYAxis || 50}%`,
                }),
                image_front: frontDesign.uploadedImage
                    ? JSON.stringify({
                          position: "below",
                          x_position: `${frontDesign.imageXAxis}%`,
                          y_position: `${frontDesign.imageYAxis}%`,
                          size: `${frontDesign.imageSize}%`,
                      })
                    : "",
                image_back: backDesign.uploadedImage
                    ? JSON.stringify({
                          position: "below",
                          x_position: `${backDesign.imageXAxis}%`,
                          y_position: `${backDesign.imageYAxis}%`,
                          size: `${backDesign.imageSize}%`,
                      })
                    : "",
            };

            const customizeResponse = await productCustomize(
                customizePayload
            ).unwrap();
            const customizationId =
                customizeResponse?.data?.customization_id ||
                customizeResponse?.customization_id;

            if (!customizationId) {
                throw new Error("Customization ID not returned from server.");
            }

            // ২. কার্টে আছে কিনা চেক করো
            const cartItems = cartData?.data?.cart_items || [];
            const productInCart = cartItems.some(
                (item) => item.product_id === data?.product?.id
            );

            if (!productInCart) {
                const price = isFrontCustomized && isBackCustomized ? 8 : 4;
                const cartPayload = {
                    product_id: data?.product?.id,
                    qty: 1,
                    customization_id: customizationId,
                    price,
                };
                await addToCart(cartPayload).unwrap();
                dispatch(eCommerceApi.util.invalidateTags(["Cart"]));
            } else {
                alert("Product customize Updated");
            }

            navigate("/cart");
        } catch (error) {
            alert(
                `Failed: ${
                    error?.data?.message || error?.message || "Unknown error"
                }`
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        let originalClassName = textContainerRef.current?.className || "";
        try {
            if (textContainerRef.current) {
                textContainerRef.current.className = originalClassName.replace(
                    /border-2 border-dotted border-white/,
                    ""
                );
            }
            const dataUrl = await toPng(previewRef.current, {
                cacheBust: true,
                pixelRatio: 2,
            });
            if (textContainerRef.current) {
                textContainerRef.current.className = originalClassName;
            }
            const link = document.createElement("a");
            link.download = `custom-${currentSide}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            if (textContainerRef.current) {
                textContainerRef.current.className = originalClassName;
            }
            alert("Download failed.");
        }
    };

    const toggleSide = (side) => {
        setCurrentSide(side);
        setImageLoadError(null);
    };

    const openPreview = () => {
        if (!data?.product?.customization?.[currentSide + "_image"]) {
            alert(`No ${currentSide} image available.`);
            return;
        }
        setIsPreviewOpen(true);
    };

    const closePreview = () => setIsPreviewOpen(false);

    if (isLoading)
        return <h2 className="text-center text-white">Loading...</h2>;
    if (productError)
        return (
            <h2 className="text-center text-red-500">
                Error: {productError.message}
            </h2>
        );
    if (
        !data?.product?.customization?.front_image &&
        !data?.product?.customization?.back_image
    ) {
        return (
            <h2 className="text-center text-yellow-500">
                No customization available.
            </h2>
        );
    }

    return (
        <div className="min-h-screen bg-dark1 py-8 px-1 lg:px-4">
            <div className="w-full 2xl:max-w-4/5 mx-auto bg-dark2 rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1 lg:p-6 items-start">
                    {/* Left: Form */}
                    <div className="bg-dark1 p-4 rounded-lg shadow-md">
                        <div className="flex mb-4 border-b-2 border-red">
                            {["text", "image", "container"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 text-sm font-semibold cursor-pointer ${
                                        activeTab === tab
                                            ? "border-2 border-red rounded-t-md text-red font-bold"
                                            : "text-cream hover:text-red border-2 border-transparent"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Text Tab */}
                        {activeTab === "text" && (
                            <div>
                                <div className="mb-3">
                                    <label className="block text-sm font-bold text-cream mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={currentDesign.title}
                                        onChange={(e) =>
                                            updateDesign({
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg text-cream focus:outline-none"
                                        placeholder={`Enter ${currentSide} title`}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-cream mb-2">
                                        Title Position
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-cream/70 mb-1">
                                                X-Axis: {currentDesign.xAxis}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentDesign.xAxis}
                                                onChange={(e) =>
                                                    updateDesign({
                                                        xAxis: parseInt(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-cream/70 mt-1">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-cream/70 mb-1">
                                                Y-Axis: {currentDesign.yAxis}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentDesign.yAxis}
                                                onChange={(e) =>
                                                    updateDesign({
                                                        yAxis: parseInt(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-cream/70 mt-1">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-cream mb-1">
                                        Text Size: {currentDesign.textSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="48"
                                        value={currentDesign.textSize}
                                        onChange={(e) =>
                                            updateDesign({
                                                textSize: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-cream/70 mt-1">
                                        <span>12px</span>
                                        <span>30px</span>
                                        <span>48px</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-cream mb-2">
                                        Title Color
                                    </label>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {colorOptions.map((color) => (
                                            <div
                                                key={color.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    id={color.id}
                                                    name="textColor"
                                                    value={color.value}
                                                    checked={
                                                        currentDesign.titleColor ===
                                                        color.value
                                                    }
                                                    onChange={(e) =>
                                                        updateDesign({
                                                            titleColor:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor={color.id}
                                                    className={`flex items-center cursor-pointer text-cream text-xs px-3 py-1 rounded-lg border-2 transition-all ${
                                                        currentDesign.titleColor ===
                                                        color.value
                                                            ? "bg-blue-50 text-dark1"
                                                            : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                                >
                                                    <span
                                                        className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                                        style={{
                                                            backgroundColor:
                                                                color.value,
                                                        }}
                                                    ></span>
                                                    {color.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-cream mb-2">
                                        Text Style
                                    </label>
                                    <select
                                        value={currentDesign.fontFamily}
                                        onChange={(e) =>
                                            updateDesign({
                                                fontFamily: e.target.value,
                                            })
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs text-cream focus:outline-none"
                                    >
                                        {fontOptions.map((font) => (
                                            <option
                                                key={font.id}
                                                value={font.value}
                                                className="text-dark1"
                                            >
                                                {font.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Image Tab */}
                        {activeTab === "image" && (
                            <div>
                                <div className="mb-3 rounded-lg">
                                    <h3 className="text-sm font-semibold text-cream mb-1">
                                        Upload Image/Sticker
                                    </h3>
                                    <div className="mb-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg text-cream cursor-pointer focus:outline-none"
                                        />
                                    </div>
                                    {currentDesign.uploadedImage && (
                                        <div className="space-y-4 mt-4 p-3 bg-dark1 rounded-lg">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-cream mb-0">
                                                        Image X-Position:{" "}
                                                        {
                                                            currentDesign.imageXAxis
                                                        }
                                                        %
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={
                                                            currentDesign.imageXAxis
                                                        }
                                                        onChange={(e) =>
                                                            updateDesign({
                                                                imageXAxis:
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                            })
                                                        }
                                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-cream mb-0">
                                                        Image Y-Position:{" "}
                                                        {
                                                            currentDesign.imageYAxis
                                                        }
                                                        %
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={
                                                            currentDesign.imageYAxis
                                                        }
                                                        onChange={(e) =>
                                                            updateDesign({
                                                                imageYAxis:
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                            })
                                                        }
                                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-cream mb-0">
                                                        Image Size:{" "}
                                                        {
                                                            currentDesign.imageSize
                                                        }
                                                        %
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="10"
                                                        max="100"
                                                        value={
                                                            currentDesign.imageSize
                                                        }
                                                        onChange={(e) =>
                                                            updateDesign({
                                                                imageSize:
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                            })
                                                        }
                                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveImage}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Container Tab */}
                        {activeTab === "container" && (
                            <div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-cream mb-2">
                                        Container Position
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-cream/70 mb-1">
                                                Container X-Axis:{" "}
                                                {currentDesign.containerXAxis}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={
                                                    currentDesign.containerXAxis
                                                }
                                                onChange={(e) =>
                                                    updateDesign({
                                                        containerXAxis:
                                                            parseInt(
                                                                e.target.value
                                                            ),
                                                    })
                                                }
                                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-cream/70 mt-1">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-cream/70 mb-1">
                                                Container Y-Axis:{" "}
                                                {currentDesign.containerYAxis}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={
                                                    currentDesign.containerYAxis
                                                }
                                                onChange={(e) =>
                                                    updateDesign({
                                                        containerYAxis:
                                                            parseInt(
                                                                e.target.value
                                                            ),
                                                    })
                                                }
                                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-cream/70 mt-1">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Side Toggle */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-cream mb-2">
                                Design Side
                            </label>
                            <div className="flex gap-4">
                                {["front", "back"].map((side) => (
                                    <button
                                        key={side}
                                        onClick={() => toggleSide(side)}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentSide === side
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-300 text-dark1"
                                        }`}
                                    >
                                        {side.charAt(0).toUpperCase() +
                                            side.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={openPreview}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 wokół-lg transition duration-300 mt-4"
                                disabled={
                                    isUpdating ||
                                    isCustomizeLoading ||
                                    isCartLoading
                                }
                            >
                                Preview Design
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mt-4"
                                disabled={
                                    isUpdating ||
                                    isCustomizeLoading ||
                                    isCartLoading
                                }
                            >
                                Download{" "}
                                {currentSide.charAt(0).toUpperCase() +
                                    currentSide.slice(1)}{" "}
                                PNG
                            </button>
                        </div>

                        <button
                            onClick={handleUpdateProduct}
                            disabled={
                                isUpdating ||
                                isCustomizeLoading ||
                                isCartLoading
                            }
                            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300 mt-4 flex items-center justify-center ${
                                isUpdating ||
                                isCustomizeLoading ||
                                isCartLoading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                            }`}
                        >
                            {isUpdating ||
                            isCustomizeLoading ||
                            isCartLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : productInCart ? (
                                "Update Customization"
                            ) : (
                                "Customize & Add to Cart"
                            )}
                        </button>
                    </div>

                    {/* Right: Preview */}
                    <div className="flex flex-col items-center justify-center z-10">
                        {imageLoadError ? (
                            <p className="text-red-500">{imageLoadError}</p>
                        ) : !data?.product?.customization?.[
                              currentSide + "_image"
                          ] ? (
                            <p className="text-cream">
                                No {currentSide} image available.
                            </p>
                        ) : (
                            <figure
                                ref={previewRef}
                                className="relative w-[700px] h-[600px]"
                            >
                                <div>
                                    <img
                                        src={`/${
                                            data.product.customization[
                                                currentSide + "_image"
                                            ]
                                        }`}
                                        alt={`${currentSide} view`}
                                        className="w-[700px] h-[600px] object-contain"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                                <div
                                    ref={textContainerRef}
                                    className="absolute flex items-center justify-center rounded-xl  overflow-hidden border-2 border-dotted border-white"
                                    style={containerStyle}
                                >
                                    {currentDesign.uploadedImage && (
                                        <img
                                            src={currentDesign.uploadedImage}
                                            alt="Uploaded sticker"
                                            className="absolute object-contain"
                                            style={imagePositionStyle}
                                            crossOrigin="anonymous"
                                        />
                                    )}
                                    {currentDesign.title && (
                                        <p
                                            className="absolute wrap-word font-bold text-center w-full"
                                            style={textStyle}
                                        >
                                            {currentDesign.title}
                                        </p>
                                    )}
                                </div>
                            </figure>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <Modal
                isOpen={isPreviewOpen}
                onRequestClose={closePreview}
                style={customStyles}
                contentLabel="Preview Modal"
                ariaHideApp={false}
            >
                <div className="flex flex-col items-center z-[1002] overflow-hidden bg-white">
                    <div className="flex justify-between items-center w-full mb-4">
                        <h2 className="text-xl font-bold text-dark1">
                            {currentSide.charAt(0).toUpperCase() +
                                currentSide.slice(1)}{" "}
                            Design Preview
                        </h2>
                        <button
                            onClick={closePreview}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex justify-center w-full">
                        {imageLoadError ? (
                            <p className="text-red-500">{imageLoadError}</p>
                        ) : !data?.product?.customization?.[
                              currentSide + "_image"
                          ] ? (
                            <p>No {currentSide} image available for preview.</p>
                        ) : (
                            <figure className="relative w-full max-w-md h-auto">
                                <div className="relative w full aspect-[7/6]">
                                    <img
                                        src={`/${
                                            data.product.customization[
                                                currentSide + "_image"
                                            ]
                                        }`}
                                        alt={`${currentSide} view`}
                                        className="w-full h-full object-contain"
                                        // crossOrigin="anonymous"
                                    />
                                </div>
                                <div
                                    className="absolute flex items-center justify-center rounded-xl overflow-hidden"
                                    style={containerStyle}
                                >
                                    {currentDesign.uploadedImage && (
                                        <img
                                            src={currentDesign.uploadedImage}
                                            alt="Uploaded sticker"
                                            className="absolute object-contain"
                                            style={imagePositionStyle}
                                            crossOrigin="anonymous"
                                        />
                                    )}
                                    {currentDesign.title && (
                                        <p
                                            className="absolute wrap-word font-bold text-center w-full"
                                            style={textStyle}
                                        >
                                            {currentDesign.title}
                                        </p>
                                    )}
                                </div>
                            </figure>
                        )}
                    </div>
                    <button
                        onClick={closePreview}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Close Preview
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomizeProduct;
