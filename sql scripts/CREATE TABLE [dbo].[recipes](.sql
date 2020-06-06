CREATE TABLE [dbo].[PersonalRecipes](
	[user_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[recipe_id] int NOT NULL,
	[title] [varchar](50),
	[readyInMinutes] int, 
	[profilePic] [varchar](max),
	[popularity] int,
	[vegan] bit,
	[vegeterian] bit,
	[glutenFree] bit,
	[instructions] text,
	[servings] int,
	PRIMARY KEY (user_id, recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)
