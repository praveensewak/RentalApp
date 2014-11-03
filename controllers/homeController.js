(function (homeController) {

  var data = require("../data");
  var auth = require("../auth");
    var hasher = require("../auth/hasher");

  homeController.init = function (app) {

      function userVerify(email, password, next) {
          data.getUser(email, function (err, user) {
              if (!err && user) {
              //    var testHash = hasher.computeHash(password, user.salt);
                  if (password === user.passwordHash) {
                      next(null, user);
                      return;
                  }
              }
              next(null, false, { message: "Invalid Credentials." });
          });
      }
      // main login page //

      app.get('/', function(req, res){
          // check if the user's credentials are saved in a cookie //
          if (req.cookies.email == undefined || req.cookies.password == undefined||!req.session.user){
              res.render('login', { title: 'Hello - Please Login To Your Account' });
          }	else{
              // attempt automatic login //
              userVerify(req.cookies.email, req.cookies.password, function (e, o) {
                  if (!o) {
                      res.send(e, 400);
                  } else {

                          req.logIn(o, function (err) {
                              if (err) {
                                  next(err);
                              } else {
                                  res.redirect('/home');
                                  //res.setHeader('Content-Type', 'application/json');
                                 // res.send(200, JSON.stringify({registration_status: o.registration_status, registration_token: o.registration_token, user_type: o.user_type }));
                              }
                          });

                  }
              });
          }
      });





/*    app.get("/", function (req, res) {
      data.getNoteCategories(function (err, results) {

        res.render("index", { 
          title: "Home", 
          error: err, 
          categories: results,
          newCatError: req.flash("newCatName"),
          user: req.user
        });       
      });
    });*/

    // app.get("/notes/:categoryName", 
    //   auth.ensureAuthenticated, 
    //   function (req, res) {
    //     var categoryName = req.params.categoryName;
    //     res.render("notes", { title: categoryName, user: req.user });
    //   });

    // app.post("/newCategory", function (req, res) {
    //   var categoryName = req.body.categoryName;
    //   data.createNewCategory(categoryName, function (err) {
    //     if (err) {
    //       // Handle Error
    //       console.log(err);
    //       req.flash("newCatName", err);
    //       res.redirect("/");
    //     } else {
    //       res.redirect("/notes/" + categoryName);
    //     }
    //   });
    // });

  };

})(module.exports);