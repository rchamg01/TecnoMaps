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
    user_type: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    username: Sequelize.STRING,
    active: Sequelize.INTEGER
  },
  { sequelize, modelName: "user" }
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
            user_type: "Operario",
            active: 1
          })
            .then(() => {
              sequelize
                .query(
                  "SELECT * FROM users WHERE (username = '" + user + "')",
                  { type: sequelize.QueryTypes.SELECT }
                )
                .then(users => {
                  let token = jwt.sign({ id: users[0].id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
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
        "' ) LIMIT 1",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(users => {
      if (users.length != 0) {
        sequelize.query(
          "UPDATE users SET active = 1 WHERE (username = '" +
            users[0].username +
            "')",
          { type: sequelize.QueryTypes.UPDATE }
        );
        let token = jwt.sign({ id: users[0].id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: users[0] });
      } else {
        return res.status(404).send("No user found.");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("There was a problem on the server.");
    });
});

app.post("/logout", function(req, res) {
  sequelize
    .query(
      "UPDATE users SET active = 0 WHERE (username = '" +
        req.body.username +
        "')",
      {
        type: sequelize.QueryTypes.UPDATE
      }
    )
    .then(layers => {
      res.status(200).send(true);
    });
});

app.post("/getLayers", function(req, res) {
  var idUser = req.body.id;

  if (idUser != undefined) {
    sequelize
      .query(
        "SELECT * FROM layers WHERE (idUser = " + idUser + ") ORDER BY id",
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

app.listen(port, function() {
  console.log("Example app listening on port " + 3000);
});
