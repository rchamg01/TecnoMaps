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
const httpPort = 80;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize("tecnomaps", "root", "1236", {
  host: "localhost",
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

app.listen(port, function() {
  console.log("Example app listening on port " + 3000);
});
