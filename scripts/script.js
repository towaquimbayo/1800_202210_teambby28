$(document).ready(function () {
    // Load Nav and Footer
    loadSkeleton();

    // Display User Name in Event Listings
    insertName();

    // Display Event Cards
    displayEvents('events');

    // Poplate Single Events
    if (window.location.pathname == '/single-event/') {
        populateSingleEvent();
    }

    // Poplate Check In
    if (window.location.pathname == '/check-in/') {
        populateCheckin();
    }

    // Disable button for checked in users
    disableReCheckin();

    // Display current queue in my Events
    displayQueue();

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
            // console.log(user.uid);
            // console.log("User is logged in!");
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);

            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().firstName;
                    document.getElementById("displayUserName").innerText = userName;
                })
        } else {
            welcomeMessage = document.getElementById("welcomeUser").style.display = "none";
            // console.log("User not logged in!");
        }
    });
}

function getProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // console.log(user.uid);
            // console.log("User is account details here!");
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
            user.updatePassword(newPassword).then(function () {
                console.log('successful password change!');
            }).catch(function (error) {
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
// pushEvents()
function pushEvents() {
    var eventRef = db.collection("events");
    eventRef.add({
        name: "Men's Ice Hockey",
        location: "3700 Willingdon Ave, Surrey, BC V5G 3H2",
        city: "Surrey",
        province: "BC",
        id: "AA1",
        date: "April 2nd, 2030",
        time: "09:45AM - 11:00PM",
        description: "Men's Ice Hockey is taking place on April 2nd, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Figure Skating",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Burnaby",
        province: "BC",
        id: "AA2",
        date: "April 6th, 2030",
        time: "12:00PM - 15:30PM",
        description: "Women's Figure Skating is taking place on April 6th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Ski Jumping",
        location: "3700 Willingdon Ave, Richmond, BC V5G 3H2",
        city: "Richmond",
        province: "BC",
        id: "AA3",
        date: "April 15th, 2030",
        time: "11:00AM - 14:30PM",
        description: "Women's Ski Jumping is taking place on April 15th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Ice Hockey",
        location: "3700 Willingdon Ave, Vancouver, BC V5G 3H2",
        city: "Vancouver",
        province: "BC",
        id: "AA4",
        date: "April 21st, 2030",
        time: "09:45AM - 11:00PM",
        description: "Men's Ice Hockey is taking place on April 21st, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Figure Skating",
        location: "3700 Willingdon Ave, Burnaby, BC V5G 3H2",
        city: "Burnaby",
        province: "BC",
        id: "AA5",
        date: "April 30th, 2030",
        time: "13:00PM - 16:00PM",
        description: "Men's Figure Skating is taking place on April 30th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Snowboarding",
        location: "3700 Willingdon Ave, Vancouver, BC V5G 3H2",
        city: "Vancouver",
        province: "BC",
        id: "AA6",
        date: "May 1st, 2030",
        time: "08:45AM - 11:00AM",
        description: "Women's Snowboarding is taking place on May 1st, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Women's Ski Jumping",
        location: "3700 Willingdon Ave, Richmond, BC V5G 3H2",
        city: "Richmond",
        province: "BC",
        id: "AA7",
        date: "May 5th, 2030",
        time: "12:00PM - 15:30PM",
        description: "Women's Ski Jumping is taking place on May 5th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
    });
    eventRef.add({
        name: "Men's Snowboarding",
        location: "3700 Willingdon Ave, Surrey, BC V5G 3H2",
        city: "Surrey",
        province: "BC",
        id: "AA8",
        date: "May 9th, 2030",
        time: "09:00AM - 11:30AM",
        description: "Men's Snowboarding is taking place on May 9th, 2030. Tickets cost $20 per person. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, repudiandae doloribus. Magni repellat sit quae praesentium eius, laudantium itaque veniam?"
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
                var eventID = doc.data().id; // get "id" key the of event
                let newcard = cardTemplate.content.cloneNode(true);

                // update title and text and image
                newcard.querySelector('.eventName').innerHTML = title;
                newcard.querySelector('.eventLocation').innerHTML = location;
                newcard.querySelector('.eventTime').innerHTML = time;
                newcard.querySelector('.eventImage').src = "../images/" + eventID + ".jpg";
                newcard.querySelector('.viewEvent').onclick = () => setEventData(eventID, doc.id);
                //attach to gallery
                document.getElementById(collection + "-display").appendChild(newcard);
                i++;
            })
        })
}

