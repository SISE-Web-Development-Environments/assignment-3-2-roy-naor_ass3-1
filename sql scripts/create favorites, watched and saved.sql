CREATE TABLE [dbo].[WatchedRecipes](
    [user_id] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_id] int NOT NULL,
	PRIMARY KEY (user_id, recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)

CREATE TABLE [dbo].[SavedRecipes](
    [user_id] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_id] int NOT NULL,
	PRIMARY KEY (user_id, recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)

CREATE TABLE [dbo].[FavoriteRecipes](
    [user_id] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_id] int NOT NULL,
	PRIMARY KEY (user_id, recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)