var express = require("express");
var router = express.Router();
const axios = require("axios");
const search_util = require("./utils/search_utils");
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");



const api_domain = "https://api.spoonacular.com/recipes";

router.get("/", (req, res) => res.send("im here"));

router.get("/random", async (req, res, next) => {
  try {
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(random_3_recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/search/query/:searchQuery/amount/:num",  async (req, res, next) => {
  const {searchQuery, num} = req.params;
  // set search params
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = num;
  search_params.instructionsRequired = true;
  search_params.apiKey = process.env.spooncular_apiKey;

  //gives a defult num
  if (num != 5 && num != 10 && num != 15) {
    search_params.number = 5;
  }
  //check if query params exists (cuisine / diet / intolerances) and add them to search_params
  search_util.extractQueryParams(req.query, search_params);
  search_util.searchForRecipes(search_params)
  .then((recipes) => res.send(recipes))
  .catch((err) => {
    next(err);
  })
});

/**
 * This path recieve a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    //TODO: If the user is exists (and not a guest), update the table of watchedRecipes
    if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM users").then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          DButils.execQuery(`INSERT into WatchedRecipes values ('${req.session.user_id}',${req.params.recipeId})`).catch(err=>next(err));
        }
      }).catch(err => next(err));
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// //#region example1 - make serach endpoint
// router.get("/search", async (req, res, next) => {
//   try {
//     const { query, cuisine, diet, intolerances, number } = req.query;
//     const search_response = await axios.get(`${api_domain}/search`, {
//       params: {
//         query: query,
//         cuisine: cuisine,
//         diet: diet,
//         intolerances: intolerances,
//         number: number,
//         instructionsRequired: true,
//         apiKey: process.env.spooncular_apiKey
//       }
//     });
//     let recipes = await Promise.all(
//       search_response.data.results.map((recipe_raw) =>
//         getRecipeInfo(recipe_raw.id)
//       )
//     );
//     recipes = recipes.map((recipe) => recipe.data);
//     res.send({ data: recipes });
//   } catch (error) {
//     next(error);
//   }
// });
// //#endregion

// function getRecipeInfo(id) {
//   return axios.get(`${api_domain}/${id}/information`, {
//     params: {
//       includeNutrition: false,
//       apiKey: process.env.spooncular_apiKey
//     }
//   });
// }

module.exports = router;