// function to set event id 
function setEventData(eventID, docID) {
    localStorage.setItem('eventID', eventID);
    localStorage.setItem('eventDocID', docID);
}

// function to populate the single events page
function populateSingleEvent() {
    // get collection 
    let eventID = localStorage.getItem("eventID");
    db.collection("events").where("id", "==", eventID)
        .get()
        .then(queryEvent => {
            // see how many results are found for this query
            size = queryEvent.size;
            // get docs of query
            EventsQ = queryEvent.docs;
            // console.log("THIS EVENT: " + queryEvent.docs[0].id);

            // check to see no duplicate events under 1 id
            if (size == 1) {
                var thisEvent = EventsQ[0].data();

                eventName = thisEvent.name;
                document.getElementById("eventName").innerHTML = eventName;

                document.getElementById("eventHero").style.backgroundImage = "url(../images/" + eventID + ".jpg)";

                eventDesc = thisEvent.description;
                document.getElementById("eventDetails").innerHTML = eventDesc;

                eventLocation = thisEvent.location;
                document.getElementById("eventLocation").innerHTML = eventLocation;

                eventTime = thisEvent.time;
                document.getElementById("eventTime").innerHTML = eventTime;

                eventDate = thisEvent.date;
                document.getElementById("eventDate").innerHTML = eventDate;

            } else {
                console.log("Query has > 1 data");
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// function to populate check in page
function populateCheckin() {
    // get collection 
    let eventID = localStorage.getItem("eventID");
    db.collection("events").where("id", "==", eventID)
        .get()
        .then(queryEvent => {
            // see how many results are found for this query
            size = queryEvent.size;
            // get docs of query
            EventsQ = queryEvent.docs;
            // console.log("THIS EVENT: " + queryEvent.docs[0].id);

            // check to see no duplicate events under 1 id
            if (size == 1) {
                var thisEvent = EventsQ[0].data();

                eventName = thisEvent.name;
                document.getElementById("eventNameCheck").innerHTML = eventName;

                document.getElementById("eventHeroCheck").style.backgroundImage = "url(../images/" + eventID + ".jpg)";

                eventDesc = thisEvent.description;
                document.getElementById("eventDetailsCheck").innerHTML = eventDesc;

                eventDate = thisEvent.date;
                document.getElementById("eventDateCheck").innerHTML = eventDate;

                checkIn();

            } else {
                console.log("Query has > 1 data");
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// User confirms check in 
function checkIn() {
    var currEvent = localStorage.getItem("eventID");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const form = document.getElementById("checkInConfirmForm");
            currentUser = db.collection('users').doc(user.uid);
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                currentUser.update({
                    checkinTime: firebase.firestore.FieldValue.serverTimestamp(),
                    currentevent: currEvent,
                    status: "Wait"
                }).then(userDoc => {
                    window.location.replace("/check-in-confirmation/");
                })

                db.collection('events').where("id", "==", currEvent)
                    .get()
                    .then(queryEvent => {
                        size = queryEvent.size;
                        EventsQ = queryEvent.docs;

                        if (size == 1) {
                            var thisEvent = EventsQ[0].id;
                            localStorage.setItem('permanentEventID', thisEvent);
                            var permEventID = localStorage.getItem('permanentEventID');
                            currentUser.get()
                                .then(userDoc => {
                                    db.collection('events').doc(thisEvent).collection('queue').add({
                                        userID: user.uid,
                                        userName: userDoc.data().firstName,
                                        hereTime: userDoc.data().checkinTime,
                                        currEventID: permEventID
                                    });

                                });
                            console.log("Checked in user added to event!");
                        }
                    })
                    .catch((error) => {
                        console.log("Error adding new user: ", error);
                    });
            });
        }
    });
}

// Disable check in button for all events if user already checked in for one event
function disableReCheckin() {
    firebase.auth().onAuthStateChanged(user => {
        var currEvent = localStorage.getItem("eventID");
        var checkBtn = document.getElementById("checkinIDBtn");

        if (user) {
            currentUser = db.collection('users').doc(user.uid);
            db.collection('events').where("id", "==", currEvent)
                .get()
                .then(queryEvent => {
                    size = queryEvent.size;
                    EventsQ = queryEvent.docs;

                    if (size == 1) {
                        var thisEvent = EventsQ[0].id;
                        currentUser.get()
                            .then(userDoc => {
                                db.collection('events').doc(thisEvent).collection('queue')
                                    .get()
                                    .then(snap => {
                                        // if ((!userDoc.data().status.exists) && (userDoc.data().currentevent == currEvent)) {
                                        if (!userDoc.data().status.exists) {
                                            checkBtn.innerHTML = "Please Wait";
                                            checkBtn.removeAttribute("href");
                                            checkBtn.classList.add('disabled');
                                        } else {
                                            console.log('The user hasnt checked in yet')
                                        }
                                    });
                            });
                    }
                })
                .catch((error) => {
                    console.log("Error disabling button: ", error);
                });
        }
    });
}

// Display queue for how many people in the current batch for the checked in event 
function displayQueue() {
    const docID = localStorage.getItem('permanentEventID');
    db.collection('events').doc(docID).collection('queue')
        .get()
        .then(querySnapshot => {
            var querySize = querySnapshot.size;
            // console.log("CURRENT EVENT BATCH SIZE: " + querySize);

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = db.collection('users').doc(user.uid);
                    currentUser.get()
                        .then(userDoc => {
                            myCurrEvent = userDoc.data().currentevent;
                            db.collection('events').where("id", "==", myCurrEvent)
                                .get()
                                .then(queryEvent => {
                                    size = queryEvent.size;
                                    EventsQ = queryEvent.docs;
                                    if (size == 1) {
                                        var thisEvent = EventsQ[0].data();
                                        eventName = thisEvent.name;
                                        eventDate = thisEvent.date;
                                        eventTime = thisEvent.time;
                                        document.getElementById("myEventInfo").innerHTML = eventName + " at " + eventDate + ", " + eventTime;
                                        document.getElementById("myEventQueue").innerHTML = querySize + "/5";
                                    }
                                })
                                .catch((error) => {
                                    console.log("Error adding my event info: ", error);
                                });
                        });
                }
            });
        });
}

