const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Return a list of recipes ids 
 * @param {*} recipes: Object with an array of full recipes objects that was retrieved by search response
 */
function extractRecipesIds(recipes) {
    let recipes_ids_list = [];
    (recipes).map((recipe) => {
        recipes_ids_list.push(recipe.id);
    });
    return recipes_ids_list;
}

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
function extractPreviewRecipeDetails(recipes_info) {

    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
}


function getRecipeIngredients(recipe_info) {
    let ingredients_result = [];
    let { extendedIngredients } = recipe_info.data;
    extendedIngredients.map((ingredient) => {
        ingredients_result.push(ingredient.originalString)
    });
    return ingredients_result;
}

function getRecipeInstructions(recipe_info) {
    let instructions_result = [];
    let { analyzedInstructions } = recipe_info.data;
    analyzedInstructions.map((instruction) => {
        if( instruction.name != ""){
            instructions_result.push(instruction.name);
        }
        (instruction.steps).map((step) => instructions_result.push(step.step));
    });
    return instructions_result;
}

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    return extractPreviewRecipeDetails(info_res);
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings } = recipe_info.data;
    // let recipe_info_in_array = [];
    // recipe_info_in_array.push(recipe_info);
    // let recipe_preview = extractPreviewRecipeDetails(recipe_info_in_array);
    let ingredients = getRecipeIngredients(recipe_info);
    let instructions = getRecipeInstructions(recipe_info);
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        ingredients: ingredients,
        instructions: instructions,
        servings: servings
    }
}

// async function getRecipesInfoWithInstructions(recipes_ids_list) {
//     let promises = [];
//     recipes_ids_list.map((id) => {
//         // get information about the recipe
//         let recipe_info = getRecipeInformation(id);
//         // check if the recipe contains instructions
//         let instructions = recipe_info.data.instructions;
//         while (instructions === '') {
//             // if not we should get a new random recipe
//             let recipe_info = getFullRandomRecipe();
//             let tmp_instructions = recipe_info.data.instructions;
//             instructions = tmp_instructions;
//         }
//         // if yes - puse to promises array
//         promises.push(recipe_info);
//     });
//     let info_res = await Promise.all(promises);
//     return extractRelevantRecipeDetails(info_res);
// }


/**
 * We ask for 10 because we wanted to increase the chances to have 3 with the field not empty
 */
async function getRandomRecipes() {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}


async function getRandomThreeRecipes() {
    let random_pool = await getRandomRecipes();
    let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image != ""));
    if (filterd_random_pool.length < 3) {
        return getRandomThreeRecipes();
    }
    return extractPreviewRecipeDetails([filterd_random_pool[0], filterd_random_pool[1], filterd_random_pool[2]]);
}

exports.extractRecipesIds = extractRecipesIds;
exports.extractPreviewRecipeDetails = extractPreviewRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.getRecipeDetails = getRecipeDetails;


