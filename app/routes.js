var accountSid = 'AC4ca16f87242e544f9fe6fae576c30136'; // Your Account SID from www.twilio.com/console
var authToken = '75365c938fb824762f77427d46df46f3';   // Your Auth Token from www.twilio.com/console

module.exports = function(app, passport, db, mongodb, client) {
let ObjectId = mongodb.ObjectId

  // normal routes ===============================================================

  app.get("/about", function(req, res) {
    res.render("about.ejs");
  });

  app.get("/login", function(req, res) {
    res.render("login.ejs");
  });

  app.get("/unmenu", function(req, res) {
    res.render("unmenu.ejs");
  });
  app.get("/menu", function(req, res) {
    res.render("menu.ejs");
  });
  app.get("/goldroom", function(req,res){
    res.render("goldroom.ejs");
  });

  // show the home page (will also have our login links)
  app.get("/", function(req, res) {
    res.render("about.ejs");
  });

  app.get("/profile", isLoggedIn, function(req, res) {
    let id=req.user.id
//request info from db
    console.log(req.user)
    db.collection("users")
      .findOne({'_id':ObjectId(id)},function (err,data){
        //show user info in PROFILE
            res.render("profile.ejs", {
              user:req.user,            });
       });
  });

  app.get("/profile-edit", isLoggedIn, function(req, res) {
    let id=req.user.id
//request info from db
    db.collection("users")
      .findOne({'_id':ObjectId(id)},function (err,data){
        //show user info in PROFILE
            res.render("profile-edit.ejs", {
              user:req.user,
            });
       });
  });

  // app.get("/confirmres", function(req, res) {
  //   db.collection('reservations')
  //       .find()
  //       .toArray((err, result) => {
  //         if (err) return console.log(err);
  //         res.render("reserve.ejs", {
  //           user: req.user,
  //           reservations: result
  //         });
  //       })
  // });
  app.get("/confirmres", function(req, res){
    db.collection("reservations")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("confirmres.ejs", {
          user: req.user,
          reservations: result
        });
      })
  })

app.post('/confirmres', (req, res) => {
  db.collection('reservations').save({name: req.body.name}, (err,result) =>{
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/confirmres')
  })
})

  // PROFILE SECTION ========================= function..will only goes thru if prof is logged in
  app.get("/reserve", isLoggedIn, function(req, res) {
    db.collection("reservations")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("reserve.ejs", {
          user: req.user,
          reservations: result
        });
      })
  });

  // LOGOUT ============================== ends sec redirects to home page
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================
  //req body sending form data body parser (breaks down form)
  //post sending information (info in req parameter)
  //form makes post to server sends database, req pulls data

  //sending post Reguest~
  app.post("/messages", (req, res) => {
    db.collection("reservations").save(
      {
        date: req.body.date,
        name: req.body.name,
        email: req.body.email,
        customer: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          zip_code: req.body.zipcode,
        },
        table: {
          floor: req.body.floor,
          number: req.body.number,
          capacity: req.body.capacity
        },
        bottle: {
          type: req.body.type,
          price: req.body.price,
          volume: ""
        },
        waitress: {
          name: req.body.waitress
        }
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/about");
      }
    );
    var inspect = require('util').inspect

    var client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: `Your reservation for ${req.body.capacity} is confirmed on ${req.body.date}
        in ${req.body.floor}.`,
        to: '+16179808534',  // Text this number
        from: '+13399008419' // From a valid Twilio number
    }, function (err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from);
            console.log(responseData.body); // outputs "word to your mother."

        }
    })
  });


  // app.put("/users", (req, res) => {
  //   console.log(req.body)
  //   db.collection("profile-edit").save(
  //     {
  //       name: req.body.name,
  //       email: req.body.email,
  //       address: req.body.address,
  //       city: req.body.city,
  //       state: req.body.state,
  //       zip:req.body.zip,
  //           }
  //       (err, result) => {
  //         if (err) return console.log(err);
  //         console.log("saved to database");
  //         res.redirect("/reserve");
  //         }
  //       );

      app.put('/users', (req, res) => {
        console.log(req.body)
        db.collection('users').findOneAndUpdate({ email: req.body.email },
          {
            $set: {
              name: req.body.name,
              address: req.body.address,
              city: req.body.city,
              state: req.body.state,
              zip:req.body.zip,
            }
          },
          {
            sort: { _id: -1 },
            upsert: true
          },
          (err, result) => {
            if (err) return res.send(err);
            res.redirect('/reserve');
          }
        );
      });


  //trigger req.
  app.put("/messages", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1
        }
      },
      {
        sort: { _id: -1 },
        upsert: true
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/messages", (req, res) => {
    db.collection("messages").findOneAndDelete(
      { name: req.body.name, msg: req.body.msg },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/reserve", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local --------------------------------- undefined by email,psswrd)(morally ethical way to fully delete an account) ->
  //some sites save info by setting boolean to false but ur subject to hacks n being re-targeted with future ads running against u.
  //fb uses machine algorithms to know everything about you target an push ads ,faragade pocket for privacy, blocking all asignals

  app.get("/unlink/local", isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect("/menu");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
}
