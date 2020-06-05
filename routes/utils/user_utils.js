const DButils = require("./DButils");

async function getUserInfoOnRecipes(user_id, recipes_ids) {
    let result = {};
    for (let i = 0; i < recipes_ids.length; i++) {
        // Checks if the user watched the given recipes
        let watched_recipes = await DButils.execQuery(`SELECT * FROM WatchedRecipes WHERE user_id = '${user_id}' AND recipe_id = ${recipes_ids[i]}`);
        if (watched_recipes.length === 0) {
            watched_recipes = false;
        } else {
            watched_recipes = true;
        }

        // Checks if the user saved the given recipes
        let saved_recipe = await DButils.execQuery(`SELECT * FROM SavedRecipes WHERE user_id = '${user_id}' AND recipe_id = ${recipes_ids[i]}`);;
        if (saved_recipe.length === 0) {
            saved_recipe = false;
        } else {
            saved_recipe = true;
        }

        let recipe_info = {
            watched: watched_recipes,
            saved: saved_recipe
        }
        //returns value as a dictionary
        result[recipes_ids[i]] = recipe_info
    }
    return result;
}

exports.getUserInfoOnRecipes = getUserInfoOnRecipes;