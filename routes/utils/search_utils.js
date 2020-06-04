const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const apiKey = process.env.spooncular_apiKey;
const recipes_utils = require("./recipes_utils");


function extractQueryParams(query_params, search_params) {
    const optional_params = ["cuisine", "diet", "intolerances"];

    optional_params.forEach((param) => {
        if (query_params[param]) {
            search_params[param] = query_params[param];
        }
    });
}

async function searchForRecipes(search_params) {
    let search_response = await axios.get(`${api_domain}/search`,
        {
            params: search_params,
        }
    );
    // keeps only the recipes ids
    const recipes_ids = recipes_utils.extractRecipesIds(search_response);
    // Do another API query for getting recipes details
    let recipes = await recipes_utils.getRecipesInfo(recipes_ids);
    if(!recipes || !recipes.length){
        
    }
    return recipes;
}

exports.extractQueryParams = extractQueryParams;
exports.searchForRecipes = searchForRecipes;