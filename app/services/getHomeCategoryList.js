import { filterByStatus, apiBaseUrl } from "../utils";

export const getHomeCategoryList = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/all-store-category-product`, {
            next: { revalidate: 1 },
        });
        const result  = await response.json();
        const categoryProductData = Array.isArray(result.data) ? result.data : [];
        return categoryProductData;
    } catch (error) {
        console.error("Something went wrong fetching Home Category data");
        console.info(error);
    }
};
