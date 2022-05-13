"use strict";
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require("jsdom");
const mysql = require("mysql");
const { response } = require("express");
const req = require("express/lib/request");
const { ReadableStreamBYOBRequest } = require("stream/web");

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./app/html"));
app.use("/media", express.static("./public/media"));

var admin = false;

app.use(
  session({
    secret: "secrets",
    name: "candysession",
    resave: false,
    // create a unique identifier
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    if (admin === false) {
      res.redirect("/home");
    } else {
      admin === true;
      res.redirect("/admin");
    }
  } else {
    let doc = fs.readFileSync("./app/index.html", "utf8");
    res.send(doc);
  }
});

app.get("/home", async (req, res) => {
  if (req.session.loggedIn && admin === false) {
    let profile = fs.readFileSync("./app/home.html", "utf-8");
    let profileDOM = new JSDOM(profile);

    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    });
    connection.connect;

    profileDOM.window.document.getElementById("first_name").innerHTML =
      "Pleased to see you, " + req.session.fname;

    connection.end();

    res.set("Server", "candy");
    res.set("X-Powered-By", "candy");
    res.send(profileDOM.serialize());
  } else {
    res.redirect("/");
  }
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/admin", async (req, res) => {
  if (req.session.loggedIn && admin === true) {
    let profile = fs.readFileSync("./app/admin.html", "utf-8");
    let profileDOM = new JSDOM(profile);

    res.set("Server", "candy");
    res.set("X-Powered-By", "candy");
    res.send(profileDOM.serialize());
  } else {
    res.redirect("/");
  }
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/login", async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
  });
  connection.connect();
  const [rows, fields] = await connection.execute(
    `SELECT * FROM BBY_13_mm_users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`
  );

  if (rows.length > 0) {
    req.session.loggedIn = true;
    req.session.username = rows[0].username;
    req.session.password = rows[0].password;
    req.session.idnum = rows[0].ID_NUMBER;
    req.session.fname = rows[0].firstname;
    req.session.lname = rows[0].lastname;
    req.session.email = rows[0].email;
    req.session.admin = rows[0].administrator;

    req.session.save(function (err) {});

    connection.end();

    res.send({
      status: "success",
      msg: "Logged in.",
    });

    if (req.session.admin == "y") {
      admin = true;
    } else {
      admin = false;
    }
  } else {
    res.send({
      status: "fail",
      msg: "User account not found.",
    });
  }
});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out");
      } else {
        admin = false;
        let doc = fs.readFileSync("./app/index.html", "utf8");
        res.send(doc);
      }
    });
  }
});

//ALL PAGE REDIRECTS GO HERE
app.get("/admin-dash", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/admin-dash.html", "utf8");
    res.send(doc);
  }
});

app.post("/user-info", async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  req.session.user_edit = `${req.body.user_edit}`;

  req.session.save(function (err) {});

  res.send({
    msg: "data in.",
  });
});

app.post("/delete-user", async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
    multipleStatements: true,
  });
  connection.connect();

  const [rows, fields] = await connection.execute(
    `SELECT * FROM BBY_13_mm_users`
  );

  req.session.to_delete = `${req.body.to_delete}`;

  req.session.save(function (err) {});

  let sql = `DELETE FROM BBY_13_mm_users WHERE username=?`;
  connection.query(sql, req.session.to_delete, function (err, result) {
    if (err) throw err;
  });

  connection.end();

  res.send({
    msg: "data in.",
  });
});

app.get("/user-profiles", function (req, res) {
  if (req.session) {
    let profile = fs.readFileSync("./app/user-profiles.html", "utf8");
    let profileDOM = new JSDOM(profile);

    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    });
    connection.connect();

    connection.query(
      "SELECT * FROM BBY_13_mm_users",
      function (error, userresults, fields) {
        if (error) {
          console.log(error);
        }

        const allUsers = profileDOM.window.document.createElement("table");

        let users;

        allUsers.innerHTML =
          "<tr>" +
          "<th>" +
          "ID" +
          "</th>" +
          "<th>" +
          "Username" +
          "</th>" +
          "<th>" +
          "First Name" +
          "</th>" +
          "<th>" +
          "Last Name" +
          "</th>" +
          "<th>" +
          "E-mail" +
          "</th>" +
          "<th>" +
          "Administrator" +
          "</th>" +
          "<th>" +
          "Edit User";
        "</th>" + "</tr>";
        for (let i = 0; i < userresults.length; i++) {
          users =
            "<td>" +
            userresults[i].ID_NUMBER +
            "</td>" +
            "<td>" +
            userresults[i].username +
            "</td>" +
            "<td>" +
            userresults[i].firstname +
            "</td>" +
            "<td>" +
            userresults[i].lastname +
            "</td>" +
            "<td>" +
            userresults[i].email +
            "</td>" +
            "<td>" +
            userresults[i].administrator +
            "</td>" +
            "<td><a href='/edit-by-admin'><button class='edit' id=" +
            userresults[i].username +
            " onclick='info_change(this.id) '> Edit </button></a></td>" +
            "<td><button class='delete' id=" +
            userresults[i].username +
            " onclick='delete_user(this.id); confirmDelete();'> Delete </button></td>";
          allUsers.innerHTML += users;
        }

        profileDOM.window.document
          .getElementById("user_table")
          .appendChild(allUsers);
        connection.end();

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profileDOM.serialize());
      }
    );
  }
});

