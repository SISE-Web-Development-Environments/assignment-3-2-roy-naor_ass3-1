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
        let saved_recipe = await DButils.execQuery(`SELECT * FROM FavoriteRecipes WHERE user_id = '${user_id}' AND recipe_id = ${recipes_ids[i]}`);;
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


async function getPersonalRecipes(user_id){
    const personal_recipes = await DButils.execQuery(
        `select recipe_id as id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree
        from PersonalRecipes where user_id='${user_id}'`);

    return personal_recipes;
}

async function getPersonalRecipe(user_id, recipe_id){
    const personal_recipe = await DButils.execQuery(`select recipe_id as id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, servings
     from PersonalRecipes where user_id='${user_id}' and recipe_id = ${recipe_id}`);

     return personal_recipe;
}


async function getRecipeIngredients(recipe_id){
    const recipe_ingredients = await DButils.execQuery(
        `select ingredient from RecipeIngredients WHERE recipe_id = ${recipe_id}`);

    return recipe_ingredients;
}

async function getRecipeInstructions(recipe_id){
    const recipe_instructions = await DButils.execQuery(
        `select description from RecipeInstructions where recipe_id = ${recipe_id} order by serial_number`);

    return recipe_instructions;
}


async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

exports.getUserInfoOnRecipes = getUserInfoOnRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getLastThreeWatchedRecipes = getLastThreeWatchedRecipes;
exports.getPersonalRecipe = getPersonalRecipe;
exports.getPersonalRecipes = getPersonalRecipes;
exports.getRecipeIngredients = getRecipeIngredients;
exports.getRecipeInstructions = getRecipeInstructions;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;