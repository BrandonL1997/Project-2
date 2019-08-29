const express = require("express");
const router = express.Router();
const db = require("../models");
const Op = db.Sequelize.Op
const fixMenuItemImage = require("./menuitemimage");



router.get("/index", (req, res) => {
	if (req.user) res.redirect("/users/" + req.user.id);
	else res.redirect("/users/login");
});

router.get("/:id", ensureAuthenticated, (req, res) => {
	getUserData(req.user.id, (userData) => {
		// Do not show recommendation if user has favorites
		if (userData.favorites && userData.favorites.length > 0) {
			userData.recommend = null;
		}

		res.render("users/index", {
			menuitem: userData
		});
	});
});

router.put("/favorite/:recipeId", function (req, res) {
	console.log(`userid: ${req.user.id}, recipeid: ${req.params.recipeId}`);
	db.UserProfile.findOrCreate({
		where: {
			UserId: req.user.id,
			RecipeId: req.params.recipeId
		},
		defaults: {
			favorite: true,
		}
	}).spread((userInfo, created) => {
		if (created) {
			req.flash("success_msg", "The menu item has been added to favorites.");
		} else {
			db.UserProfile.update({
				favorite: true
			}, {
				where: {
					UserId: req.user.id,
					RecipeId: req.params.recipeId
				},
			}).then(userInfo => {
				req.flash("success_msg", "The menu item has been marked as favorite.");
				res.json(userInfo);
				return;
			}).catch(err => {
				req.flash("error_msg", "Unable to mark the menu item as favorite.");
				res.json(err);
				return;
			});
			req.flash("success_msg", "The menu item has been marked as favorite.");
			res.json(userInfo);
		}
		console.log('favorite set ok');
		return;
	}).catch(err => {
		console.log(err)
		req.flash("error_msg", "Failed to add. User and/or menu item not found.");
		res.json(err);
		return;
	});
});

router.post("/posted/:recipeId", function (req, res, next) {
	if (!req.user) res.end("Unable to identify userId for menu item post");
	console.log(`userid: ${req.user.id}, recipeid: ${req.params.recipeId}`);

	db.UserProfile.findOrCreate({
		where: {
			UserId: req.user.id,
			RecipeId: req.params.recipeId
		},
		defaults: {
			posted: true,
		}
	}).spread((userInfo, created) => {
		if (created) {
			req.flash("success_msg", "The menu item has been posted.");
			return;
		} else {
			db.UserProfile.update({
				posted: true
			}, {
				where: {
					UserId: req.user.id,
					RecipeId: req.params.recipeId
				},
			}).then(userInfo => {
				req.flash("success_msg", "The menu item has been marked as posted.");
				return;
			}).catch(err => {
				req.flash("error_msg", "Unable to mark the menu item as posted.");
				return;
			});
		}
	}).catch(err => {
		console.log(err)
		req.flash("error_msg", "Failed to add. User and/or menu item not found.");
		return;
	});
});

async function getUserData(userId, cbackFunc) {
	const recommend = getRecommendedRecipes(5);
	const posted = getAllRecipesByUser(userId);
	const favorites = getAllUserFavorites(userId);
	const userData = {
		recommend: await recommend,
		posted: await posted,
		favorites: await favorites
	};

	cbackFunc(userData);
}

function userInfoById(userId) {
	return new Promise((resolve, reject) => {
		db.User.findByPk(userId)
			.then(user => {
				console.log(`Found user info for [${userId}] ${user}`);
				resolve(user);
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getAllRecipesByUser(userId) {
	console.log(`Finding all menuitem by userId[${userId}]`);

	return new Promise((resolve, reject) => {
		db.UserProfile.findAll({
			where: {
				UserId: userId,
				posted: true
			}
		}).then(items => {
			if (!items || items.length === 0) resolve(null);
			db.Recipes.findAll({
				where: {
					id: {
						[Op.in]: items.map(menuitem => menuitem.RecipeId)
					}
				}
			}).then(menuitem => {
				menuitem.forEach(menuitem => {
					fixMenuItemImage(menuitem);
				});

				resolve(menuitem);
			}).catch(err => reject(err));
		}).catch(err => reject(err));
	});
}

function getAllUserFavorites(userId) {
	console.log(`Finding all favorite menu item of userId[${userId}]`);

	return new Promise((resolve, reject) => {
		db.UserProfile.findAll({
			where: {
				UserId: userId,
				favorite: true
			}
		}).then(items => {
			if (!items || items.length === 0) resolve(null);
			db.Recipes.findAll({
				where: {
					id: {
						[Op.in]: items.map(menuitem => menuitem.RecipeId)
					}
				}
			}).then(menuitem => {
				menuitem.forEach(menuitem => {
					fixRecipeImage(menuitem);
				});

				resolve(menuitem);
			}).catch(err => reject(err));
		}).catch(err => reject(err));
	});
}

function getRecipes(num = 5) {
	console.log(`Finding ${num} menuitem`);

	return new Promise((resolve, reject) => {
		db.Recipes.findAll({
			limit: num
		}).then(menuitem => {
			console.log(`Found ${menuitem.length} menuitem`);
			if (!menuitem || menuitem.length === 0) {
				menuitem = null;
			} else {
				menuitem.forEach(menuitem => {
					fixRecipeImage(menuitem);
				});
			}

			resolve(recipes);
		}).catch(err => reject(err));
	});
}

function getRecommendedRecipes(num = 5) {
	console.log(`Finding ${num} recommended recipes`);

	return new Promise((resolve, reject) => {
		db.UserProfile.findAll({
				attributes: ['RecipeId', [db.sequelize.fn('sum', db.sequelize.col('favorite')), 'fav']],
				group: 'RecipeId',
				// order: 'fav DESC',
				limit: num,
			})
			.then(recipes => {
				console.log(`Found ${recipes.length} menu item recomendations`);
				if (!recipes || recipes.length === 0) {
					recipes = null;
				} else {
					const recipeIds = recipes.sort((a, b) => b.fav - a.fav).map(c => c.RecipeId);
					db.Recipes.findAll({
							where: {
								id: {
									[Op.in]: recipeIds
								}
							}
						})
						.then(recipes => {
							recipes.forEach(menuitem => {
								fixRecipeImage(menuitem);
							});
							resolve(recipes);
						})
						.catch(err => reject(err));
				}
			})
			.catch(err => reject(err));
	});
}

module.exports = router;