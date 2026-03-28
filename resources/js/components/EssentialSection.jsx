import React from "react"; // Adjust the import path
import SectionTitle from "./UI/SectionTitle";
import ProductCardTwo from "./ProductCardTwo";
// import { useGetProductsByTypeQuery } from "../redux/services/eCommerceApi";

const EssentialSection = ({products}) => {
    // Fetch products by type using the RTK Query hook
    // const { data, error, isLoading } = useGetProductsByTypeQuery();

    return (
        <div className="pt-[19px] lg:pt-10 pb-[33px] lg:pb-[30px] bg-dark2 ">
            <div className="px-[18px]  lg:px-20 max-w-[1200px] mx-auto">
                <div className="mb-5">
                    <SectionTitle
                        smallTitle="Featured Products"
                        title="Your Everyday Essential"
                        subtitle={`Eco-friendly. Customizable. More than just a tote.`}
                        btnUrl="/all-products"
                    />
                </div>
                <div>
               
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4 lg:gap-5">
                            {products
                                .map((product) => (
                                    <ProductCardTwo
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                        </div>
                 
                    {/* product card end */}
                </div>
            </div>
        </div>
    );
};

export default EssentialSection;
