var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const bcrypt = require("bcrypt");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        // req.session.user_id = user_id; //refresh the session value
        // res.locals.user_id = user_id;
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

router.post('/watched/:recipeId', async (req, res) => {
  try{
    const recipe_id = req.params.recipeId;
    const user_id = req.user_id;
    await user_utils.markRecipeAsWatched(user_id, recipe_id);
    res.status(200).send("Marked successfully the recipe as watched");
  }catch(error){
    next(error);
  }
});

module.exports = router;
