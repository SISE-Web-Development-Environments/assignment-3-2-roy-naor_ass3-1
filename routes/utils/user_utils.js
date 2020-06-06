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

async function markRecipeAsWatched(user_id, recipe_id) {
    await DButils.execQuery(`IF EXISTS
    (SELECT * FROM WatchedRecipes WHERE user_id = '${user_id}'
    and recipe_id=${recipe_id})
        UPDATE WatchedRecipes
        SET time = GETDATE()
        WHERE user_id = '${user_id}'
    and recipe_id=${recipe_id}
    ELSE
        insert into WatchedRecipes (user_id,recipe_id) values 
    ('${user_id}',${recipe_id})`);
}

async function getLastThreeWatchedRecipes(user_id) {
    const result = await DButils.execQuery(
    `SELECT TOP 3 recipe_id
     FROM WatchedRecipes
    WHERE user_id= '${user_id}' 
    ORDER BY time DESC`);

    return result;
}


exports.getUserInfoOnRecipes = getUserInfoOnRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getLastThreeWatchedRecipes = getLastThreeWatchedRecipes;