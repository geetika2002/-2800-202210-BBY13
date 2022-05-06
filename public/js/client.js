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
  console.log("params in ajaxPOST", params);

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
    console.log("button clicked");
    event.preventDefault();
    console.log("before ajax");
    ajaxPOST(
      "/login",
      (data) => {
        if (data) {
          const jsondata = JSON.parse(data);
          console.log(jsondata.status);
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
