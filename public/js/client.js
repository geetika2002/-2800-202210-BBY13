function ajaxPOST(url, callback, data) {
    let params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');
    console.log("params in ajaxPOST", params);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault();
    let user_name = document.getElementById("user_name");
    let password = document.getElementById("password");
    let queryString = "user_name=" + user_name.value + "&password=" + password.value;
    const vars = { "user_name": user_name, "password": password }
    ajaxPOST("/login", function (data) {

        if (data) {
            let dataParsed = JSON.parse(data);
            console.log(dataParsed);
            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/home");
            }
        }
    }, queryString);
});

document.getElementById("deleteAll").addEventListener("click", function(e) {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE) {

                // 200 means everthing worked
                if (xhr.status === 200) {

                  getCustomers();
                  document.getElementById("status").innerHTML = "All records deleted.";

                } else {

                  // not a 200, could be anything (404, 500, etc.)
                  console.log(this.status);

                }

            } else {
                console.log("ERROR", this.status);
            }
        }
        xhr.open("POST", "/delete-all-customers");
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
    });

// ready(function () {

//     console.log("Client script loaded.");

//     function ajaxGET(url, callback) {

//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//                 //console.log('responseText:' + xhr.responseText);
//                 callback(this.responseText);

//             } else {
//                 console.log(this.status);
//             }
//         }
//         xhr.open("GET", url);
//         xhr.send();
//     }


//     const sub = document.getElementById("submit");
//     if (sub){
//     sub.addEventListener('click', (event) => {

//         console.log("button clicked");
//         event.preventDefault();
//         console.log("before ajax");
//         ajaxPOST("/login", (data) => {
//             if (data) {
                
//                 const jsondata = JSON.parse(data)
//                 console.log(jsondata.status)
//                 if (jsondata.status === "success") {
//                     window.location.replace("/home");
//                 } else {
//                     document.getElementById("errorMsg").innerHTML = dataParsed.msg;
//                 }
//             }
//         }, 

//         {
//             email:document.getElementById("email").value,
//             password: document.getElementById("password").value,
//         }
//         );

//     });

// function ajaxPOST(url, callback, data) {

//     let params = typeof data == 'string' ? data : Object.keys(data).map(
//         function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
//     ).join('&');
//     console.log("params in ajaxPOST", params);

//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//             console.log('responseText:' + xhr.responseText);
//             callback(this.responseText);

//         } else {
//             console.log(this.status);
//         }
//     }
//     xhr.open("POST", url);
//     xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.send(params);
//     console.log("accessed");
// }

// }});


// function ready(callback) {
//     if (document.readyState != "loading") {
//         callback();
//         console.log("ready state is 'complete'");
//     } else {
//         document.addEventListener("DOMContentLoaded", callback);
//         console.log("Listener was invoked");
//     }
// }