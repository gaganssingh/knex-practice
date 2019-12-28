const ShoppingListService = {
	// prettier-ignore
	getFullList(knex) {
        return knex
        .select("*")
        .from("shopping_list")
    },
	// prettier-ignore
	insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into("shopping_list")
            .returning("*")
            .then(rows => rows[0])
    },
	// prettier-ignore
	getById(knex, id) {
        return knex
            .from("shopping_list")
            .select("*")
            .where("id", id)
            .first()
    },
	// prettier-ignore
	deleteItem(knex, id) {
        return knex("shopping_list")
            .where({ id })
            .delete()
    },
	// prettier-ignore
	updateItem(knex, id, newItemData) {
        return knex("shopping_list")
            .where({ id })
            .update(newItemData)
    }
};

module.exports = ShoppingListService;
