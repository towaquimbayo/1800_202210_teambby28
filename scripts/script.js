$(document).ready(function () {
    // Load Nav and Footer
    loadSkeleton();

    // Display User Name in Event Listings
    insertName();

    // Display Event Cards
    displayEvents('events');

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
            updatePassword();

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                currentUser.update({
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    phone: form.phone.value,
                    email: form.email.value,
                })
                .then(userDoc => {
                    window.location.replace(location.pathname);
                })
            });
        }
    })
}

// Doesnt work, may not need
function updatePassword() {
    const form = document.querySelector("#profileForm");
    var newPassword = form.password.value;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            user.updatePassword(newPassword).then(function() {
                console.log('successful password change!');
            }).catch(function(error) {
                console.log("Theres a error here! " + error);
            })
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
    const loggedInLBtn = document.querySelectorAll('.logged-in-btn');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // toggle UI Elements
            loggedInLinks.forEach(item => item.style.display = 'block');
            loggedOutLinks.forEach(item => item.style.display = 'none');
            loggedInLBtn.forEach(item => item.style.display = 'flex');
        } else {
            // toggle UI elements
            loggedInLinks.forEach(item => item.style.display = 'none');
            loggedOutLinks.forEach(item => item.style.display = 'block');
            loggedInLBtn.forEach(item => item.style.display = 'none');
        }
    });
}

// Only used to populate data to firestore
function pushEvents() {
    var eventRef = db.collection("events");

    eventRef.add({
        name: "Women's Figure Skating",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Burnaby",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Ice Hockey",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Surrey",
        province: "BC",
        time: "09:45AM - 11:00PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Ski Jumping",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Vancouver",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Snowboarding",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Burnaby",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Figure Skating",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Burnaby",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Ice Hockey",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Richmond",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Ski Jumping",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Kamloops",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Snowboarding",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Vancouver",
        province: "BC",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on February 29th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
}

// Display event cards
function displayEvents(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate");

    db.collection(collection).get()
        .then(snap => {
            var i = 1;
            snap.forEach(doc => { // iterate thru each doc
                var title = doc.data().name;   // get value of the "name" key
                var location = doc.data().location;   // get value of the "location" key
                var time = doc.data().time;   // get value of the "time" key
                let newcard = cardTemplate.content.cloneNode(true);

                // update title and text and image
                newcard.querySelector('.eventName').innerHTML = title;
                newcard.querySelector('.eventLocation').innerHTML = location;
                newcard.querySelector('.eventTime').innerHTML = time;
                newcard.querySelector('.eventImage').src = "../images/" + collection + i + ".jpg"; 
                //attach to gallery
                document.getElementById(collection + "-display").appendChild(newcard);
                i++;
            })
        })
}

// User confirms check in -> User collection -> 1) waitList: true 2) activeList false 3) My-Events: [add checked in events from Events collection]
function checkIn() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            const form = document.querySelector('#checkInConfirmForm');
            currentuser = db.collection('users').doc(user.uid);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                currentUser.update({
                    waitList: true
                }, 
                currentUser.add({
                    timestamp:  firebase.firestore.FieldValue.serverTimestamp()
                }))
            })
        }
    })
}

/** NEXT STEPS */
/**
 * 1) Fix password change on my account
 * 2) Edit User collection -> Add 1) waitList: false 2) activeList: false 3) My-Events: []
 * 3) Add Events collection -> 1) Name 2) Location 3) Time 4) User-Waitlist: []
 * 
 * 4) User confirms check in -> User collection -> 1) waitList: true 2) activeList false 3) My-Events: [add checked in events from Events collection]
 * 5) User confirms check in -> Events collection -> 4) User-Waitlist: [add users with waitList: true]
 * 
 * 6) If a event reaches 10 users in waitList -> User collection (waitList: true) -> 1) waitList: false 2) activeList: true
 * 7) Run a foreach loop to start countdown() for each user, add 3 mins to wait time incrementally
 * 8) Display User wait time in accounts page, under My Events
 */


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