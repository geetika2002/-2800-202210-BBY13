"use strict";

function ajaxPOST(url, callback, data) {
  let params =
    typeof data == "string"
      ? data
      : Object.keys(data)
          .map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
          })
          .join("&");

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      callback(this.responseText);
    } else {
      console.log(this.status);
    }
  };
  xhr.open("POST", url);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
}

const sub = document.getElementById("submit");
if (sub) {
  sub.addEventListener("click", (event) => {
    event.preventDefault();

    ajaxPOST(
      "/login",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "success") {
            window.location.replace("/home");
          } else {
            document.getElementById("errorMsg").innerHTML = jsondata.msg;
          }
        }
      },

      {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }
    );
  });

  function ready(callback) {
    if (document.readyState != "loading") {
      callback();
      console.log("ready state is 'complete'");
    } else {
      document.addEventListener("DOMContentLoaded", callback);
      console.log("Listener was invoked");
    }
  }
}

const pw_sub = document.getElementById("submit_info");
if (pw_sub) {
  pw_sub.addEventListener("click", (event) => {
    event.preventDefault();

    ajaxPOST(
      "/new_info",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "success") {
            window.location.replace("/");
          }
        }
      },
      {
        new_fname: document.getElementById("fname").value,
        new_lname: document.getElementById("lname").value,
        new_email: document.getElementById("email").value,
        new_password: document.getElementById("password").value,
      }
    );
  });
}

const admin_change = document.getElementById("admin_change");
if (admin_change) {
  admin_change.addEventListener("click", (event) => {
    event.preventDefault();

    ajaxPOST(
      "/new_info_admin",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "success") {
            window.location.replace("/");
          }
        }
      },
      {
        new_fname: document.getElementById("fname").value,
        new_lname: document.getElementById("lname").value,
        new_email: document.getElementById("email").value,
        new_password: document.getElementById("password").value,
      }
    );
  });
}

function info_change(clicked_id) {
  ajaxPOST(
    "/user-info",
    (data) => {
      if (data) {
        const jsondata = JSON.parse(data);

        if (jsondata.status === "success") {
          window.location.replace("/");
        }
      }
    },
    {
      user_edit: clicked_id,
    }
  );
}

function closeForm() {
  document.getElementById("form").style.display = "none";
}
var down = document.getElementById("form-user");

function createForm() {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit");

  var FN = document.createElement("input");
  FN.setAttribute("type", "First Name");
  FN.setAttribute("name", "First Name");
  FN.setAttribute("placeholder", "First Name");

  var LN = document.createElement("input");
  LN.setAttribute("type", "Last Name");
  LN.setAttribute("name", "Last Name");
  LN.setAttribute("placeholder", "Last Name");

  var UN = document.createElement("input");
  UN.setAttribute("type", "Username");
  UN.setAttribute("name", "Username");
  UN.setAttribute("placeholder", "Username");

  var ID = document.createElement("input");
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "email");
  ID.setAttribute("placeholder", "email");

  var PWD = document.createElement("input");
  PWD.setAttribute("type", "password");
  PWD.setAttribute("name", "password");
  PWD.setAttribute("placeholder", "Password");

  var s = document.createElement("input");
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");

  form.append(FN);
  form.append(LN);
  form.append(UN);
  form.append(ID);
  form.append(PWD);
  form.append(s);

  document.getElementsByTagName("body")[0].appendChild(form);
}

var down = document.getElementById("form-admin");

function createFormAdmin() {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit");

  var FN = document.createElement("input");
  FN.setAttribute("type", "First Name");
  FN.setAttribute("name", "First Name");
  FN.setAttribute("placeholder", "First Name");

  var LN = document.createElement("input");
  LN.setAttribute("type", "Last Name");
  LN.setAttribute("name", "Last Name");
  LN.setAttribute("placeholder", "Last Name");

  var UN = document.createElement("input");
  UN.setAttribute("type", "Username");
  UN.setAttribute("name", "Username");
  UN.setAttribute("placeholder", "Username");

  var ID = document.createElement("input");
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "email");
  ID.setAttribute("placeholder", "email");

  var PWD = document.createElement("input");
  PWD.setAttribute("type", "password");
  PWD.setAttribute("name", "password");
  PWD.setAttribute("placeholder", "Password");

  var s = document.createElement("input");
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");

  form.append(FN);
  form.append(LN);
  form.append(UN);
  form.append(ID);
  form.append(PWD);
  form.append(s);

  document.getElementsByTagName("body")[0].appendChild(form);
}