function displayClock() {
    var refresh = 1000;
    currentTime = setTimeout('displayClockTime()', refresh);
}

function displayClockTime() {
    var x = new Date();
    document.getElementById('clock').innerHTML = x;
    displayClock();
    console.log('START TIME:' + x);
    var interval = setInterval(function () {
        console.log('EVENT HAS STARTED!');
    },  60 * 1000);
    clearInterval(interval);
}

/*********** NEXT STEPS ************/
/**
 * 1) Single events page populated from database (local session, grab event ID) // DONE
 * 2) Checked in event -> Create sub collection for currentQueue -> Should contain users and their ID // DONE
 * 3) My Events page -> Display queue (How many ppl in current batch of yours) ex. 2/5 in queue // DONE
 * 4) My Events page -> Display "Please Wait" button (disabled)
 * 5) User Collection (Checked in User) -> Update the status: "Wait"; // DONE
 *
 *
 *
 * 6) Function for batchManager() -> Run a loop for every 90 seconds ->
 *          7) Add checked in event to checked in user (currentEvent: event1IDName);
 *          8) Check if there are 3 users in the batch
 *          9) If there are 3 users ->
 *                 10) Display a "Enter Now" button on My Events for all queued user
 *                 11) Reset the batch (timer and delete all users from current queue)
 *                 12) Updates user status: "Enter Now";
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