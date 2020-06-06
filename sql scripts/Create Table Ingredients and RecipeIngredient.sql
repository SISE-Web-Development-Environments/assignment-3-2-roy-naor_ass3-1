--create ingredients table
--create RecipeIngredients table
-- create instructions table?

create table PersonalRecipes (
    [user_id] [UNIQUEIDENTIFIER] NOT NULL,
    [recipe_id] int IDENTITY(1,1) NOT NULL,
    [title] varchar(max) NOT NULL,
    [readyInMinutes] int,
    [image] varchar(max),
    [popularity] int,
    [vegan] bit,
    [vegetarian] bit,
    [glutenFree] bit,
    [servings] int,
    Primary Key (user_id,recipe_id),
    FOREIGN Key (user_id) REFERENCES users(user_id)
)

create table RecipeInstructions(
    [recipe_id] int NOT NULL,
    [serial_number] int NOT NULL,
    [description] Text NOT NULL,
    PRIMARY KEY (recipe_id, serial_number)
)

create table RecipeIngredients(
    [recipe_id] int NOT NULL,
    [ingredient] varchar(50) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient)
)