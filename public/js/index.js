var multiparty = require("multiparty");
var fs = require("fs");
const Op = db.Sequelize.Op
const ensureAuthenticated = require("./usersAuthHelper");

module.exports = function (app) {

	app.get("/api/recipes", function (req, res) {
		db.Recipes.findAll({
			where: req.body
		}).then(function (recipes) {
			res.json(recipes);
		});
	});

	app.get("/api/recipes/:id", function (req, res) {
		db.Recipes.findByPk(req.params.id).then(function (dbRecipe) {
			if (dbRecipe === null) {
				res.status(404).send("Not Found");
			}

			dbRecipe.getProducts().then(function (products) {
				var response = {
					recipe: dbRecipe,
					products: products
				};

				dbRecipe.image = dbRecipe.image.toString("base64");
				res.json(response);
			});
		});
	});

	app.post("/api/recipes", function (req, res) {
		db.Recipes.create(req.body).then(function (recipe) {
			res.json(recipe.id);
		});
	});

	app.get("/api/products", function (req, res) {
		db.Products.findAll({
			where: req.body
		}).then(function (products) {
			res.json(products);
		});
	});

	app.post("/api/products", function (req, res) {
		db.Products.findOrCreate({
				where: {
					name: req.body.name
				},
				defaults: req.body
			})
			.spread(function (product, created) {
				console.log(created);
				console.log(product.id)
				res.json(product.id)
			}).catch(err => {
				console.log()
			})
	});

	app.post("/api/ingredient/:recipeid/:productid", function (req, res) {
		db.Ingredients.findOrCreate({
				where: {
					RecipeId: req.params.recipeid,
					ProductId: req.params.productid
				},
				defaults: req.body
			})
			.spread((ingr, created) => {
				console.log("Ingredient inserted successfully");
				return;
			}).catch(err => {
				console.log("Failed adding the ingredient ");
				return;
			});
	});

	app.delete("/api/recipes/:id", ensureAuthenticated, function (req, res) {
		db.Recipes.destroy({
			where: {
				id: req.params.id
			}
		}).then(function (recipe) {
			res.json(recipe);
		});
	});

	// app.put("/api/recipes/:id/rating", function (req, res) {
	// 	db.Recipes.findByPk(req.params.id).then(function (dbRecipe) {
	// 		if (dbRecipe === null) {
	// 			res.status(404).send("Not Found");
