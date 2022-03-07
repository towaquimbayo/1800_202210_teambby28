$(document).ready(function () {
    // Load Nav and Footer
    loadSkeleton();

    // Display User Name in Event Listings
    insertName();

    // Get profile in accounts page
    getProfile();

    // Update profile in accounts page after save changes
    updateProfile();

    // Signout user
    signOut();

    // Account Password
    $("#show-hide-password .input-group-addon a").on('click', function (event) {
        event.preventDefault();
        if ($('#show-hide-password input').attr("type") == "text") {
            $('#show-hide-password input').attr('type', 'password');
            $('#show-hide-password .input-group-addon a i').addClass("fa-eye-slash");
            $('#show-hide-password .input-group-addon a i').removeClass("fa-eye");
        } else if ($('#show-hide-password input').attr("type") == "password") {
            $('#show-hide-password input').attr('type', 'text');
            $('#show-hide-password .input-group-addon a i').removeClass("fa-eye-slash");
            $('#show-hide-password .input-group-addon a i').addClass("fa-eye");
        }
    });
});

function loadSkeleton() {
    $('#navPlaceHolder').load('../temp/nav.html', function () {
        $('.navbar-nav .nav-item .nav-link').each(function () {
            $(this).toggleClass('active', this.getAttribute('href') === location.pathname);
            // Hide specific nav links depending if the user is logged in or not
            hideLoggedNav();
        })
    });
    console.log($('#footerPlaceHolder').load('../temp/footer.html'));
}

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 
            console.log(user.uid);
            console.log("User is logged in!");
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var user_Name = userDoc.data().firstName;
                    console.log(user_Name);
                    document.getElementById("displayUserName").innerText = user_Name;
                })
        } else {
            welcomeMessage = document.getElementById("welcomeUser").style.display = "none";
            console.log("User not logged in!");
        }
    });
}

function getProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            console.log("User is account details here!");
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // For first name
                    var firstName = userDoc.data().firstName;
                    document.getElementById("firstName").value = firstName;

                    // For last name
                    var lastName = userDoc.data().lastName;
                    document.getElementById("lastName").value = lastName;

                    // For email
                    var email = userDoc.data().email;
                    document.getElementById("email").value = email;

                    // For Phone
                    var phone = userDoc.data().phone;
                    document.getElementById("phone").value = phone;

                    // For password
                    // var password = userDoc.data().password;
                    // document.getElementById("password").value = password;  
                })
        }
    })
}

function updateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const form = document.querySelector("#profileForm");
            currentUser = db.collection("users").doc(user.uid);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // updatePassword();
                currentUser.update({
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    phone: form.phone.value,
                    email: form.email.value
                })
                .then(userDoc => {
                    window.location.replace(location.pathname);
                })
            });
        }
    })

    // getProfile();
}

function updatePassword() {

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const form = document.querySelector("#profileForm");
            alert("Password Change!");
            var user = firebase.auth().currentUser;
            var newPassword = form.password.value;

            user.updatePassword(newPassword).then(function () {
                // Update successful.
            }).catch(function (error) {
                // An error happened.
            });
        }
    })
}

function signOut() {
    const logout = document.querySelector('#logout');
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            console.log('User signed out');
            window.location.replace("/login/");
        })
    })
}

function hideLoggedNav() {
    const loggedOutLinks = document.querySelectorAll('.logged-out');
    const loggedInLinks = document.querySelectorAll('.logged-in');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // toggle UI Elements
            console.log('user logged in!!!!!');
            loggedInLinks.forEach(item => item.style.display = 'block');
            loggedOutLinks.forEach(item => item.style.display = 'none');
        } else {
            console.log('user logged out!!!!!');
            // toggle UI elements
            loggedInLinks.forEach(item => item.style.display = 'none');
            loggedOutLinks.forEach(item => item.style.display = 'block');
        }
    });
}


// Pre Template Code
// function sayHello() {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             // User is signed in.
//             // Do something for the user here.
//             console.log(user.uid);
//             db.collection("users").doc(user.uid)
//                 .get()
//                 .then(function (doc) {
//                     var n = doc.data().name;
//                     console.log(n);
//                     //$("#username").text(n);
//                     document.getElementById("username").innerText = n;
//                 })
//         } else {
//             // No user is signed in.
//         }
//     });
// }

//sayHello();

// function writeWebcamData() {
//     //this is an array of JSON objects copied from open source data
//     var webcams = [{
//         "datasetid": "web-cam-url-links",
//         "recordid": "01d6f80e6ee6e7f801d2b88ad7517bd05223e790",
//         "fields": {
//             "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/17.html",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.136736007805,
//                     49.2972589838826
//                 ]
//             },
//             "mapid": "TCM015",
//             "name": "Stanley Park Causeway"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     },
//     {
//         "datasetid": "web-cam-url-links",
//         "recordid": "d95ead494c2afbb5f47efdc26bf3ea8c6b8b2e22",
//         "fields": {
//             "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/20.html",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.129968,
//                     49.324891
//                 ]
//             },
//             "mapid": "TCM017",
//             "name": "North End 2"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     },
//     {
//         "datasetid": "web-cam-url-links",
//         "recordid": "8651b55b799cac55f9b74d654a88f3500b6acd64",
//         "fields": {
//             "url": "https://trafficcams.vancouver.ca/cambie49.htm",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.116492357278,
//                     49.2261139995231
//                 ]
//             },
//             "mapid": "TCM024",
//             "name": "Cambie St and W 49th Av",
//             "geo_local_area": "Oakridge"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     },
//     {
//         "datasetid": "web-cam-url-links",
//         "recordid": "f66fa2c58d19e3f28cf8b842bfa1db073e32e71b",
//         "fields": {
//             "url": "https://trafficcams.vancouver.ca/cambie41.htm",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.116192190431,
//                     49.2335434721856
//                 ]
//             },
//             "mapid": "TCM025",
//             "name": "Cambie St and W 41st Av",
//             "geo_local_area": "South Cambie"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     },
//     {
//         "datasetid": "web-cam-url-links",
//         "recordid": "7c3afe1d3fe4c80f24260a4946abea3fb15b7017",
//         "fields": {
//             "url": "https://trafficcams.vancouver.ca/cambie25.htm",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.115406053889,
//                     49.248990875309
//                 ]
//             },
//             "mapid": "TCM026",
//             "name": "Cambie St and W King Edward Av",
//             "geo_local_area": "South Cambie"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     },
//     {
//         "datasetid": "web-cam-url-links",
//         "recordid": "7fea7df524a205c0c0eb8efcc273345356cbe8d1",
//         "fields": {
//             "url": "https://trafficcams.vancouver.ca/mainTerminal.htm",
//             "geom": {
//                 "type": "Point",
//                 "coordinates": [
//                     -123.100028035364,
//                     49.2727762979223
//                 ]
//             },
//             "mapid": "TCM028",
//             "name": "Main St and Terminal Av",
//             "geo_local_area": "Downtown"
//         },
//         "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
//     }
//     ];

//     webcams.forEach(function (cam) { //cycle thru json objects in array
//         console.log(cam); //just to check it out
//         db.collection("webcams").add(cam) //add this new document
//             .then(function (doc) { //success
//                 console.log("wrote to webcams collection " + doc.id);
//             })
//     })
// }