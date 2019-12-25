require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
	client     : "pg",
	connection : process.env.DB_URL
});

// Get all items that contain text
// A function that takes one parameter for searchTerm which will be any string
// The function will query the shopping_list table using Knex methods and select the rows which have a name that contains the searchTerm using a case insensitive match.
// prettier-ignore
function searchByName(searchTerm) {
	knexInstance
		.select("name", "price", "category", "checked")
		.from("shopping_list")
		.where("name", "ILIKE", `%${searchTerm}%`)
		.then(result => console.log(result))
}
searchByName("al");

// Get all items paginated
// A function that takes one parameter for pageNumber which will be a number
// The function will query the shopping_list table using Knex methods and select the pageNumber page of rows paginated to 6 items per page.
function paginatedItems(page) {
	const productsPerPage = 10;
	const pageOffset = productsPerPage * (page - 1);
	knexInstance
		.select("id", "name", "price", "category", "checked")
		.from("shopping_list")
		.limit(productsPerPage)
		.offset(pageOffset)
		.then(result => console.log(result));
}
paginatedItems(3);

// Get all items added after date
// A function that takes one parameter for daysAgo which will be a number representing a number of days.
// This function will query the shopping_list table using Knex methods and select the rows which have a date_added that is greater than the daysAgo.
function checkAddedTimePassed(days) {
	knexInstance
		.select("id", "name", "price", "category", "date_added")
		.where("date_added", ">", knexInstance.raw(`now() - '?? days'::INTERVAL`, days))
		.from("shopping_list")
		.then(result => console.log(result));
}
checkAddedTimePassed(30);

// Get the total cost for each category
// A function that takes no parameters
// The function will query the shopping_list table using Knex methods and select the rows grouped by their category and showing the total price for each category.
// prettier-ignore
function totalCostByCategory() {
	knexInstance
		.select("category")
		.sum("price AS total-cost")
		.from("shopping_list")
		.groupBy("category")
		.then(result => console.log(result))
}
totalCostByCategory();