app.get("/edit-by-admin", function (req, res) {
  if (req.session) {
    let prof = fs.readFileSync("./app/edit-by-admin.html", "utf8");
    let profDOM = new JSDOM(prof);

    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    });
    connection.connect();

    connection.query(
      // `SELECT * FROM BBY_13_mm_users WHERE username ="${req.session.user_edit}"`,
      `SELECT * FROM BBY_13_mm_users WHERE username="${req.session.user_edit}"`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }

        for (let i = 0; i < results.length; i++) {
          if (req.session.user_edit == results[i].username) {
            let firstname =
              profDOM.window.document.getElementById("first_name");
            let fName =
              "<input type=text id=fname value=" + results[i].firstname + ">";
            firstname.innerHTML += fName;

            const lastname =
              profDOM.window.document.getElementById("last_name");
            let lName =
              "<input type=text id=lname value=" + results[i].lastname + ">";
            lastname.innerHTML += lName;

            const email = profDOM.window.document.getElementById("mail");
            let mail =
              "<input type=text id=email value=" + results[i].email + ">";
            email.innerHTML += mail;

            const pwd = profDOM.window.document.getElementById("pwd");
            let password =
              "<input type=text id=password value=" + results[i].password + ">";
            pwd.innerHTML += password;
          }
        }
        connection.end();
        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profDOM.serialize());
      }
    );
  }
});

app.get("/home", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/home.html", "utf8");
    res.send(doc);
  }
});

app.get("/profile", function (req, res) {
  if (req.session) {
    let prof = fs.readFileSync("./app/profile.html", "utf8");
    let profDOM = new JSDOM(prof);

    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    });
    connection.connect();

    connection.query(
      `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }

        const thisAD = profDOM.window.document.getElementById("Id_num");
        let id =
          "<input type=text id=ID disabled value=" + req.session.idnum + ">";
        thisAD.innerHTML += id;

        const thisUserName =
          profDOM.window.document.getElementById("user_name");
        let uName =
          "<input type=text id=username disabled value=" +
          req.session.username +
          ">";
        thisUserName.innerHTML += uName;

        const thisFName = profDOM.window.document.getElementById("first_name");
        let fName =
          "<input type=text id=fname value=" + req.session.fname + ">";
        thisFName.innerHTML += fName;

        const thisLName = profDOM.window.document.getElementById("last_name");
        let lName =
          "<input type=text id=lname value=" + req.session.lname + ">";
        thisLName.innerHTML += lName;

        const thisMail = profDOM.window.document.getElementById("mail");
        let mail =
          "<input type=email id=email value=" + req.session.email + ">";
        thisMail.innerHTML += mail;

        const thisPWD = profDOM.window.document.getElementById("pwd");
        let pwd =
          "<input type=password id=password value=" +
          req.session.password +
          ">";
        thisPWD.innerHTML += pwd;

        connection.end();

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profDOM.serialize());
      }
    );
  }
});

app.get("/profile-admin", function (req, res) {
  if (req.session) {
    let prof = fs.readFileSync("./app/profile-admin.html", "utf8");
    let profDOM = new JSDOM(prof);

    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    });
    connection.connect();

    connection.query(
      `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }

        const thisAD = profDOM.window.document.getElementById("Id_num");
        let id =
          "<input type=text id=ID disabled value=" + req.session.idnum + ">";
        thisAD.innerHTML += id;

        const thisUserName =
          profDOM.window.document.getElementById("user_name");
        let uName =
          "<input type=text id=username disabled value=" +
          req.session.username +
          ">";
        thisUserName.innerHTML += uName;

        const thisFName = profDOM.window.document.getElementById("first_name");
        let fName =
          "<input type=text id=fname value=" + req.session.fname + ">";
        thisFName.innerHTML += fName;

        const thisLName = profDOM.window.document.getElementById("last_name");
        let lName =
          "<input type=text id=lname value=" + req.session.lname + ">";
        thisLName.innerHTML += lName;

        const thisMail = profDOM.window.document.getElementById("mail");
        let mail =
          "<input type=email id=email value=" + req.session.email + ">";
        thisMail.innerHTML += mail;

        const thisPWD = profDOM.window.document.getElementById("pwd");
        let pwd =
          "<input type=password id=password value=" +
          req.session.password +
          ">";
        thisPWD.innerHTML += pwd;

        connection.end();

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profDOM.serialize());
      }
    );
  }
});

app.get("/admin", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/admin.html", "utf8");
    res.send(doc);
  }
});

app.get("/paint", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/paint.html", "utf8");
    res.send(doc);
  }
});

app.get("/new_acc", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/new_acc.html", "utf8");
    res.send(doc);
  }
});

