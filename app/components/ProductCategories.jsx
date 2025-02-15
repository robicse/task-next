"use client";

const ProductCategories = ({
    categoryProductData
}) => {
    return (
        <div className="row nh-categories-row">
            <div className="col-md-12">
                <div className="nh-categories-holder-s">

                {categoryProductData.length > 0 ? (
                categoryProductData.map((store) => (
                    <div key={store.store_id}>
                    <p>{store.store_name}</p>

                    {store.category.map((category) => (
                        <div key={category.category_id} style={{ marginLeft: "20px" }}>
                        <p>{category.category_name}</p>

                        {category.product.map((product) => (
                            <div key={product.product_id} style={{ marginLeft: "40px" }}>
                            <p>{product.product_name}</p>
                            </div>
                        ))}
                        </div>
                    ))}
                    </div>
                ))
                ) : (
                <p>Loading...</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default ProductCategories;
