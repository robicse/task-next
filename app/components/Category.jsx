import { getHomeCategoryList } from "../services/getHomeCategoryList";
import ProductCategories from "./ProductCategories";

async function Category() {
    const categoryData = await getHomeCategoryList();
    const categoryProductData = categoryData;
    

    return (
        <section className="container">
            <div className="nh-categories-area mt-5">
                <ProductCategories categoryProductData={categoryProductData} />
            </div>
        </section>
    );
}

export default Category;
