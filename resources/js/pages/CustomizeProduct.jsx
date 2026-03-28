import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import Modal from "react-modal";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";

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

const CustomizeProduct = ({ product }) => {
    const {url} = usePage();
    const params = new URLSearchParams(url.split("?")[1]);
    const colorId = params.get("color"); // color_id
    const sizeId  = params.get("size");  // size_id
    const qty     = params.get("qty") ?? 1;
    const [currentSide, setCurrentSide] = useState("front");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("text");
    const [isUpdating, setIsUpdating] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(null);
    const [openTextLayers, setOpenTextLayers] = useState({});

    const previewRef = useRef(null);
    const textContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    const [designs, setDesigns] = useState({
        front: {
            texts: [
                {
                    id: Date.now(),
                    title: "",
                    titleColor: "black",
                    textSize: 18,
                    fontFamily: "Anton",
                    xAxis: 50,
                    yAxis: 50,
                },
            ],
            uploadedImage: null,
            imageXAxis: 50,
            imageYAxis: 30,
            imageSize: 50,
            containerWidth: 240,
            containerHeight: 240,
            containerXAxis: 50,
            containerYAxis: 50,
        },
        back: {
            texts: [
                {
                    id: Date.now() + 1,
                    title: "",
                    titleColor: "black",
                    textSize: 18,
                    fontFamily: "Anton",
                    xAxis: 50,
                    yAxis: 50,
                },
            ],
            uploadedImage: null,
            imageXAxis: 50,
            imageYAxis: 30,
            imageSize: 50,
            containerWidth: 240,
            containerHeight: 240,
            containerXAxis: 50,
            containerYAxis: 50,
        },
    });

    const currentDesign = designs[currentSide];

    const containerStyle = {
        position: "absolute",
        width: `${currentDesign.containerWidth}px`,
        height: `${currentDesign.containerHeight}px`,
        left: `${currentDesign.containerXAxis}%`,
        top: `${currentDesign.containerYAxis}%`,
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 5,
    };

    const imagePositionStyle = {
        left: `${currentDesign.imageXAxis}%`,
        top: `${currentDesign.imageYAxis}%`,
        transform: "translate(-50%, -50%)",
        width: `${currentDesign.imageSize}%`,
        maxWidth: "200px",
        zIndex: 1, // image সবসময় text-এর নিচে (তুমি চাইলে পরে change করতে পারো)
    };

    const fontOptions = [
        { id: "glamour", name: "Glamour", value: "glamour" },
        { id: "anton", name: "Anton", value: "Anton" },
        { id: "abril", name: "Abril Fatface", value: "Abril Fatface" },
        { id: "leagueSpartan", name: "League Spartan", value: "League Spartan" },
        { id: "yesevaOne", name: "Yeseva One", value: "Yeseva One" },
        { id: "chewy", name: "Chewy", value: "Chewy" },
        { id: "quicksand", name: "Quicksand", value: "Quicksand" },
        { id: "telegraph", name: "Telegraph", value: "telegraph" },
        { id: "futura", name: "Futura", value: "futura" },
        { id: "london", name: "London", value: "london" },
        { id: "lovelo", name: "Lovelo", value: "lovelo" },
        { id: "etna", name: "Etna", value: "etna" },
        { id: "copper", name: "Copper", value: "copper" },
    ];

    const colorOptions = [
        { id: "1", value: "#cc0000" },
        { id: "2", value: "#0025cc" },
        { id: "3", value: "#2e6417" },
        { id: "4", value: "#17320b" },
        { id: "5", value: "#004aad" },
        { id: "6", value: "#cc007e" },
        { id: "7", value: "#bc3fde" },
        { id: "8", value: "#ff751f" },
        { id: "9", value: "#cc4e00" },
        { id: "10", value: "#c28e4a" },
        { id: "11", value: "#744383" },
        { id: "12", value: "#fb475e" },
        { id: "13", value: "#ea71e7" },
        { id: "14", value: "#f0efec" },
        { id: "15", value: "#000000" },
    ];

    // Text Functions
    const addNewText = () => {
        const newText = {
            id: Date.now(),
            title: "",
            titleColor: "black",
            textSize: 18,
            fontFamily: "Anton",
            xAxis: 50,
            yAxis: 50,
        };
        setDesigns((prev) => ({
            ...prev,
            [currentSide]: {
                ...prev[currentSide],
                texts: [...prev[currentSide].texts, newText],
            },
        }));
    };

    const removeText = (id) => {
        setDesigns((prev) => ({
            ...prev,
            [currentSide]: {
                ...prev[currentSide],
                texts: prev[currentSide].texts.filter((t) => t.id !== id),
            },
        }));
        setOpenTextLayers((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const updateText = (id, updates) => {
        setDesigns((prev) => ({
            ...prev,
            [currentSide]: {
                ...prev[currentSide],
                texts: prev[currentSide].texts.map((t) =>
                    t.id === id ? { ...t, ...updates } : t
                ),
            },
        }));
    };

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
            reader.onload = (e) => updateDesign({ uploadedImage: e.target.result });
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        updateDesign({ uploadedImage: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Generate Image for a Side
    const generateImageForSide = async (side) => {
        await document.fonts.ready;
        const originalSide = currentSide;
        setCurrentSide(side);
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!previewRef.current || !textContainerRef.current) {
            setCurrentSide(originalSide);
            throw new Error("Preview not ready");
        }

        const originalClassName = textContainerRef.current.className;
        textContainerRef.current.className = originalClassName.replace(
            /border-2 border-dotted border-white\/50/,
            ""
        );

        const dataUrl = await toPng(previewRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            canvasWidth: 700,
            canvasHeight: 600,
        });

        textContainerRef.current.className = originalClassName;
        setCurrentSide(originalSide);
        return dataUrl;
    };


const handleCustomizeAndAddToCart = async () => {
    setIsUpdating(true);
    setImageLoadError(null);

    try {
        await document.fonts.ready;

        const isFrontCustomized =
            designs.front.texts.some(t => t.title.trim()) ||
            designs.front.uploadedImage;

        const isBackCustomized =
            designs.back.texts.some(t => t.title.trim()) ||
            designs.back.uploadedImage;

        if (!isFrontCustomized && !isBackCustomized) {
            toast.error("Please customize at least one side!");
            setIsUpdating(false);
            return;
        }

        let frontImage = null;
        let backImage = null;

        if (isFrontCustomized) {
            frontImage = await generateImageForSide("front");
        }

        if (isBackCustomized) {
            backImage = await generateImageForSide("back");
        }

        const side =
            isFrontCustomized && isBackCustomized
                ? "both"
                : isFrontCustomized
                ? "front"
                : "back";

        const payload = {
            product_id: product.id,
            side,
            front_image: frontImage,
            back_image: backImage,
            front_price: product?.customization?.front_price || 0,
            back_price: product?.customization?.back_price || 0,
            both_price: product?.customization?.both_price || 0,

            text_front: JSON.stringify(designs.front.texts),
            text_back: JSON.stringify(designs.back.texts),

            image_front: designs.front.uploadedImage || "",
            image_back: designs.back.uploadedImage || "",
        };

        // ✅ STEP–1: SAVE CUSTOMIZATION (axios)
        const response = await axios.post(
            route("product-customize.store"),
            payload
        );

        const customizationId = response.data.customization_id;

        if (!customizationId) {
            toast.error("Customization ID not found!");
            setIsUpdating(false);
            return;
        }else{
            // ✅ STEP–2: ADD TO CART (Inertia)
            
            router.post(
                route("cart.add"),
                {
                    product_id: product.id,
                     qty: qty ?? 1,
                     color_id: colorId ?? null,
                     size_id: sizeId ?? null,
                    customization_id: customizationId,
                },
                {
                    onSuccess: () => {
                        toast.success("Product added to cart successfully!");
                        router.visit(route("cart.index"));
                    },
                    onError: () => {
                        toast.error("Failed to add product to cart!");
                    },
                    onFinish: () => {
                        setIsUpdating(false);
                    },
                }
            );
        }


    } catch (error) {
        console.error(error);
        toast.error("An error occurred during customization.");
        setIsUpdating(false);
    }
};

    const toggleSide = (side) => {
        setCurrentSide(side);
        setImageLoadError(null);
    };

     const handleDownload = async () => {
        if (!previewRef.current) return;
        await document.fonts.ready;
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
            if (textContainerRef.current)
                textContainerRef.current.className = originalClassName;

            const link = document.createElement("a");
            link.download = `custom-${currentSide}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            if (textContainerRef.current)
                textContainerRef.current.className = originalClassName;
            toast.error("Download failed");
        }
    };

    const openPreview = () => setIsPreviewOpen(true);
    const closePreview = () => setIsPreviewOpen(false);
    

    if (
        !product?.customization?.front_image &&
        !product?.customization?.back_image
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 lg:p-6 min-h-screen md:items-start">
                    {/* Left: Controls */}
                    <div className="order-2 md:order-1 bg-dark1 p-4 rounded-lg shadow-md md:max-h-screen md:overflow-y-auto">
                        {/* Tabs */}
                        <div className="flex mb-8 rounded-xl overflow-hidden border border-gray-700">
                            {["text", "image", "container"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                        activeTab === tab
                                            ? "bg-cream text-dark1 shadow-lg shadow-purple-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-gray-700/70"
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Text Tab */}
                        {activeTab === "text" && (
                            <div className="space-y-4">
                                {currentDesign.texts.map((textItem, index) => {
                                    const isOpen =
                                        openTextLayers[textItem.id] ?? index === 0;

                                    return (
                                        <div
                                            key={textItem.id}
                                            className="border border-gray-600 rounded-xl overflow-hidden bg-gray-800/60 shadow-lg"
                                        >
                                            <div
                                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700/80 transition-all duration-200"
                                                onClick={() =>
                                                    setOpenTextLayers((prev) => ({
                                                        ...prev,
                                                        [textItem.id]: !prev[textItem.id],
                                                    }))
                                                }
                                            >
                                                <h4 className="text-md font-bold text-white flex items-center gap-3">
                                                    <span className="text-cream">
                                                        Text {index + 1}
                                                    </span>
                                                    {textItem.title && (
                                                        <span className="text-sm font-normal text-gray-400 truncate max-w-xs">
                                                            "{textItem.title}"
                                                        </span>
                                                    )}
                                                </h4>
                                                <div className="flex items-center gap-4">
                                                    {currentDesign.texts.length > 1 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeText(textItem.id);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                    <svg
                                                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                                                            isOpen ? "rotate-180" : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {isOpen && (
                                                <div className="p-6 border-t border-gray-700 space-y-6 bg-gray-800/40">
                                                    <input
                                                        type="text"
                                                        value={textItem.title}
                                                        onChange={(e) =>
                                                            updateText(textItem.id, {
                                                                title: e.target.value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                                        placeholder="Enter your text here..."
                                                    />

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm text-gray-300 mb-2">
                                                                X Position: {textItem.xAxis}%
                                                            </label>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={textItem.xAxis}
                                                                onChange={(e) =>
                                                                    updateText(textItem.id, {
                                                                        xAxis: +e.target.value,
                                                                    })
                                                                }
                                                                className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-purple-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm text-gray-300 mb-2">
                                                                Y Position: {textItem.yAxis}%
                                                            </label>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={textItem.yAxis}
                                                                onChange={(e) =>
                                                                    updateText(textItem.id, {
                                                                        yAxis: +e.target.value,
                                                                    })
                                                                }
                                                                className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-purple-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm text-gray-300 mb-2">
                                                            Text Size: {textItem.textSize}px
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="12"
                                                            max="72"
                                                            value={textItem.textSize}
                                                            onChange={(e) =>
                                                                updateText(textItem.id, {
                                                                    textSize: +e.target.value,
                                                                })
                                                            }
                                                            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-purple-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-white mb-3">
                                                            Text Color
                                                        </label>
                                                        <div className="flex gap-3 flex-wrap">
                                                            {colorOptions.map((color) => (
                                                                <button
                                                                    key={color.id}
                                                                    onClick={() =>
                                                                        updateText(textItem.id, {
                                                                            titleColor: color.value,
                                                                        })
                                                                    }
                                                                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                                                                        textItem.titleColor === color.value
                                                                            ? "border-white shadow-lg scale-110"
                                                                            : "border-gray-600 hover:border-gray-400"
                                                                    }`}
                                                                    style={{ backgroundColor: color.value }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-white mb-2">
                                                            Font Style
                                                        </label>
                                                        <select
                                                            value={textItem.fontFamily}
                                                            onChange={(e) =>
                                                                updateText(textItem.id, {
                                                                    fontFamily: e.target.value,
                                                                })
                                                            }
                                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                                        >
                                                            {fontOptions.map((font) => (
                                                                <option key={font.id} value={font.value}>
                                                                    {font.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <button
                                    onClick={addNewText}
                                    className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-md rounded-xl shadow-2xl"
                                >
                                    + Add New Text
                                </button>
                            </div>
                        )}

                        {/* Image Tab */}
                        {activeTab === "image" && (
                            <div className="space-y-6">
                                <div className="rounded-lg">
                                    <h3 className="text-sm font-semibold text-cream mb-3">
                                        Upload Image/Sticker
                                    </h3>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="w-full px-4 py-3 text-sm border border-gray-600 rounded-lg bg-gray-900 text-cream cursor-pointer focus:outline-none"
                                    />
                                </div>

                                {currentDesign.uploadedImage && (
                                    <div className="p-4 bg-gray-800/60 rounded-xl space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-cream mb-1">
                                                    X Position: {currentDesign.imageXAxis}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={currentDesign.imageXAxis}
                                                    onChange={(e) =>
                                                        updateDesign({ imageXAxis: +e.target.value })
                                                    }
                                                    className="w-full accent-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-cream mb-1">
                                                    Y Position: {currentDesign.imageYAxis}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={currentDesign.imageYAxis}
                                                    onChange={(e) =>
                                                        updateDesign({ imageYAxis: +e.target.value })
                                                    }
                                                    className="w-full accent-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-cream mb-1">
                                                    Size: {currentDesign.imageSize}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="100"
                                                    value={currentDesign.imageSize}
                                                    onChange={(e) =>
                                                        updateDesign({ imageSize: +e.target.value })
                                                    }
                                                    className="w-full accent-purple-500"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleRemoveImage}
                                            className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-lg"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Container Tab */}
                        {activeTab === "container" && (
                            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 space-y-8">
                                <h3 className="text-lg font-bold text-cream text-center">
                                    Design Area Size & Position
                                </h3>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Width: {currentDesign.containerWidth}px
                                    </label>
                                    <input
                                        type="range"
                                        min="140"
                                        max="400"
                                        step="10"
                                        value={currentDesign.containerWidth}
                                        onChange={(e) =>
                                            updateDesign({ containerWidth: +e.target.value })
                                        }
                                        className="w-full accent-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Height: {currentDesign.containerHeight}px
                                    </label>
                                    <input
                                        type="range"
                                        min="140"
                                        max="400"
                                        step="10"
                                        value={currentDesign.containerHeight}
                                        onChange={(e) =>
                                            updateDesign({ containerHeight: +e.target.value })
                                        }
                                        className="w-full accent-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">
                                            X Position: {currentDesign.containerXAxis}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={currentDesign.containerXAxis}
                                            onChange={(e) =>
                                                updateDesign({ containerXAxis: +e.target.value })
                                            }
                                            className="w-full accent-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">
                                            Y Position: {currentDesign.containerYAxis}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={currentDesign.containerYAxis}
                                            onChange={(e) =>
                                                updateDesign({ containerYAxis: +e.target.value })
                                            }
                                            className="w-full accent-purple-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        updateDesign({
                                            containerWidth: 240,
                                            containerHeight: 240,
                                            containerXAxis: 50,
                                            containerYAxis: 50,
                                        })
                                    }
                                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                >
                                    Reset to Default (240×240)
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleCustomizeAndAddToCart}
                            disabled={isUpdating}
                            className={`w-full py-4 mt-6 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all ${
                                isUpdating
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105"
                            }`}
                        >
                            {isUpdating ? "Processing..." : "Customize & Add to Cart"}
                        </button>
                    </div>

                    {/* Right: Preview */}
                    <div className="order-1 md:order-2 flex flex-col items-start justify-start sticky top-1 z-10">
                        <div className="w-full p-4">
                            <div className="flex justify-between items-center gap-4 mb-6">
                                <div className="flex rounded-xl p-1 border border-white/20">
                                    {["front", "back"].map((side) => (
                                        <button
                                            key={side}
                                            onClick={() => toggleSide(side)}
                                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                                                currentSide === side
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            {side.charAt(0).toUpperCase() + side.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={openPreview}
                                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                                        title="Full Preview"
                                    >
                                        <FaEye className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                                        title="Download PNG"
                                        onClick={handleDownload}
                                    >
                                        <MdOutlineFileDownload className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            </div>

                            {imageLoadError ? (
                                <p className="text-red-500 text-center">{imageLoadError}</p>
                            ) : !product?.customization?.[currentSide + "_image"] ? (
                                <p className="text-cream text-center">
                                    No {currentSide} image available.
                                </p>
                            ) : (
                                <figure ref={previewRef} className="relative w-full max-w-2xl mx-auto">
                                    <img
                                        src={`/${product.customization[currentSide + "_image"]}`}
                                        alt={`${currentSide} view`}
                                        className="w-full h-auto object-contain rounded-lg shadow-2xl"
                                        crossOrigin="anonymous"
                                    />
                                    <div
                                        ref={textContainerRef}
                                        className="absolute inset-0 flex items-center justify-center border-2 border-dotted border-white/50 rounded-xl pointer-events-none"
                                        style={containerStyle}
                                    >
                                        {currentDesign.uploadedImage && (
                                            <img
                                                src={currentDesign.uploadedImage}
                                                alt="Uploaded"
                                                className="absolute object-contain pointer-events-none"
                                                style={imagePositionStyle}
                                            />
                                        )}
                                        {currentDesign.texts.map(
                                            (textItem) =>
                                                textItem.title && (
                                                    <p
                                                        key={textItem.id}
                                                        className="absolute font-bold text-center pointer-events-none select-none"
                                                        style={{
                                                            fontSize: `${textItem.textSize}px`,
                                                            color: textItem.titleColor,
                                                            fontFamily: textItem.fontFamily,
                                                            left: `${textItem.xAxis}%`,
                                                            top: `${textItem.yAxis}%`,
                                                            transform: "translate(-50%, -50%)",
                                                            whiteSpace: "pre-wrap",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {textItem.title}
                                                    </p>
                                                )
                                        )}
                                    </div>
                                </figure>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Preview Modal */}
            <Modal
                isOpen={isPreviewOpen}
                onRequestClose={closePreview}
                style={customStyles}
                ariaHideApp={false}
            >
                <div className="flex flex-col items-center bg-white p-6 rounded-xl">
                    <div className="flex justify-between items-center w-full mb-6">
                        <h2 className="text-2xl font-bold text-dark1">
                            {currentSide.charAt(0).toUpperCase() + currentSide.slice(1)} Preview
                        </h2>
                        <button
                            onClick={closePreview}
                            className="text-3xl text-gray-600 hover:text-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="relative w-full max-w-lg">
                        <img
                            src={`/${product.customization[currentSide + "_image"]}`}
                            alt="Preview"
                            className="w-full h-auto object-contain rounded-lg"
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={containerStyle}
                        >
                            {currentDesign.uploadedImage && (
                                <img
                                    src={currentDesign.uploadedImage}
                                    alt="Sticker"
                                    className="absolute object-contain"
                                    style={imagePositionStyle}
                                />
                            )}
                            {currentDesign.texts.map(
                                (textItem) =>
                                    textItem.title && (
                                        <p
                                            key={textItem.id}
                                            className="absolute font-bold text-center"
                                            style={{
                                                fontSize: `${textItem.textSize}px`,
                                                color: textItem.titleColor,
                                                fontFamily: textItem.fontFamily,
                                                left: `${textItem.xAxis}%`,
                                                top: `${textItem.yAxis}%`,
                                                transform: "translate(-50%, -50%)",
                                                whiteSpace: "pre-wrap",
                                                maxWidth: "90%",
                                            }}
                                        >
                                            {textItem.title}
                                        </p>
                                    )
                            )}
                        </div>
                    </div>

                    <button
                        onClick={closePreview}
                        className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomizeProduct;