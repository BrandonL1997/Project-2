const express = require("express");
const router = express.Router();
const db = require("../models");
const Op = db.Sequelize.Op

router.get("/index", (req, res) => {
    if (req.user) res.redirect("/users/" + req.user.id);
    else res.redirect("/users/login");
});

router.get("/:id", ensureAuthenticated, (req, res) => {
    getUserData(req.user.id, (userData) => {
        if (userData.favorites && userData.favorites.length > 0) {
            userData.recommend = null;
        }

        res.render("users/index", {
            menuItem: userData
        });
    });
});

router.put("/favorite/:MenuItemid", function (req, res) {
    console.log(`userid: ${req.user.id}, MenuItemid: ${req.params.MenuItemid}`);
    db.UserProfile.findOrCreate({
        where: {
            UserId: req.user.id,
            menuItem: req.params.MenuItemid
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
                        menuItem: req.params.MenuItemid
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

router.post("/posted/:MenuItemid", function (req, res, next) {
    if (!req.user) res.end("Unable to identify userId for menu item post");
    console.log(`userid: ${req.user.id}, MenuItemid: ${req.params.MenuItemid}`);

    db.UserProfile.findOrCreate({
        where: {
            UserId: req.user.id,
            menuItem: req.params.MenuItemid
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
                        menuItem: req.params.MenuItemid
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
    const recommend = getRecommendedMenuItem(5);
    const posted = getAllMenuItemsByUser(userId);
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

function getAllMenuItemsByUser(userId) {
    console.log(`Finding all menuItem by userId[${userId}]`);

    return new Promise((resolve, reject) => {
        db.UserProfile.findAll({
            where: {
                UserId: userId,
                posted: true
            }
        }).then(items => {
            if (!items || items.length === 0) resolve(null);
            db.MenuItems.findAll({
                where: {
                    id: {
                        [Op.in]: items.map(menuItem => menuItem.menuItem)
                    }
                }
            }).then(menuItem => {


                resolve(menuItem);
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
            db.MenuItem.findAll({
                where: {
                    id: {
                        [Op.in]: items.map(menuItem => menuItem.menuItemId)
                    }
                }
            }).then(menuItem => {
                menuItem.forEach(menuItem => {
                });

                resolve(menuItem);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

function getMenuItem(num = 5) {
    console.log(`Finding ${num} menuItem`);

    return new Promise((resolve, reject) => {
        db.MenuItem.findAll({
            limit: num
        }).then(menuItem => {
            console.log(`Found ${menuItem.length} menuItem`);
            if (!menuItem || menuItem.length === 0) {
                menuItem = null;
            }

            resolve(MenuItems);
        }).catch(err => reject(err));
    });
}

function getRecommendedMenuItem(num = 5) {
    console.log(`Finding ${num} recommended MenuItems`);

    return new Promise((resolve, reject) => {
        db.UserProfile.findAll({
            attributes: ['menuItem', [db.sequelize.fn('sum', db.sequelize.col('favorite')), 'fav']],
            group: 'menuItem',
            limit: num,
        })
            .then(MenuItems => {
                console.log(`Found ${MenuItems.length} menu item recomendations`);
                if (!MenuItems || MenuItems.length === 0) {
                    MenuItems = null;
                } else {
                    const menuitemIds = MenuItems.sort((a, b) => b.fav - a.fav).map(c => c.menuItem);
                    db.MenuItem.findAll({
                        where: {
                            id: {
                                [Op.in]: menuitemIds
                            }
                        }
                    })
                        .then(MenuItems => {
                            MenuItems.forEach(menuItem => {
                            });
                            resolve(MenuItems);
                        })
                        .catch(err => reject(err));
                }
            })
            .catch(err => reject(err));
    });
}

module.exports = router;