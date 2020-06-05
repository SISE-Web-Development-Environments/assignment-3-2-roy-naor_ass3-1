insert into WatchedRecipes values 
((select user_id from users where username = 'royj'),123)

