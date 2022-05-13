"use strict";
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
<<<<<<< HEAD
const {
    JSDOM
} = require("jsdom");

const is_heroku = process.env.IS_HEROKU || false;
const mysql = require("mysql2/promise");
const dbConfigLocal = {
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
};
const dbConfigHeroku = {
    host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z596t5v95ron6fzg",
    password: "lh6fsygbhuhgi3i7",
    database: "rz2y3uh9vljkf5dz",
    multipleStatements: true
};

if (is_heroku) {
    var database = mysql.createPool(dbConfigHeroku);
}

else {
    var database = mysql.createPool(dbConfigLocal);
}

const {
    response
} = require("express");
=======
const { JSDOM } = require("jsdom");
const mysql = require("mysql");
const { response } = require("express");
>>>>>>> dev
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

<<<<<<< HEAD
        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);
=======
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
    });
    connection.connect;
>>>>>>> dev

    profileDOM.window.document.getElementById("first_name").innerHTML =
      "Pleased to see you, " + req.session.fname;

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

<<<<<<< HEAD
    var SQL = "SELECT * FROM BBY_13_mm_users;";

    database.query(SQL);

    const [rows, fields] = await database.execute(
        `SELECT * FROM BBY_13_mm_users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`
    );

    if (rows.length > 0) {
        req.session.loggedIn = true;
        req.session.username = rows[0].username;
        req.session.password = rows[0].password;
        req.session.idnum = rows[0].ID_NUMBER;
        req.session.fname = rows[0].firstname;
        req.session.lname = rows[0].lastName;
        req.session.email = rows[0].email;
        req.session.admin = rows[0].administrator;

        console.log(req.session.fname);
        console.log(req.session.password);

        req.session.save(function (err) { });

        res.send({
            status: "success",
            msg: "Logged in.",
        });

        if (req.session.admin == "y") {
            admin = true;
        } else {
            admin = false;
        }
=======
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
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

    console.log(req.session.fname);
    console.log(req.session.password);

    req.session.save(function (err) {});

    res.send({
      status: "success",
      msg: "Logged in.",
    });

    if (req.session.admin == "y") {
      admin = true;
>>>>>>> dev
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

app.get("/user-profiles", function (req, res) {
  if (req.session) {
    let profile = fs.readFileSync("./app/user-profiles.html", "utf8");
    let profileDOM = new JSDOM(profile);

<<<<<<< HEAD
        var SQL = "SELECT * FROM BBY_13_mm_users";

        database.query(SQL);

        database.query(
            "SELECT * FROM BBY_13_mm_users",
            function (error, userresults, fields) {
                if (error) {
                    console.log(error);
                }
=======
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
    });
    connection.connect();

    connection.query(
      "SELECT * FROM BBY_13_mm_users",
      function (error, userresults, fields) {
        if (error) {
          console.log(error);
        }
>>>>>>> dev

        const allUsers = profileDOM.window.document.createElement("table");

<<<<<<< HEAD
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
                    "Edit User"
                "</th>" +
                    "</tr>";
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
                        "<td><button id='view'>View</button></td>" +
                        "<td><button id='delete'>Delete</button></td>";
                    allUsers.innerHTML += users;
                }
=======
        let users;
>>>>>>> dev

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
            ">Delete</button></td>";
          allUsers.innerHTML += users;
        }

        profileDOM.window.document
          .getElementById("user_table")
          .appendChild(allUsers);

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
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
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

<<<<<<< HEAD
        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);

        database.query(
            `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
=======
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
    });
    connection.connect();

    connection.query(
      `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
>>>>>>> dev

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

<<<<<<< HEAD
        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);

        database.query(
            `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
=======
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
    });
    connection.connect();

    connection.query(
      `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
>>>>>>> dev

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

<<<<<<< HEAD
app.post("/new_password", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    var SQL = "SELECT * FROM BBY_13_mm_users;";

    database.query(SQL);


    const [rows, fields] = await database.execute(
        `SELECT * FROM BBY_13_mm_users`
    );

    if (rows.length > 0) {
        req.session.password = `${req.body.new_password}`;
    }
    console.log(req.session.password);
    let sql = `UPDATE BBY_13_mm_users
           SET password = ?
           WHERE username = '${req.session.username}'`;
    database.query(sql, req.session.password);
=======
app.post("/new_info", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
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
>>>>>>> dev
});

app.post("/new_info_admin", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
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
});

async function init() {
<<<<<<< HEAD
    var SQL = "SELECT * FROM BBY_13_mm_users;";

    database.query(SQL);

    const createDBAndTables1 = `CREATE DATABASE IF NOT EXISTS COMP2800 ;
                            use COMP2800;  
=======
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
  });

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
                            use COMP2800;
>>>>>>> dev
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

<<<<<<< HEAD
    // await database.query(createDBAndTables1);

    const createDBAndTables2 = `CREATE DATABASE IF NOT EXISTS yw48avcu2w48bl98 ;
                            use yw48avcu2w48bl98;  
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

    // await database.query(createDBAndTables2);

    if (is_heroku) {
        var tables = await database.query(createDBAndTables2); 
    }
    else {
        var tables = await database.query(createDBAndTables1);
    }

    tables.query(tables); 

    const [userRows, userFields] = await database.query(
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
        await database.query(userRecord, [userValue]);
    }
    console.log("Listening on port " + port + "!");
=======
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
>>>>>>> dev
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
<<<<<<< HEAD
// app.listen(port, init);
app.listen(process.env.PORT || 8000, init);
=======
app.listen(port, init);
>>>>>>> dev
