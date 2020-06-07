insert into WatchedRecipes (user_id,recipe_id) values 
('14a00f1d-ebe2-4b05-ba11-f1b45547bf82',1111)

select * from users

insert into WatchedRecipes (user_id,recipe_id) values 
((select user_id from users where username='testuser'),1111)

update WatchedRecipesTest set time = GETDATE() 
Where user_id = (select user_id from users where username='testuser')
and recipe_id=1111


IF EXISTS
(SELECT * FROM WatchedRecipesTest WHERE user_id = 'e357333b-64fb-42c0-84c5-3ef7afae25d3'
and recipe_id=1234)
    UPDATE WatchedRecipesTest
    SET time = GETDATE()
    WHERE user_id = 'e357333b-64fb-42c0-84c5-3ef7afae25d3'
and recipe_id=1234
ELSE
    insert into WatchedRecipesTest (user_id,recipe_id) values 
('e357333b-64fb-42c0-84c5-3ef7afae25d3',1234)

`IF EXISTS
(SELECT * FROM WatchedRecipesTest WHERE user_id = '${user_id}'
and recipe_id=${recipe_id})
    UPDATE WatchedRecipesTest
    SET time = GETDATE()
    WHERE user_id = '${user_id}'
and recipe_id=${recipe_id}
ELSE
    insert into WatchedRecipesTest (user_id,recipe_id) values 
('${user_id}',${recipe_id})`


select * from RecipeInstructions


insert into PersonalRecipes 
(user_id, title, readyInMinutes,[image],popularity,vegan,vegetarian,glutenFree,servings) 
values (
    'e357333b-64fb-42c0-84c5-3ef7afae25d3', 'Banana Cake', 45, 'www.google.com', 10, 0,0,1,15)

insert into RecipeIngredients values (1,'2 Banana'), (1,'3 Eggs'), (1, '1 cup milk')
  
insert into RecipeInstructions values (1,1,'mash the bananas'), (1,2,'break the eggs'), (1,3,'pour milk')

-- for(i=0; i<personal_recipes.length; i++){
--      let recipe_ingredients = await DButils.execQuery(`select ingredient from RecipeIngredients WHERE recipe_id = ${personal_recipes[i].recipe_id}`);
 --     recipe_ingredients.map((element) => ingredients_array.push(element.ingredient)); 
--     //TODO: insrtucation here
--      personal_recipes[i].ingredients = ingredients_array;
--    }


insert into familyRecipes (user_id,title,Recipe_Owner,Recommended_Time) values 
((select user_id from users where username='testUser'),'Omlette' , 'Mama test', 'Every Morning'),
((select user_id from users where username='testUser'), 'Meat','Papa test', 'Every Evening'),
((select user_id from users where username='testUser'), 'Pasta','Uncle test', 'Every Noon')

select * from familyRecipes

insert into RecipeIngredients values (1000,'2 eggs'), (1000,'1 tablespoon salt')

insert into RecipeInstructions values (1000,1,'break the eggs'), (1000,2,'scramble the eggs'), (1000,3,'add salt'), (1000,4,'pour the eggs to the pan')
  
insert into RecipeIngredients values (1001,'1 steak'), (1001,'1 tablespoon salt'), (1001,'1 tablespoon gravy')

insert into RecipeInstructions values (1001,1,'wash the steak'), (1001,2,'put the salt and gravy on the steak'), (1001,3,'cook the meat')

insert into RecipeIngredients values (1002,'1 bag pasta'), (1002,'1 tablespoon salt')

insert into RecipeInstructions values (1002,1,'boil water'), (1002,2,'make the pasta')


select * from RecipeInstructions where recipe_id = 1002
  