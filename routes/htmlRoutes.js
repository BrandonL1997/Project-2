var db = require("../models");
const ensureAuthenticated = require("./userhelper");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.MenuItem.findAll({
      //   order: [["rating", "DESC"]],
      limit: 6
    }).then(function(menuItem) {
      console.log(JSON.stringify(menuItem));
      res.status(200).render("index", {
        msg: "Welcome!!"
        // menuItem: menuItem.map(menuItem => fixMenuItemImage(menuItem))
      });
    });
  });

  app.get("/menuItem/:id", function(req, res) {
    db.menuItem.findByPk(req.params.id).then(function(menuItem) {
      if (menuItem === null) {
        res.status(404).send("Not Found");
        return;
      }

      menuItem.getProducts().then(function(products) {
        if (menuItem) {
          menuItem.imageSrc = menuItem.image
            ? `data:image/jpeg;base64, ${menuItem.image.toString("base64")}`
            : menuItem.imageURL;
          menuItem.image = null;
          menuItem.imageURL = null;

          var total = 0;
          products.forEach(product => {
            total += product.calories * product.Ingredients.amount;
          });
          res.render("menuItem", {
            menuItem: menuItem,
            products: products,
            totalCalories: total
          });
        } else {
          res.render("404");
        }
      });
    });
  });

  app.get("/post", function(req, res) {
    res.render("post");
  });

  app.get("/search", function(req, res) {
    res.render("search");
  });

  app.post("/search", function(req, res) {
    res.render("search", req.body);
  });

  app.get("*", function(req, res) {
    res.render("404");
  });
};
