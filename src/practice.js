require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
	client     : "pg",
	connection : process.env.DB_URL
});

// prettier-ignore
// knexInstance
//     .select("product_id", "name", "price", "category")
//     .from("amazong_products")
//     .where({ name: "Point of view gun" })
//     .first()
//     .then(result => console.log(result))

// Build a query that allows customers to search the
// amazong_products table for products that contain a word
// prettier-ignore
// function searchByProductName(searchTerm) {
//     knexInstance
//         .select("product_id", "name", "price", "category")
//         .from("amazong_products")
//         .where("name", "ILIKE", `%${searchTerm}%`)
//         .then(result => console.log(result))
// }

// searchByProductName("holo");

// Build a query that allows customers to paginate the
// amazong_products table products, 10 products at a time
// prettier-ignore
// function paginatedProducts(page) {
//     const productsPerPage = 10;
//     const offset = productsPerPage * (page - 1);
//     knexInstance
//         .select("product_id", "name", "price", "category")
//         .from("amazong_products")
//         .limit(productsPerPage)
//         .offset(offset)
//         .then(result => console.log(result))
// }

// paginatedProducts(4);

// Build a query that allows customers to filter the
// amazong_products table for products that have images
// prettier-ignore
// function getProductsWithImages() {
//     knexInstance
//         .select("product_id", "name", "price", "category", "image")
//         .from("amazong_products")
//         .whereNotNull("image")
//         .then(result => console.log(result))
// }
// getProductsWithImages();

// Build a query that allows customers to see the most popular
// videos by view at Whopipe by region for the last 30 days
// prettier-ignore
function mostPopularVideosForDays(days) {
    knexInstance
        .select("video_name", "region")
        .count("date_viewed AS views")
        .where(
            "date_viewed",
            ">",
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from("whopipe_video_views")
        .groupBy("video_name", "region")
        .orderBy([
            { column: "region", order: "ASC" },
            { column: "views", order: "DESC" },
        ])
        .then(result => console.log(result))
}
mostPopularVideosForDays(30);
