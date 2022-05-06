const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require("jsdom");
const mysql = require("mysql");
const {
    response
} = require("express");

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
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
            host: "localhost",
            user: "root",
            password: "",
            database: "COMP2800",
        });

        connection.connect;

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

    console.log("What was sent", req.body.username, req.body.password);

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
        req.session.username = `${req.body.username}`;
        req.session.password = `${req.body.password}`;
        req.session.save(function (err) { });
        console.log("success, logged in");
        res.send({
            status: "success",
            msg: "Logged in.",
        });

        if (rows[0].administrator == "y") {
            admin = true;
        } else {
            admin = false;
        } 

    } else {
        console.log("error, user not found");
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

async function init() {
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true,
    });

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
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

let port = 8000;
app.listen(port, init);