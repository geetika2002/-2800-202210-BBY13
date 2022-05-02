const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require("jsdom");
const mysql = require('mysql');
const { response } = require("express");
var isAdmin = false;



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
    console.log("1" + isAdmin);

    if (req.session.loggedIn) {
        if (isAdmin === false) {
//            res.redirect("/users");
            res.redirect("/home");
        } else {
            res.redirect("/admin");
        }

    } else {
        let doc = fs.readFileSync("./app/index.html", "utf8");
        res.send(doc);
    }
});

app.get("/admin", async (req, res) => {
    if (req.session.loggedIn && isAdmin === true) {
        let profile = fs.readFileSync("./app/admin.html", "utf-8");
        let profileDOM = new JSDOM(profile);

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profileDOM.serialize());
    } else {
        res.redirect("/");
    }
});

// app.get("/", function (req, res) {
//     if (req.session.loggedIn) {
//         res.redirect("/profile");
//     } else {
//         let doc = fs.readFileSync("./app/index.html", "utf8");

//         res.set("Server", "candy");
//         res.set("X-Powered-By", "candy");
//         res.send(doc);
//     }
// });

app.get("/home", async (req, res) => {
    if (req.session.loggedIn && isAdmin === false) {
        let profile = fs.readFileSync("./app/home.html", "utf-8");
        let profileDOM = new JSDOM(profile);

        res.set("Server", "candy");
        res.set("X-Powered-By", "candy");
        res.send(profileDOM.serialize());
    } else {
        res.redirect("/");
    }
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    let usr = req.body.user_name;
    let pwd = req.body.password;
    let myResults = [];

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "2800"
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log('Database is connected successfully !');
    });

    connection.execute(
        "SELECT * FROM user WHERE user.user_name = ? AND user.password = ?", [usr, pwd],
        function (error, results, fields) {
            myResults = results;
            console.log("results:", myResults);

            if (req.body.user_name == myResults[0].user_name && req.body.password == myResults[0].password) {
                if (myResults[0].admin_user === 'y') {
                    isAdmin = true;
                }
                req.session.loggedIn = true;
                req.session.user_name = myResults[0].user_name;
                req.session.password = myResults[0].password;
                req.session.name = myResults[0].first_name;
                req.session.save(function (err) {});
                res.send({
                    status: "success",
                    msg: "Logged in."
                });
            } else {
                res.send({
                    status: "fail",
                    msg: "User account not found."
                });
            }
            if (error) {
                console.log(error);
            }
            connection.end();
        }
    )
});
app.get("/get-users", function (req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "2800"
    });
    connection.connect();
    connection.query(
        "SELECT user.USER_ID, user.email_address, user.first_name, user.last_name  FROM user WHERE user_removed = 'n'",
        function (error, results) {
            if (error) {
                console.log(error);
            }
            console.log('Rows returned are: ', results);
            res.send({ status: "success", rows: results });
        }
    );
});

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                isAdmin = false;
                let doc = fs.readFileSync("./app/index.html", "utf8");
                res.send(doc);
            }
        });
    }
});

app.post("/user-update", function (req, res) {
    let adminUsers = [];
    const userId = req.params['userId'];
    console.log(userId);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "2800"
    });

    connection.connect();
    console.log(req.body.id + "ID");
    connection.execute(
        "SELECT * FROM user WHERE admin_user = 'y' AND user_removed = 'n'",
        function (error, results, fields) {
            adminUsers = results;
            let send = {status: "fail", msg: "Recorded updated."};
            connection.query("UPDATE user SET user_removed = ? WHERE USER_ID = ? AND admin_user = ?", ['y', req.body.id, 'n'], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                send.status = "success";
            });
            if (adminUsers.length > 1) {
                connection.query("UPDATE user SET user_removed = ? WHERE USER_ID = ? AND admin_user = ?", ['y', req.body.id, 'y'], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    send.status = "success";
                });
            } else {
                send.status = "fail";
            }
            res.send(send);
            if (error) {
                console.log(error);
            }
            connection.end();
        }
    );

});


//starts the server
let port = 8000;
app.listen(port, function () {
    console.log("Server started on " + port + "!");
});
