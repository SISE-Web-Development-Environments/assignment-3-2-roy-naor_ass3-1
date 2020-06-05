var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const bcrypt = require("bcrypt");

//#region complex
//Authenticate all incoming requests
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
//#endregion

router.get('/recipeInfo/:ids', (req, res) => {
  try {
    const recipes_ids = JSON.parse(req.params.ids);
    const username = req.body.username;
    console.log(recipes_ids, username);
    const userInfo = user_utils.getUserInfoOnRecipes(username, recipes_ids);
    res.send(userInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
