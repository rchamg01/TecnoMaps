const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const Sequelize = require("sequelize");
var cors = require("cors");
const http = require("http");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");
const tunnel = require("tunnel-ssh");
const httpPort = 80;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize("tecnomaps", "practicas", "Qwerty.1234", {
  host: "localhost",
  port: "3305",
  dialect: "mysql",
  define: {
    timestamps: false
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

class User extends Sequelize.Model {}
User.init(
  {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    username: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    organization: Sequelize.STRING,
    address: Sequelize.STRING,
    city: Sequelize.STRING,
    phone_number: Sequelize.INTEGER,
    profile_photo: Sequelize.STRING,
    privacity: Sequelize.STRING,
    active: Sequelize.INTEGER,
    deleted: Sequelize.INTEGER,
    idType: Sequelize.INTEGER
  },
  { sequelize, modelName: "user" }
);

class User_type extends Sequelize.Model {}
User_type.init(
  {
    type_name: Sequelize.STRING
  },
  { sequelize, modelName: "user_type" }
);

class Actions extends Sequelize.Model {}
Actions.init(
  {
    registered: Sequelize.TIME,
    lastLogin: Sequelize.TIME,
    lastLogout: Sequelize.TIME,
    idUser: Sequelize.INTEGER
  },
  { sequelize, modelName: "actions" }
);

class Layer extends Sequelize.Model {}
Layer.init(
  {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    layerName: Sequelize.STRING,
    url: Sequelize.STRING,
    opacity: Sequelize.INTEGER,
    visible: Sequelize.INTEGER,
    deleted: Sequelize.INTEGER,
    idUser: Sequelize.INTEGER
  },
  { sequelize, modelName: "layer" }
);

sequelize.sync();

http
  .createServer((req, res) => {
    fs.readFile("index.htm", "utf-8", (err, content) => {
      if (err) {
        console.log('We cannot open "index.htm" file.');
      }

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });

      res.end(content);
    });
  })
  .listen(httpPort, () => {
    console.log("Server listening on: http://localhost:%s", httpPort);
  });

app.post("/register", function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var mail = req.body.email;

  sequelize
    .query(
      "SELECT username FROM users WHERE (username = '" + user + "') LIMIT 1",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(users => {
      if (users.length != 0) {
        //Si ya existe
        return res.status(404).send("The user already exists");
      } else {
        //Si no existe, se crea
        sequelize.sync().then(() =>
          User.create({
            username: user,
            password: pass,
            email: mail,
            firstname: firstname,
            lastname: lastname,
            active: 1,
            idType: 2
          })
            .then(() => {
              sequelize
                .query(
                  "SELECT * FROM users WHERE (username = '" + user + "')",
                  { type: sequelize.QueryTypes.SELECT }
                )
                .then(users => {
                  var id = users[0].id;
                  let token = jwt.sign({ id: id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                  });
                  sequelize
                    .sync()
                    .then(() => {
                      Actions.create({
                        registered: new Date()
                          .toISOString()
                          .slice(0, 19)
                          .replace("T", " "),
                        lastLogin: new Date()
                          .toISOString()
                          .slice(0, 19)
                          .replace("T", " "),
                        idUser: id
                      }).catch(err => {
                        console.log(err);
                        return res
                          .status(500)
                          .send("There was a problem registering the user.");
                      });
                      res
                        .status(200)
                        .send({ auth: true, token: token, user: users[0] });
                    })
                    .catch(err => {
                      console.log(err);
                      return res
                        .status(500)
                        .send("There was a problem getting user");
                    });
                })
                .catch(err => {
                  console.log(err);
                  return res
                    .status(500)
                    .send("There was a problem getting user");
                });
            })
            .catch(err => {
              console.log(err);
              return res
                .status(500)
                .send("There was a problem registering the user.");
            })
        );
      }
    });
});

app.post("/login", function(req, res) {
  sequelize
    .query(
      "SELECT * FROM users WHERE (username = '" +
        req.body.username +
        "' AND password = '" +
        req.body.password +
        "' AND deleted = '0') LIMIT 1",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(users => {
      if (users.length != 0) {
        sequelize
          .query(
            "UPDATE users SET active = 1 WHERE (username = '" +
              users[0].username +
              "')",
            { type: sequelize.QueryTypes.UPDATE }
          )
          .then(() => {
            var user = users[0];
            var id = users[0].id;
            let token = jwt.sign({ id: id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
            sequelize.query(
              "UPDATE actions SET lastLogin = '" +
                new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ") +
                "' WHERE (idUser = " +
                id +
                ")",
              { type: sequelize.QueryTypes.UPDATE }
            );
            res.status(200).send({ auth: true, token: token, user: user });
          });
      } else {
        return res.status(404).send({ message: "No user found." });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/logout", function(req, res) {
  sequelize
    .query("UPDATE users SET active = 0 WHERE (id = '" + req.body.id + "')", {
      type: sequelize.QueryTypes.UPDATE
    })
    .then(() => {
      sequelize.query(
        "UPDATE actions SET lastLogout = '" +
          new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ") +
          "' WHERE (idUser = '" +
          req.body.id +
          "')",
        { type: sequelize.QueryTypes.UPDATE }
      );
      res.status(200).send({ logout: true });
    });
});

app.post("/getLayers", function(req, res) {
  var idUser = req.body.id;

  if (idUser != undefined) {
    sequelize
      .query(
        "SELECT * FROM layers WHERE (idUser = " +
          idUser +
          ") and (deleted = '0') ORDER BY id",
        {
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(layers => {
        res.status(200).send({ layers: layers });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send("There was a problem on the server.");
      });
  }
});

app.post("/registerLayer", function(req, res) {
  sequelize.sync().then(() =>
    Layer.create({
      name: req.body.name,
      description: req.body.desc,
      layerName: req.body.layerName,
      url: req.body.url,
      opacity: req.body.opacity,
      visible: req.body.visible,
      idUser: req.body.idUser
    })
      .then(() => {
        res.status(200).send(true);
      })
      .catch(err => {
        console.log(err);
        return res
          .status(500)
          .send("There was a problem registering the layer");
      })
  );
});

app.post("/updateLayer", function(req, res) {
  var name = req.body.name;
  var description = req.body.desc;
  var opacity = req.body.opacity;
  var visible = req.body.visible;
  var idUser = req.body.idUser;
  var id = req.body.id;
  sequelize
    .query(
      "UPDATE layers SET name = '" +
        name +
        "', description = '" +
        description +
        "', opacity = '" +
        opacity +
        "', visible = '" +
        visible +
        "' WHERE (idUser = " +
        idUser +
        ") AND (id = " +
        id +
        ")",
      { type: sequelize.QueryTypes.UPDATE }
    )
    .then(layers => {
      res.status(200).send({ layers: layers });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/deleteLayer", function(req, res) {
  var idUser = req.body.idUser;
  var id = req.body.id;
  sequelize
    .query(
      "UPDATE layers SET deleted = 1  WHERE (idUser = " +
        idUser +
        ") AND (id = " +
        id +
        ")",
      { type: sequelize.QueryTypes.UPDATE }
    )
    .then(layers => {
      res.status(200).send({ layer: layers });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.get("/getUsers", function(req, res) {
  sequelize
    .query("SELECT * FROM users WHERE deleted = '0'", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(users => {
      res.status(200).send({ users: users });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/updateUser", function(req, res) {
  var idUser = req.body.id;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var pass = req.body.pass;
  var phone = req.body.phone;
  var address = req.body.address;
  var city = req.body.city;
  var organization = req.body.organization;

  sequelize
    .query(
      "UPDATE users SET firstName = '" +
        firstName +
        "', lastName = '" +
        lastName +
        "', password = '" +
        pass +
        "', phone_number = '" +
        phone +
        "', address = '" +
        address +
        "', city = '" +
        city +
        "', organization = '" +
        organization +
        "' WHERE (id = " +
        idUser +
        ")",
      { type: sequelize.QueryTypes.UPDATE }
    )
    .then(() => {
      sequelize
        .query("SELECT * FROM users WHERE (id = " + idUser + ")", {
          type: sequelize.QueryTypes.SELECT
        })
        .then(user => {
          res.status(200).send({ user: user[0] });
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send("There was a problem on the server.");
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/getUser_Type", function(req, res) {
  var idType = req.body.data;
  sequelize
    .query("SELECT * FROM user_types WHERE (id = " + idType + ")", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(type => {
      res.status(200).send({ user_type: type[0] });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.get("/getAllUser_Types", function(req, res) {
  sequelize
    .query("SELECT * FROM user_types", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(types => {
      res.status(200).send({ user_types: types });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/deleteUser", function(req, res) {
  var id = req.body.id;
  sequelize
    .query("UPDATE users SET deleted = 1  WHERE (id = " + id + ")", {
      type: sequelize.QueryTypes.UPDATE
    })
    .then(users => {
      res.status(200).send({ users: users });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.listen(port, function() {
  console.log("Example app listening on port " + 3000);
});
