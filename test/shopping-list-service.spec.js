const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe("Articles service object", () => {
	let db;
	let testList = [
		{
			id         : 1,
			name       : "Test item 1",
			price      : "5.99",
			date_added : new Date("2029-01-22T16:28:32.615Z"),
			checked    : true,
			category   : "Main"
		},
		{
			id         : 2,
			name       : "Test item 2",
			price      : "3.99",
			date_added : new Date("2100-05-22T16:28:32.615Z"),
			checked    : false,
			category   : "Snack"
		},
		{
			id         : 3,
			name       : "Test item 3",
			price      : "11.99",
			date_added : new Date("1988-11-22T16:28:32.615Z"),
			checked    : true,
			category   : "Lunch"
		},
		{
			id         : 4,
			name       : "Test item 4",
			price      : "9.99",
			date_added : new Date("1919-12-22T16:28:32.615Z"),
			checked    : false,
			category   : "Breakfast"
		}
	];

	before(() => {
		db = knex({
			client     : "pg",
			connection : process.env.TEST_DB_URL
		});
	});

	before(() => db("shopping_list").truncate());

	afterEach(() => db("shopping_list").truncate());

	after(() => db.destroy());

	context(`Given "shopping_list" has some data`, () => {
		// prettier-ignore
		beforeEach(() => {
            return db
                .into("shopping_list")
                .insert(testList)
        })

		it(`getFullList() resolves complete list from "shopping_list" table`, () => {
			// prettier-ignore
			return ShoppingListService.getFullList(db)
                .then(actual => expect(actual).to.eql(testList))
		});

		it(`getById() resolves an article by id from "shopping_list" table`, () => {
			const thirdId = 3;
			const thirdTestItem = testList[thirdId - 1];
			// prettier-ignore
			return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id         : thirdId,
                        name       : thirdTestItem.name,
                        price      : thirdTestItem.price,
                        date_added : thirdTestItem.date_added,
                        checked    : thirdTestItem.checked,
                        category   : thirdTestItem.category
                    })
                })
		});

		it(`deleteItem() removes an item by id from "shopping_list" table`, () => {
			const itemId = 3;
			// prettier-ignore
			return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getFullList(db))
                .then(allItems => {
                    const expected = testList.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
		});

		it(`updateItem() updates an item by id from "shopping_list" table`, () => {
			const idOfItemToUpdate = 3;
			const newItemData = {
				name       : "updated name",
				price      : "5.35",
				date_added : new Date(),
				checked    : false,
				category   : "Snack"
			};
			// prettier-ignore
			return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
		});
	});

	context(`Given "shopping_list" has no data`, () => {
		it(`getFullList() resolves an empty array`, () => {
			// prettier-ignore
			return ShoppingListService.getFullList(db)
                .then(actual => expect(actual).to.eql([]))
		});

		it(`insertItem() returns a new item to "shopping_list" and resolves it with an id`, () => {
			const newItem = {
				name       : "Test new name",
				price      : "1.99",
				date_added : new Date("2020-01-01T00:00:00.000Z"),
				checked    : false,
				category   : "Main"
			};
			// prettier-ignore
			return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name       : newItem.name,
                        price      : newItem.price,
                        date_added : newItem.date_added,
                        checked    : newItem.checked,
                        category   : newItem.category
                    })
                })
		});
	});
});
