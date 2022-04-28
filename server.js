const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require("jsdom");
const mysql = require('mysql');



app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
app.use("/media", express.static("./public/media"));

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
        res.redirect("/profile");
    } else {
        let doc = fs.readFileSync("./app/index.html", "utf8");

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(doc);
    }
});

app.get("/home", function (req, res) {
    // check for a session
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/home.html", "utf8");
        let profileDOM = new JSDOM(profile);


        // profileDOM.window.document.getElementsByTagName("title")[0].innerHTML =
        //     req.session.name + "'s Profile";
        // profileDOM.window.document.getElementById("profile_name").innerHTML =
        //     "Welcome back! "+ req.session.name;

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profileDOM.serialize());
    } else {
console.log("redirecting on the server.");
        res.redirect("/");
    }
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post("/login", async function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password);
    let email = req.body.email;
	let password = req.body.password;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6",
    });
    connection.connect();
    const [rows, fields] = await connection.execute(
        `SELECT * FROM A01209395_user WHERE email = "${req.body.email}" AND password = "${req.body.password}"`
    );

    if (rows.length > 0) {
        req.session.loggedIn = true;
        req.session.email = `${req.body.email}`;
        req.session.name = `${req.body.email}`;
        req.session.save(function (err) {
        });
        console.log("success, logged in");
        res.send({ status: "success", msg: "Logged in." });
    } else {
        console.log("error, user not found");
        res.send({ status: "fail", msg: "User account not found." });
    }
});

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});




// app.get("/table-async", function (req, res) {
//     const mysql = require("mysql2");
//     const connection = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: "",
//         database: "assignment6",
//     });
//     let myResults = null;
//     console.log(req.session.email)
//     connection.connect();
//     connection.query(
//         "SELECT * FROM A01209395_user WHERE email = ?", [req.session.email],
//         function (error, results, fields) {

//             console.log(
//                 "Results from DB",
//                 results,
//                 "and the # of records returned",
//                 results.length
//             );

//             myResults = results;
//             if (error) {

//                 console.log(error);
//             }
//             let table = "<table><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th></tr>";
//             for (let i = 0; i < results.length; i++) {
//                 table +=
//                     "<tr><td>" +
//                     results[i].PK +
//                     "</td><td>" +
//                     results[i].first_name +
//                     "</td><td>" +
//                     results[i].last_name +
//                     "</td><td>" +
//                     results[i].email +
//                     "</td></tr>";
//             }
//             table += "</table>";
//             res.send(table);
//             connection.end();
//         }
//     );

//     console.log(myResults, "null");
// });



// app.get("/table-sync", function (req, res) {

//     const mysql = require("mysql2");
//     const connection = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: "",
//         database: "assignment6",
//     });
//     let myResults = null;
//     console.log(req.session.email)
//     connection.connect();
//     connection.query(
//         "SELECT * FROM A01209395_user_timeline, A01209395_user WHERE A01209395_user.email =? AND A01209395_user_timeline.FK = A01209395_user.PK", [req.session.email],
//         function (error, results, fields) {

//             console.log(
//                 "Results from DB",
//                 results,
//                 "and the # of records returned",
//                 results.length
//             );

//             myResults = results;
//             if (error) {

//                 console.log(error);
//             }
//             let table = "<table><tr><th>FK-ID</th><th>Date</th><th>Text</th><th>Time</th><th>Views</th></tr>";
//             for (let i = 0; i < results.length; i++) {
//             table +=
//             "<tr><td>" +
//             results[i].FK +
//             "</td><td>" +
//             results[i].date_of_post +
//             "</td><td>" +
//             results[i].text +
//             "</td><td>" +
//             results[i].time_of_post +
//             "</td><td>" +
//             results[i].num_views +
//             "</td></tr>";
//     }
//     console.log("rows", results);
//     // don't forget the '+'
//     table += "</table>";
//     res.send(table);
//     connection.end();
//         }
//     );

//     console.log(myResults, "null");
// });

async function init() {

    // we'll go over promises in COMP 2537, for now know that it allows us
    // to execute some code in a synchronous manner
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS test;
        use test;
        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        name varchar(30),
        email varchar(30),
        password varchar(30),
        PRIMARY KEY (ID));`;
    await connection.query(createDBAndTables);

    // await allows for us to wait for this line to execute ... synchronously
    // also ... destructuring. There's that term again!
    const [rows, fields] = await connection.query("SELECT * FROM user");
    // no records? Let's add a couple - for testing purposes
    if (rows.length == 0) {
        // no records, so let's add a couple
        // let userRecords = "insert into user (name, email, password) values ?";
        // let recordValues = [
        //     ["Arron", "arron_ferguson@bcit.ca", "abc123"],
        //     ["Amarra", "ahong@bcit.ca", "abc123"],
        //     ["Donna", "donna_turner@bcit.ca", "abc123"]
        // ];
        await connection.query(userRecords, [recordValues]);
    }
    connection.end();
    console.log("Listening on port " + port + "!");
}


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});