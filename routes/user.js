var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path returns user's info on recipes by their Ids (if the recipes was watched or saved by user)
 */
router.get('/recipeInfo/:ids', async (req, res) => {
  try {
    const recipes_ids = JSON.parse(req.params.ids);
    const user_id = req.user_id;
 //   console.log(recipes_ids, user_id);
    const userInfo = await user_utils.getUserInfoOnRecipes(user_id, recipes_ids);
    res.send(userInfo);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with recipeId and mark this recipe as watched by the logged-in user
 */
router.post('/watched', async (req, res) => {
  try{
    const recipe_id = req.body.recipeId;
    const user_id = req.user_id;
    await user_utils.markRecipeAsWatched(user_id, recipe_id);
    res.status(200).send("Marked successfully the recipe as watched");
  }catch(error){
    next(error);
  }
});

/**
 * This path returns the last 3 recipes that were seen by the logged-in user
 */
router.get('/lastWatched', async (req, res, next) => {
  try{
    let recipes_ids = [];
    const user_id = req.user_id;
    const lastThreeRecipes = await user_utils.getLastThreeWatchedRecipes(user_id);
    lastThreeRecipes.map((element) => recipes_ids.push(element.recipe_id));
    const results = await recipe_utils.getRecipesPreview(recipes_ids);
    res.status(200).send(results);
  }catch(error){
    next(error);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns a preview of the recipes that were added to the website by the user
 */
router.get('/personalRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let ingredients_array = [];
    const personal_recipes = await user_utils.getPersonalRecipes(user_id);

    res.status(200).send(personal_recipes);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the full view of a recipe that was added to the website by the user
 */
router.get('/personalRecipes/:personalRecipeID', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.params.personalRecipeID;
    let ingredients_array = [];
    let instructions_array = [];
    const personal_recipes = await user_utils.getPersonalRecipe(user_id,recipe_id);

    const recipe_ingredients = await user_utils.getRecipeIngredients(recipe_id);
    recipe_ingredients.map((element) => ingredients_array.push(element.ingredient)); 

    const recipe_instructions = await user_utils.getRecipeInstructions(recipe_id);
    recipe_instructions.map((element) => instructions_array.push(element.description));
    
    personal_recipes[0].ingredients = ingredients_array;
    personal_recipes[0].instructions = instructions_array;  

    res.status(200).send(personal_recipes[0]);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the full view of all the family recipes that were added by the user
 */
router.get('/familyRecipes' , async (req,res,next) => {
  try{
    const user_id = req.session.user_id; 
    let ingredients_array = [];
    let instructions_array = [];

    const family_recipes = await user_utils.getFamilyRecipes(user_id);

    for(i=0; i<family_recipes.length; i++){
      let recipe_ingredients = await user_utils.getRecipeIngredients(family_recipes[i].id);
      recipe_ingredients.map((element) => ingredients_array.push(element.ingredient)); 
  
      let recipe_instructions = await user_utils.getRecipeInstructions(family_recipes[i].id);
      recipe_instructions.map((element) => instructions_array.push(element.description));

      family_recipes[i].ingredients = ingredients_array;
      family_recipes[i].instructions = instructions_array;

      ingredients_array = new Array();
      instructions_array = new Array();
    }

    res.status(200).send(family_recipes);
  } catch(error){
    next(error); 
  }
});

module.exports = router;