app.post("/add-new-user", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  console.log("user name: ", req.body.username);
  console.log("first name: ", req.body.first);
  console.log("last name: ", req.body.last);
  console.log("email: ", req.body.email);

  const connection = mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
  });

  connection.connect();

  connection.query(
    "INSERT INTO BBY_13_mm_users (username, firstname, lastname, email, administrator, delete_user, password) values (?, ?, ?, ?, 'n', 'n', ?)",
    [
      req.body.username,
      req.body.first,
      req.body.last,
      req.body.email,
      req.body.password,
    ]
  );
  connection.end();
});

app.get("/new_admin", function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/new_admin.html", "utf8");
    res.send(doc);
  }
});

app.post("/add-new-admin", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  console.log("user name: ", req.body.usernameA);
  console.log("first name: ", req.body.firstA);
  console.log("last name: ", req.body.lastA);
  console.log("email: ", req.body.emailA);

  const connection = mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
  });

  connection.connect();

  connection.query(
    "INSERT INTO BBY_13_mm_users (username, firstname, lastname, email, administrator, delete_user, password) values (?, ?, ?, ?, 'y', 'n', ?)",
    [
      req.body.usernameA,
      req.body.firstA,
      req.body.lastA,
      req.body.emailA,
      req.body.passwordA,
    ]
  );
  connection.end();
});

//ALL PAGE REDIRECTS END HERE

app.get("/profile", function (req, res) {
  if (req.session) {
    let profile = fs.readFileSync("./app/profile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    res.set("Server", "candy");
    res.set("X-Powered-By", "candy");
    res.send(profileDOM.serialize());
  }
});

app.get("/change_pw", async function (req, res) {
  if (req.session) {
    let doc = fs.readFileSync("./app/change_pw.html", "utf8");
    let profileDOM = new JSDOM(doc);

    res.set("Server", "candy");
    res.set("X-Powered-By", "candy");
    res.send(profileDOM.serialize());
  }
});

app.post("/new_info", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
    multipleStatements: true,
  });
  connection.connect();

  const [rows, fields] = await connection.execute(
    `SELECT * FROM BBY_13_mm_users`
  );

  if (rows.length > 0) {
    req.session.fname = `${req.body.new_fname}`;
    req.session.lname = `${req.body.new_lname}`;
    req.session.email = `${req.body.new_email}`;
    req.session.password = `${req.body.new_password}`;
  }

  let sql = `UPDATE BBY_13_mm_users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE username = '${req.session.username}'`;
  connection.query(sql, [
    req.session.fname,
    req.session.lname,
    req.session.email,
    req.session.password,
  ]);

  connection.end();
});

app.post("/new_info_admin", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "z596t5v95ron6fzg",
      password: "lh6fsygbhuhgi3i7",
      database: "rz2y3uh9vljkf5dz",
    multipleStatements: true,
  });
  connection.connect();

  const [rows, fields] = await connection.execute(
    `SELECT * FROM BBY_13_mm_users`
  );

  if (rows.length > 0) {
    req.session.fname = `${req.body.new_fname}`;
    req.session.lname = `${req.body.new_lname}`;
    req.session.email = `${req.body.new_email}`;
    req.session.password = `${req.body.new_password}`;
  }

  let sql = `UPDATE BBY_13_mm_users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE username = '${req.session.user_edit}'`;
  connection.query(sql, [
    req.session.fname,
    req.session.lname,
    req.session.email,
    req.session.password,
  ]);

  connection.end();
});

async function init() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
    multipleStatements: true,
  });

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS rz2y3uh9vljkf5dz;
                            use rz2y3uh9vljkf5dz;
                            CREATE TABLE IF NOT EXISTS BBY_13_mm_users (
                                ID_NUMBER int NOT NULL AUTO_INCREMENT,
                                username VARCHAR(50),
                                firstname VARCHAR(50),
                                lastname VARCHAR(50),
                                email VARCHAR(50),
                                administrator VARCHAR(1),
                                delete_user VARCHAR(1),
                                password VARCHAR(50),
                                PRIMARY KEY (ID_NUMBER));`;

  await connection.query(createDBAndTables);

  const [userRows, userFields] = await connection.query(
    "SELECT * FROM BBY_13_mm_users"
  );

  if (userRows.length == 0) {
    let userRecord =
      "insert into BBY_13_mm_users (username, firstname, lastname, email, administrator, delete_user, password) values ?";
    let userValue = [
      ["ahong", "Amarra", "Hong", "ahong@bcit.ca", "y", "n", "12345"],
      ["gvarma", "Geetika", "Varma", "gvarma@bcit.ca", "n", "n", "12345"],
      ["sbae", "Sam", "Bae", "sbae@bcit.ca", "y", "n", "12345"],
      ["joh", "Jason", "Oh", "joh@bcit.ca", "y", "n", "12345"],
    ];
    await connection.query(userRecord, [userValue]);
  }

  console.log("Listening on port " + port + "!");
}


let http = require('http');
let url = require('url');
// const res = require("express/lib/response");

http.createServer((req, res) => {
  let q = url.parse(req.url, ture);
  console.log(q.query);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });

  res.end(`Hello ${q.query['name']} `);
})

let port = 8000;
// app.listen(port, init);
app.listen(process.env.PORT || 8000, init);

