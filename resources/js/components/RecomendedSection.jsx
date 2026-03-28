import React from "react"; // Adjust the import path
import SectionTitle from "./UI/SectionTitle";
import ProductCardTwo from "./ProductCardTwo";


const RecomendedSection = ({products}) => {
    // console.log('recommended products',products);
    // Fetch products by type using the RTK Query hook
    return (
        <div className="pt-[19px] pb-[33px] lg:pt-17 lg:pb-17 bg-dark1 ">
            <div className="px-[18px]   lg:px-20  max-w-[1200px] mx-auto">
                <div className="mb-5">
                    <SectionTitle
                        smallTitle="Best Products"
                        title="Recommended For You"
                        subtitle={`Check out our best-selling items, including bags, t-shirts, and more!`}
                        btnUrl="all-products"
                    />
                </div>
                <div>
                    {/* product card start */}
                  
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4 lg:gap-5">
                            {products.map((product) => (
                                <ProductCardTwo
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                 
                </div>
            </div>
        </div>
    );
};

export default RecomendedSection;
