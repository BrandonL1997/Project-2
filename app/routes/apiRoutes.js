var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/api/posts", function () {
    console.log(req.body);
    db.Example.create({
      title: req.body.name,
      body: req.body.body,
      category: req.body.category
    })
      .then(function (dbExample) {
        res.json(dbExample);
      });
  });

  app.get("/api/examples/eaten/ :eaten"), function (req, res) {
    db.Example.findAll({
      where: {
        category: req.params.eaten
      }
    })
      .then(function (dbExample) {
        console.log(dbExample);
        res.json(dbExample)
      });
  };

  app.get("/api/posts/:id"), function (req, res) {
    db.Example.findOne({
      where: {
        id: req.params.body
      }
    })
      .then(function (dbExample) {
        res.json(dbExample)
      })

    app.get("/api/posts/:id"), function (req, res) {
      db.Example.update({
        where: {
          id: req.params.body
        }
      })
        .then(function (dbExample) {
          res.json(dbExample);
        });

    };
  };
};

