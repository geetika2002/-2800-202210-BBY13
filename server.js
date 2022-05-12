"use strict";
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
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
    host: "z3iruaadbwo0iyfp.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "uxrgx7qnx0izne7m",
    password: "xuty202yrdryrweg",
    database: "yw48avcu2w48bl98",
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
const req = require("express/lib/request");

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

        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);

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

app.get("/user-profiles", function (req, res) {
    if (req.session) {
        let profile = fs.readFileSync("./app/user-profiles.html", "utf8");
        let profileDOM = new JSDOM(profile);

        var SQL = "SELECT * FROM BBY_13_mm_users";

        database.query(SQL);

        database.query(
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

        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);

        database.query(
            `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                const thisProfile = profDOM.window.document.createElement("table");
                let user;

                thisProfile.innerHTML =
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
                    "Password" +
                    "</th>";
                ("</tr>");
                for (let i = 0; i < results.length; i++) {
                    user =
                        "<td>" +
                        results[i].ID_NUMBER +
                        "</td>" +
                        "<td>" +
                        results[i].username +
                        "</td>" +
                        "<td>" +
                        results[i].firstname +
                        "</td>" +
                        "<td>" +
                        results[i].lastname +
                        "</td>" +
                        "<td>" +
                        results[i].email +
                        "</td>" +
                        "<td>" +
                        results[i].password +
                        "</td>";

                    thisProfile.innerHTML += user;
                }

                profDOM.window.document
                    .getElementById("profile_table")
                    .appendChild(thisProfile);

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

        var SQL = "SELECT * FROM BBY_13_mm_users;";

        database.query(SQL);

        database.query(
            `SELECT * FROM BBY_13_mm_users WHERE username = "${req.session.username}" AND password = "${req.session.password}"`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                const thisAdmin = profDOM.window.document.createElement("table");
                let user;

                thisAdmin.innerHTML =
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
                    "Password" +
                    "</th>" +
                    "</tr>";
                for (let i = 0; i < results.length; i++) {
                    user =
                        "<td>" +
                        results[i].ID_NUMBER +
                        "</td>" +
                        "<td>" +
                        results[i].username +
                        "</td>" +
                        "<td>" +
                        results[i].firstname +
                        "</td>" +
                        "<td>" +
                        results[i].lastname +
                        "</td>" +
                        "<td>" +
                        results[i].email +
                        "</td>" +
                        "<td>" +
                        results[i].password +
                        "</td>";

                    thisAdmin.innerHTML += user;
                }

                profDOM.window.document
                    .getElementById("admin_table")
                    .appendChild(thisAdmin);

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
});


async function init() {
    var SQL = "SELECT * FROM BBY_13_mm_users;";

    database.query(SQL);

    const createDBAndTables1 = `CREATE DATABASE IF NOT EXISTS COMP2800 ;
                            use COMP2800;  
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

    await database.query(createDBAndTables1);

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

    await database.query(createDBAndTables2);

    if (is_heroku) {
        var tables = database.query(createDBAndTables2); 
    }
    else {
        var tables = database.query(createDBAndTables1);
    }

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
