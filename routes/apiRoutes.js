var multiparty = require("multiparty");
var fs = require("fs");
const ensureAuthenticated = require("./userhelper");
var db = require("../models");
module.exports = function(app) {
  app.get("/api/MenuItem", function(req, res) {
    db.MenuItem.findAll({
      where: req.body
    }).then(function(MenuItem) {
      res.json(MenuItem);
    });
  });

  app.get("/api/MenuItem/:id", function(req, res) {
    db.MenuItem.findByPk(req.params.id).then(function(dbmenuItem) {
      if (dbmenuItem === null) {
        res.status(404).send("Not Found");
      }

      dbmenuItem.getProducts().then(function(products) {
        var response = {
          MenuItem: dbmenuItem,
          products: products
        };

        dbmenuItem.image = dbmenuItem.image.toString("base64");
        res.json(response);
      });
    });
  });

  app.post("/api/MenuItem", function(req, res) {
    db.MenuItem.create(req.body).then(function(MenuItem) {
      res.json(MenuItem.id);
    });
  });

  app.get("/api/products", function(req, res) {
    db.Products.findAll({
      where: req.body
    }).then(function(products) {
      res.json(products);
    });
  });

  app.post("/api/products", function(req, res) {
    db.Products.findOrCreate({
      where: {
        name: req.body.name
      },
      defaults: req.body
    })
      .spread(function(product, created) {
        console.log(created);
        console.log(product.id);
        res.json(product.id);
      })
      .catch(err => {
        console.log();
      });
  });

  app.post("/api/ingredient/:menuItemId/:productid", function(req, res) {
    db.Ingredients.findOrCreate({
      where: {
        MenuItemId: req.params.menuItemId,
        ProductId: req.params.productid
      },
      defaults: req.body
    })
      .spread((ingr, created) => {
        console.log("Ingredient inserted successfully");
        return;
      })
      .catch(err => {
        console.log("Failed adding the ingredient ");
        return;
      });
  });

  app.delete("/api/MenuItem/:id", ensureAuthenticated, function(req, res) {
    db.MenuItem.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(MenuItem) {
      res.json(MenuItem);
    });
  });

  app.put("/api/MenuItem/:id/rating", function(req, res) {
    db.MenuItem.findByPk(req.params.id).then(function(dbMenuItem) {
      if (dbMenuItem === null) {
        res.status(404).send("Not Found");
      }
    });
  });
};
