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

const doc = document.querySelector("#create");
if (doc) {
  doc.addEventListener("click", function (e) {
    e.preventDefault();

    let first = document.getElementById("first");
    let last = document.getElementById("last");
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let email = document.getElementById("email");
    let queryString =
      "username=" +
      username.value +
      "&first=" +
      first.value +
      "&last=" +
      last.value +
      "&email=" +
      email.value +
      "&password=" +
      password.value;

    ajaxPOST(
      "/add-new-user",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "success") {
            window.location.replace("/user-profiles");
          }
        }
      },
      queryString
    );
    window.location.replace("/user-profiles");
  });
}

const docu = document.querySelector("#createA");
if (docu) {
  docu.addEventListener("click", function (e) {
    e.preventDefault();

    let first = document.getElementById("firstA");
    let last = document.getElementById("lastA");
    let username = document.getElementById("usernameA");
    let password = document.getElementById("passwordA");
    let email = document.getElementById("emailA");
    let queryString =
      "usernameA=" +
      username.value +
      "&firstA=" +
      first.value +
      "&lastA=" +
      last.value +
      "&emailA=" +
      email.value +
      "&passwordA=" +
      password.value;

    ajaxPOST(
      "/add-new-admin",
      function (data) {
        if (
          first == null ||
          last == null ||
          username == null ||
          password == null ||
          email == null
        ) {
          document.getElementById("errorMsg").innerHTML = jsondata.msg;
        }

        if (data) {
          let dataParsed = JSON.parse(data);
          if (dataParsed.status == "fail") {
            document.getElementById("errorMsg").innerHTML = dataParsed.msg;
          } else {
            window.location.replace("/");
          }
        }
      },
      queryString
    );
    window.location.replace("/user-profiles");
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

function confirmDelete(clicked_id) {
  let okToDelete = confirm("Do you really want to DELETE this user?");
  if (okToDelete) {
    ajaxPOST(
      "/delete-user",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "sucess") {
          }
        }
      },
      {
        to_delete: clicked_id,
      }
    );

    setTimeout("location.reload(true);", 100);
  }
}

const docum = document.querySelector("#createNew");
if (docum) {
  docum.addEventListener("click", function (e) {
    e.preventDefault();

    let first = document.getElementById("first");
    let last = document.getElementById("last");
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let email = document.getElementById("email");
    let queryString =
      "username=" +
      username.value +
      "&first=" +
      first.value +
      "&last=" +
      last.value +
      "&email=" +
      email.value +
      "&password=" +
      password.value;

    ajaxPOST(
      "/add-new-user",
      function (data) {
        if (
          first == null ||
          last == null ||
          username == null ||
          password == null ||
          email == null
        ) {
          document.getElementById("errorMsg").innerHTML = jsondata.msg;
        }

        if (data) {
          let dataParsed = JSON.parse(data);
          if (dataParsed.status == "fail") {
            document.getElementById("errorMsg").innerHTML = dataParsed.msg;
          } else {
            window.location.replace("/index");
          }
        }
      },
      queryString
    );
    window.location.replace("/index");
  });
}

const product1 = document.getElementById("product1");
if (product1) {
  product1.addEventListener("click", (event) => {
    event.preventDefault();

    ajaxPOST(
      "/ecospec",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);

          if (jsondata.status === "success") {
            window.location.replace("/");
          }
        }
      },
      {
        name: document.getElementById("name").value,
        image: document.getElementById("image").value,
        price: document.getElementById("price").value,
      }
    );
  });
}

//EASTER EGG
function showEnd() {
  document.getElementById("stopconfetti").style.display = "inline";
}

function hideEnd() {
  document.getElementById("stopconfetti").style.display = "none";
}

//Shopping cart

function addToCart(clicked_id) {
  ajaxPOST(
    "/add_paint",
    (data) => {
      if (data) {
        const jasondata = JSON.parse(data);

        if (jsondata.status === "success") {
          window.location.replace("/");
        }
      }
    },
    {
      productid: clicked_id,
      quantity: document.getElementById("quantity").value,
    }
  );
}
