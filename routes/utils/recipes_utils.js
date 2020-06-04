const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Return a list of recipes ids 
 * @param {*} recipes: Object with an array of full recipes objects that was retrieved by search response
 */
function extractRecipesIds(recipes) {
    let recipes_ids_list = [];
    (recipes.data.results).map((recipe) => {
        recipes_ids_list.push(recipe.id);
    });
    return recipes_ids_list;
}

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
function extractRelevantRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = recipe_info.data;
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

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipesInfo(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    return extractRelevantRecipeDetails(info_res);
}

exports.extractRecipesIds = extractRecipesIds;
exports.extractRelevantRecipeDetails = extractRelevantRecipeDetails;
exports.getRecipesInfo = getRecipesInfo;

