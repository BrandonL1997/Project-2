var multiparty = require("multiparty");
var fs = require("fs");
const Op = db.Sequelize.Op
const ensureAuthenticated = require("./usersAuthHelper");


module.exports = function (app) {

	app.get("/api/menuitem", function (req, res) {
		db.MenuItem.findAll({
			where: req.body
		}).then(function (menuitem) {
			res.json(menuitem);
		});
	});

	app.get("/api/menuitem/:id", function (req, res) {
		db.MenuItem.findByPk(req.params.id).then(function (dbMenuItem) {
			if (dbMenuItem === null) {
				res.status(404).send("Not Found");
			}

			dbMenuItem.getProducts().then(function (products) {
				var response = {
					recipe: dbMenuItem,
					products: products
				};

				dbMenuItem.image = dbMenuItem.image.toString("base64");
				res.json(response);
			});
		});
	});

	app.post("/api/menuitem", function (req, res) {
		db.MenuItem.create(req.body).then(function (recipe) {
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

	app.post("/api/ingredient/:menuItem/:productid", function (req, res) {
		db.Ingredients.findOrCreate({
				where: {
					MenuItem: req.params.menuItem,
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

	app.delete("/api/menuitem/:id", ensureAuthenticated, function (req, res) {
		db.MenuItem.destroy({
			where: {
				id: req.params.id
			}
		}).then(function (recipe) {
			res.json(recipe);
		});
	});

	app.put("/api/menuitem/:id/rating", function (req, res) {
		db.MenuItem.findByPk(req.params.id).then(function (dbMenuItem) {
			if (dbMenuItem === null) {
				res.status(404).send("Not Found");
