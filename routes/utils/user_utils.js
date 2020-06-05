const DButils = require("./DButils");

function getUserInfoOnRecipes(username, recipes_ids) {
    let result = {};
    recipes_ids.map((recipe_id) => {
        //TODO: gets favorites and watched from DB
        let watched_recipes = await DButils.execQuery(`SELECT * FROM WatchedRecipes Where user_id = '${username}' AND recipe_id = '${recipe_id}'`);
        if(watched_recipes){
            watched_recipes = true;
        }else{
            watched_recipes = false;
        }
        
        let saved_recipe = await DButils.execQuery(`SELECT * FROM SavedRecipes Where user_id = '${username}' AND recipe_id = '${recipe_id}'`);;
        if(saved_recipe){
            saved_recipe = true;
        }else{
            saved_recipe = false;
        }

        let recipe_info = {
            watched: watched_recipes,
            saved: saved_recipe
        }

        result[recipe_id] = recipe_info
    })
    return result;
}

exports.getUserInfoOnRecipes = getUserInfoOnRecipes;