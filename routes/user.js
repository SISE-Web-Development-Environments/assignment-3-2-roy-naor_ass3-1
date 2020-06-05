var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const recipe_utils = require("../routes/utils/recipes_utils")
const bcrypt = require("bcrypt");

//#region complex
//Authenticate all incoming requests
router.use("/addPersonalRecipe", function (req, res, next) {
  if (req.session && req.session.user_id) {
    // or findOne Stored Procedure
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = user_id;
        // req.session.user_id = user_id; //refresh the session value
        // res.locals.user_id = user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});
//#endregion

router.get('/favorites', async (req,res,next) => {
  try{
    let user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);

    for(let index = 0; index < recipes.length; index++){
        let recipe = await recipe_utils.getRecipeInformation(recipes[index].recipe_id);
        let preview = recipe_utils.getRecipesPreview(recipe.data);
        favorite_recipes[index+1] = preview
    };
    res.send(favorite_recipes);
  } catch(error){
    next(error); //needs to change?
  }
});


router.post('/addfavorites/:recipeid', async (req,res,next) => {
  try{
    let user_id = req.session.user_id;
    let recipe_id = req.params.recipe_id;
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}','${recipe_id}')`);
    res.sendStatus(200);
  } catch(error){
    next(error); //needs to change?
  }
})


// router.get('/lastwatched', async (req,res,next) => {
//   try{
//     let user_id = req.session.user_id;
//     const recipe_ids = await DButils.execQuery(`select top 3 recipe_id form WatchedRecipes where user_id='${user_id}' order by lastseen desc`);
    
//     let recipe1 = recipe_utils.getRecipeInformation(recipe_ids[0].recipe_id).data;
//     let recipe2 = recipe_utils.getRecipeInformation(recipe_ids[1].recipe_id).data;
//     let recipe3 = recipe_utils.getRecipeInformation(recipe_ids[2].recipe_id).data;

//     let last_watched = {
//       "Recipe 1": recipe1,
//       "Recipe 2": recipe2,
//       "Recipe 3": recipe3,
//     }

//     res.send(last_watched);
//   } catch(error){
//     next(error); //needs to change?
//   }
// });


// router.get("/personalRecipes", function (req, res) {
//   res.send(req.originalUrl);
// });


module.exports = router;
