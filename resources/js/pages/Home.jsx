import Hero from "../components/Hero";
import RecomendedSection from "../components/RecomendedSection";
import EssentialSection from "../components/EssentialSection";
import CustomOrderBanner from "../components/CustomOrderBanner";

import CategorySection from "../components/CategorySection";
import FeaturedCategory from "../components/FeaturedCategory";

const Home = ({ sliders, categories, typeBaseProducts, homeProducts }) => {
    return (
        <>
            {/* <h2>hello home page</h2> */}
            <Hero sliders={sliders} />
            <FeaturedCategory categories={categories} />
            <CustomOrderBanner />

            {/* Recommended & Essential   */}
            {typeBaseProducts?.best_product?.length > 0 && (
                <RecomendedSection products={typeBaseProducts?.best_product} />
            )}

            {/* featured products  */}
            {typeBaseProducts?.featured_product?.length > 0 && (
                <EssentialSection
                    products={typeBaseProducts?.featured_product}
                />
            )}

            {homeProducts
                ?.filter((cat) => cat.products.length > 0)
                .map((cat, index) => (
                    <CategorySection
                        key={cat.id}
                        categoryId={cat.id}
                        products={cat}
                        index={index}
                        categorySlug={cat.slug}
                    />
                ))}
        </>
    );
};

export default Home;
