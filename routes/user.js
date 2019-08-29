const express = require("express");
const db = require("../models");
const router = express.Router();
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out now");
    res.redirect("/");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/users/index",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res, next) => {
    let errors = [];

    if (validatePassword(req, errors)) {

        db.User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
                if (user) {
                    req.flash("error_msg", "A user with the same email address already exists");
                } else {
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    };

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            newUser.password = hash;
                            db.User.create(newUser)
                                .then(user => {
                                    req.flash("success_msg", "You are registered successfully");

                                    req.login(user, err => {
                                        return next(err);
                                    });
                                    res.redirect("/users/" + user.id);
                                })
                                .catch(error => {
                                    req.flash("error_msg", "Unable to register: " + error);
                                    return;
                                });
                        });
                    });
                }
            });
    } else {

        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }
});
function validatePassword(req, errors) {
    if (req.body.password !== req.body.password2) {
        errors.push({
            text: "Passwords do not match"
        });
    }


    if (req.body.password.length < 8) {
        errors.push({
            text: "Passwords must be at least 8 characters long"
        });
    }

    return (errors.length === 0);
}

module.exports = router;