$(document).ready(function () {
    // Load Nav and Footer
    loadSkeleton();

    // Display User Name in Event Listings
    insertName();

    // Get profile in accounts page
    getProfile();

    // Update profile in accounts page after save changes
    updateProfile();

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

    if (window.location.pathname == '/my-events/') {
        setInterval(updateTime, 1000);
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection('users').doc(user.uid);
            currentUser.get()
            .then(userDoc => {
                myCurrEvent = userDoc.data().currentevent;
                myStatus = userDoc.data().status;
                if (myStatus == "Guest") {
                    document.getElementById("noEventMessage").style.display = "block";
                } else if (myStatus == "Checked In") {
                    localStorage.setItem('permanentEventID', '');
                    document.getElementById("noEventMessage").style.display = "block";
                    document.getElementById("checkedInEventInfo").style.display = "none";
                    document.getElementById("pastEventHeading").style.display = "block";
                    displayPastEvents();
                    document.querySelector(".listPastEvents").style.display = "flex";
                } else if (myStatus == "Enter Now") {
                    // Enter event function
                    enterEvent();

                    document.getElementById("noEventMessage").style.display = "none";
                    document.getElementById("checkedInEventInfo").style.display = "none";

                    myCurrEvent = userDoc.data().currentevent;
                    db.collection('events').where("id", "==", myCurrEvent)
                        .get()
                        .then(queryEvent => {
                            size = queryEvent.size;
                            EventsQ = queryEvent.docs;
                            if (size == 1) {
                                var thisEvent = EventsQ[0].data();
                                document.getElementById("listCurrEvents").style.display = "flex";
            
                                document.getElementById("currEventHeading").style.display = "block";
                                
                                var img = document.createElement("img");
                                img.src = "../images/" + thisEvent.id + ".jpg";
                                document.getElementById("currImg").appendChild(img);
                                
                                document.getElementById("currEvent").innerHTML = thisEvent.name;
                                document.getElementById("currEventTime").innerHTML = thisEvent.date + " at " + thisEvent.time;
                            }
                        });
                }
            });
        }
    });

    // Disable button for checked in users
    disableReCheckin();

    // Batch Manager
    batchManager();

    // Display current queue in my Events
    displayQueue();

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
        }
    });
}

function getProfile() {
    firebase.auth().onAuthStateChanged(user => {
        // Check to see if user is signed in
        if (user) {
            // Go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);

            // Get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // Gets user first name
                    var firstName = userDoc.data().firstName;
                    document.getElementById("firstName").value = firstName;

                    // Gets user last name (if available)
                    var lastName = userDoc.data().lastName;
                    document.getElementById("lastName").value = lastName;

                    // Gets user email that is associated with the account
                    var email = userDoc.data().email;
                    document.getElementById("email").value = email;

                    // Gets user phone number (if available)
                    var phone = userDoc.data().phone;
                    document.getElementById("phone").value = phone;

                    // Gets user password (hidden by default)
                    // var password = userDoc.data().password;
                    // document.getElementById("password").value = password;  
                })
        }
    })
}

// Saves new information submitted by the user to their user document in the users collection
function updateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const form = document.querySelector("#profileForm");
            // updatePassword();

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                db.collection("users").doc(user.uid).update({
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    phone: form.phone.value,
                    email: form.email.value
                })
                // Overwrites any fields filled out
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

// Log out function
function logOut() {
    firebase.auth().signOut().then(() => {
        window.location.replace("/login/");
    }).catch((error) => {
        console.log(error);
    });
}

// Hides specific links on the navigation bar depending on user log in state
function hideLoggedNav() {
    const loggedOutLinks = document.querySelectorAll('.logged-out');
    const loggedInLinks = document.querySelectorAll('.logged-in');
    const loggedInLBtn = document.querySelectorAll('.logged-in-btn');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // toggle UI Elements for signed in user
            loggedInLinks.forEach(item => item.style.display = 'block');
            loggedOutLinks.forEach(item => item.style.display = 'none');
            loggedInLBtn.forEach(item => item.style.display = 'flex');
        } else {
            // toggle UI elements for signed out user
            loggedInLinks.forEach(item => item.style.display = 'none');
            loggedOutLinks.forEach(item => item.style.display = 'block');
            loggedInLBtn.forEach(item => item.style.display = 'none');
        }
    });
}

// Function populates events to the Firestore database (only ran once)
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

// Function to set event ID in local storage when clicked by the user
function setEventData(eventID, docID) {
    localStorage.setItem('eventID', eventID);
    localStorage.setItem('eventDocID', docID);
}

// Function to populate the single event page
function populateSingleEvent() {
    // Get events collection
    let eventID = localStorage.getItem("eventID");
    db.collection("events").where("id", "==", eventID)
        .get()
        .then(queryEvent => {
            // Check how many results are found for this query
            size = queryEvent.size;
            // Get queried documents
            EventsQ = queryEvent.docs;
            // Check to see no duplicate events under a single id (check if each event is unique)
            if (size == 1) {
                var thisEvent = EventsQ[0].data();
                // Sets inner HTML to the specified event's information
                eventName = thisEvent.name;
                document.getElementById("eventName").innerHTML = eventName;

                document.getElementById("eventHero").style.backgroundImage = "url(../images/" + eventID + ".jpg)";

                eventDesc = thisEvent.description;
                document.getElementById("eventDetails").innerHTML = eventDesc;

                eventLocation = thisEvent.location;
                document.getElementById("eventLocation").innerHTML = eventLocation;

                mapLoad(eventLocation);

                eventTime = thisEvent.time;
                document.getElementById("eventTime").innerHTML = eventTime;

                eventDate = thisEvent.date;
                document.getElementById("eventDate").innerHTML = eventDate;

            } else {
                // Single event page is not populated since there are non-unique ids present in the "events" collection
                console.log("Query has > 1 data");
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// Function populates check in page
function populateCheckin() {
    // Gets document for the specified event
    let eventID = localStorage.getItem("eventID");
    db.collection("events").where("id", "==", eventID)
        .get()
        .then(queryEvent => {
            // Checks how many results are found for this query
            size = queryEvent.size;
            // Gets the docs of query
            EventsQ = queryEvent.docs;
            // Checks to see no duplicate events under 1 id
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
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// Function for the user to confirm check in
function checkIn() {
    var currEvent = localStorage.getItem("eventID");
    var currTime = new Date();
    firebase.auth().onAuthStateChanged(user => {
        // Checks to see if user is signed in (function only runs if user is signed in)
        if (user) {
            const form = document.getElementById("checkInConfirmForm");
            currentUser = db.collection('users').doc(user.uid);
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                currentUser.update({
                    currentevent: currEvent,
                    status: "Wait"
                })
                .then(userDoc => {
                    // On success, page is redirected
                    window.location.replace("/check-in-confirmation/");
                })

                // Gets current event document
                db.collection('events').where("id", "==", currEvent)
                    .get()
                    .then(queryEvent => {
                        size = queryEvent.size;
                        EventsQ = queryEvent.docs;

                        // Checks if event document has unique ID
                        if (size == 1) {
                            var thisEvent = EventsQ[0].id;
                            localStorage.setItem('permanentEventID', thisEvent);
                            var permEventID = localStorage.getItem('permanentEventID');

                            // Checks the current time
                            var checkTime = currTime.getHours() + ":" + currTime.getMinutes() + ":" + currTime.getSeconds();
                            currentUser.get()
                                .then(userDoc => {
                                    // Updates queue of the event
                                    db.collection('events').doc(thisEvent).collection('queue').add({
                                        userID: user.uid,
                                        userName: userDoc.data().firstName,
                                        hereTime: checkTime,
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

        // Checks if user is signed in (function only runs if user is signed in)
        if (user) {
            currentUser = db.collection('users').doc(user.uid);
            db.collection('events').where("id", "==", currEvent)
                .get()
                .then(queryEvent => {
                    // Check if event is under a unique ID
                    size = queryEvent.size;
                    EventsQ = queryEvent.docs;
                    if (size == 1) {
                        var thisEvent = EventsQ[0].id;
                        currentUser.get()
                            .then(userDoc => {
                                // Get event "queue" collection
                                db.collection('events').doc(thisEvent).collection('queue')
                                    .get()
                                    .then(snap => {
                                        // Updates user status
                                        if (userDoc.data().status == "Wait") {
                                            checkBtn.innerHTML = "Please Wait";
                                            checkBtn.removeAttribute("href");
                                            checkBtn.classList.add('disabled');
                                        } else {
                                            console.log('The user hasnt checked in yet');
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
            var querySize = localStorage.getItem("queueSize");
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = db.collection('users').doc(user.uid);
                    currentUser.get()
                    .then(userDoc => {
                        // Gets the current queue size of the current event
                        myCurrEvent = userDoc.data().currentevent;
                        myStatus = userDoc.data().status;
                        if (myStatus == "Wait") {
                            // Checks to see if the user has checked in to the current event
                            document.getElementById("noEventMessage").style.display = "none";
                            document.getElementById("checkedInEventInfo").style.display = "flex";
                            db.collection('events').where("id", "==", myCurrEvent)
                                .get()
                                .then(queryEvent => {
                                    size = queryEvent.size;
                                    EventsQ = queryEvent.docs;
                                    if (size == 1) {
                                        // Sets event data to the "Checked-In Events" page in "My Events"
                                        var thisEvent = EventsQ[0].data();
                                        eventName = thisEvent.name;
                                        eventDate = thisEvent.date;
                                        eventTime = thisEvent.time;
                                        document.getElementById("myEventInfo").innerHTML = eventName + " at " + eventDate + ", " + eventTime;
                                        document.getElementById("myEventQueue").innerHTML = querySize + "/3";
                                    }
                                })
                                .catch((error) => {
                                    console.log("Error adding my event info: ", error);
                                });
                            // Sets up display for user's past events if available
                            if (userDoc.data().pastEvents.length > 0) {
                                document.getElementById("pastEventHeading").style.display = "block";
                                displayPastEvents();
                                document.querySelector(".listPastEvents").style.display = "flex";
                            }
                        }
                    });
                }
            });
        });
}

// Display past events for users that have entered 1 or more events
function displayPastEvents() {
    firebase.auth().onAuthStateChanged(user => {
        // Checks if user is signed in (function only runs if user is signed in)
        if (user) {
            db.collection('users').doc(user.uid).get()
                .then(userDoc => {
                    // Sets template for past events
                    var pastEventsList = userDoc.data().pastEvents;
                    let CardTemplate = document.getElementById("pastEventTemplate");
                    pastEventsList.forEach(queryEvent => {
                        db.collection('events').doc(queryEvent).get()
                            .then(queryEvent => {
                                let pastEventCardGroup = document.getElementById("pastEventList");
                                let eventCard = CardTemplate.content.cloneNode(true);
                                // Sets card details to match the past event
                                eventCard.querySelector('.pastImg').src = `../images/${queryEvent.data().id}.jpg`;
                                eventCard.querySelector(".pastEvent").innerHTML = queryEvent.data().name;
                                eventCard.querySelector(".pastEventTime").innerHTML = queryEvent.data().date + " at " + queryEvent.data().time;
                                pastEventCardGroup.appendChild(eventCard);
                            })  
                    });
                });
        }
    });
}

// function displayClock() {
//     var refresh = 1000;
//     currentTime = setTimeout('displayClockTime()', refresh);
// }

// function displayClockTime() {
//     // var x = new Date();
//     // document.getElementById('clock').innerHTML = x;
//     // displayClock();
//     // var interval = setInterval(function () {
//     // },  60 * 1000);
//     // clearInterval(interval);

//     var x = new Date();
//     document.getElementById("currentTime").innerHTML = x.getMinutes();
//     displayClock();
//     var interval = setInterval(function () {
//     },  60 * 1000);
//     clearInterval(interval);
// }

// Update check in status for all users if current event queue is full (3/3)

// Function to update check in status
function updateCheckInStatus(eID) {
    // Gets event document from "events" collection using EventID (eID) parameter
    db.collection('events').doc(eID)
        .get()
        .then(eDoc => {
            const eventID = eDoc.data().id;
            db.collection('users')
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(function (userDoc) {
                        const userCurrEvent = userDoc.data().currentevent;
                        // Checks if the user is associated with the current event
                        if (userCurrEvent == eventID) {
                            // If user is associated, their status is updated
                            db.collection('users').doc(userDoc.id)
                                .update({
                                    status: "Enter Now"
                                });
                        }
                    })
                })
        });
    
    setTimeout(function() { 
        if (!alert('YOU MAY ENTER NOW!')) {
            window.location.replace("/my-events/");
        }
    }, 1000);
}

// Function to update time
function updateTime() {
    let now = new Date();
    var m = now.getMinutes();
    var s = now.getSeconds();
    // document.getElementById("clock").innerHTML = "Minutes: " + m + " Seconds: " + s;
    // document.getElementById("currentMin").innerHTML = m;
    // document.getElementById("currentSec").innerHTML = s;
}

setInterval(updateQueueSize, 1000);

// Function to update queue size
function updateQueueSize() {
    const docID = localStorage.getItem('permanentEventID');
    var currentQueueSize;
    db.collection('events').doc(docID).collection('queue')
        .get()
        .then(snap => {
            currentQueueSize = snap.size;
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    if (currentQueueSize != localStorage.getItem('queueSize')) {
                        if (!alert('Queue Has Been Updated!')) {
                            window.location.replace("/my-events/");
                        } 
                    } 
                }
            });
        });
}

// Batch manager function 
function batchManager() {
    const docID = localStorage.getItem('permanentEventID');
    var currentQueueSize;
    db.collection('events').doc(docID).collection('queue')
        .get()
        .then(snap => {
            currentQueueSize = snap.size;
            localStorage.setItem("queueSize", currentQueueSize);
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = user.uid;
                    db.collection('events').doc(docID).collection('queue').where("userID", "==", currentUser)
                        .get()
                        .then(queryEvent => {
                            size = queryEvent.size;
                            EventsQ = queryEvent.docs;
                            if (size == 1) {
                                var thisUserID = EventsQ[0].id;
                                currentUser.get()
                                    .then(userDoc => {
                                        updateBatch(docID, thisUserID);
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log("Cannot print check in time: ", error);
                        });
                }
            });
        });
}

// Function to update batch
function updateBatch(docID, thisUserID) {
    db.collection('events').doc(docID).collection('queue').doc(thisUserID)
        .get()
        .then(userDoc => {
            var myTime = userDoc.data().hereTime;
            var myTimeSplit = myTime.split(":");
            var x = new Date();
            var myCheckInTime = new Date(parseInt(x.getFullYear(), 10), (parseInt(x.getMonth(), 10)), parseInt(x.getDay(), 10), parseInt(myTimeSplit[0], 10), parseInt(myTimeSplit[1], 10), parseInt(myTimeSplit[2], 10));
            document.getElementById("myCheckTime").innerHTML = myCheckInTime;

            const myMin = myTimeSplit[1];
            localStorage.setItem("userMin", myMin);
        });
    validateBatchTime();
}

setInterval(validateBatchTime, 1000);

// Function to handle batches based on current time
function validateBatchTime() {
    var currentQueueSize = localStorage.getItem('queueSize');
    let x = new Date();
    const userMin = localStorage.getItem('userMin');
    var currentMin = x.getMinutes();
    var currentSec = x.getSeconds();
    var batchValue = 0;
    
    var currFloorValue = Math.floor(currentMin / 10) * 10;
    var currMinValidation = currentMin - currFloorValue;
    
    if (userMin > 9) {
        var floorValue = Math.floor(userMin / 10) * 10;
        batchValue = userMin - floorValue;
    } else {
        batchValue = userMin;
    }
    
    // Display wait time 
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get()
            .then(userDoc => {
                myStatus = userDoc.data().status;
                if (myStatus == 'Wait') {
                    document.getElementById('waitTimeCounter').style.display = 'block';
                    if (batchValue >= 0 && batchValue <= 4) {
                        if ((4 - currMinValidation) == 0) {
                            document.getElementById('waitTimeCount').innerHTML = (59 - currentSec) + " seconds";
                        } else {
                            document.getElementById('waitTimeCount').innerHTML = (4 - currMinValidation) + " minute(s) " + (59 - currentSec) + " seconds";
                        }
                    } else if (batchValue >= 5 && batchValue <= 9) {
                        if ((9 - currMinValidation) == 0) {
                            document.getElementById('waitTimeCount').innerHTML = (59 - currentSec) + " seconds";
                        } else {
                            document.getElementById('waitTimeCount').innerHTML = (9 - currMinValidation) + " minute(s) " + (59 - currentSec) + " seconds";
                        }
                    }
                }
            });
        }
    });

    // Checks to see if user should be in the first or second batch based on time of check-in and pushes into queue
    if ((batchValue >= 0 && batchValue <= 4) && (currMinValidation >= 0 && currMinValidation <= 4)) {
        console.log("You are in the first batch");
        if ((currentQueueSize == 3) || ((currMinValidation == 4) && (currentSec == 59))) {
            pushCheckinUser();
        }
    } else if ((batchValue >= 5 && batchValue <= 9) && (currMinValidation >= 5 && currMinValidation <= 9)) {
        console.log("You are in the second batch");
        if ((currentQueueSize == 3) || ((currMinValidation == 9) && (currentSec == 59))) {
            pushCheckinUser();
        }
    }
}

// Function to push user into queue by updating their status for the event
function pushCheckinUser() {
    const thisEventID = localStorage.getItem('permanentEventID');

    db.collection('users').get()
        .then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
                if (doc.data().status == "Wait") {
                    var userId = doc.id;
                    displayCurrentEventList(userId);
                    updateCheckInStatus(thisEventID);
                } else {
                    console.log("NOT REACHING!!");
                }
            });
        });
}

// Function to set a button that removes a user from queue
function enterEvent() {
    var btn = document.getElementById('enterEvent');
    btn.onclick = function() {
        removeUserFromQueue();
    }
}

// Function to remove user once the user clicks button to check in "I'm Here"
function removeUserFromQueue() {
    const eID = localStorage.getItem('permanentEventID');
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userID = user.uid;
            addUserEventInArray(userID, eID);
            db.collection('events').doc(eID).collection('queue').where("userID", "==", userID).get()
                .then(queryEvent => {
                    size = queryEvent.size;
                    EventsQ = queryEvent.docs;
                    if (size == 1) {
                        EventsQ[0].ref.delete();
                    }
                });

            db.collection('users').doc(userID).update({
                currentevent: "No Event",
                status: "Checked In"
            })
        }
    });
}

// Function to add event as array in user collection
function addUserEventInArray(userId, thisEvent) {
    db.collection('users').doc(userId).update({
        pastEvents: firebase.firestore.FieldValue.arrayUnion(thisEvent)
    }, {
        merge: true
    })
    .then(userDoc => {
        console.log("User Event Array Added!");
    })
}

// Function to create past event list from array in user collection
function displayCurrentEventList(userId) {
    db.collection('users').doc(userId).get()
        .then(userDoc => {
            myCurrEvent = userDoc.data().currentevent;
            db.collection('events').where("id", "==", myCurrEvent).get()
                .then(queryEvent => {
                    size = queryEvent.size;
                    EventsQ = queryEvent.docs;
                    if (size == 1) {
                        var thisEvent = EventsQ[0].data();
                        document.getElementById("listCurrEvents").style.display = "flex";

                        document.getElementById("currEventHeading").style.display = "block";
                        
                        var img = document.createElement("img");
                        img.src = "../images/" + thisEvent.id + ".jpg";
                        document.getElementById("currImg").appendChild(img);
                        
                        document.getElementById("currEvent").innerHTML = thisEvent.name;
                        document.getElementById("currEventTime").innerHTML = thisEvent.date + " at " + thisEvent.time;
                    }
                });
        });
}

// Google map widget loading
function mapLoad(address) {
    const apiKey = firebaseConfig.apiKey;
    const addressEnc = encodeURI(address)
    const addressURL = "https://www.google.com/maps/embed/v1/place?q="+ addressEnc + "&key=";
    const injectURL = addressURL + apiKey;

    iframe = document.getElementById("map-widget");

    iframe.setAttribute("src", injectURL);
}

/*********** NEXT STEPS ************/
/**
 * 1) Single events page populated from database (local session, grab event ID) // DONE
 * 2) Checked in event -> Create sub collection for currentQueue -> Should contain users and their ID // DONE
 * 3) My Events page -> Display queue (How many ppl in current batch of yours) ex. 2/5 in queue // DONE
 * 4) My Events page -> Display "Please Wait" button (disabled) // DONE
 * 5) User Collection (Checked in User) -> Update the status: "Wait"; // DONE
 * 6) Function for batchManager() -> Run a loop for every 90 seconds -> // DONE
 *          7) Add checked in event to checked in user (currentEvent: event1IDName);
 *          8) Check if there are 3 users in the batch // DONE
 *          9) If there are 3 users -> // DONE
 *                 10) Display a "Enter Now" button on My Events for all queued user // DONE
 *                 11) Reset the batch (timer and delete all users from current queue) // DONE
 *                 12) Updates user status: "Enter Now"; // DONE
 * 14) the button click callback function -> removes user from queue collection and updates status (individually not all users in the queue) // DONE
 * 15) after button clicked -> refresh -> display past event list -> instead of Enter Now status maybe change to No Event // DONE
 *
 * 
 * 13) if queue size == 3 -> alert change to user "YOU MAY ENTER NOW!" -> refresh -> display current event with button (DONT REMOVE USER OR UPDATE ANYTHING YET)
 * 
 * 
 * 
 * 
 * EX: 06:34:22 (Check In Time) -> 06:34:00 - 06:35:59 (thirdBatch)
 * minute/seconds if statements
 * for second digit minute with 0 replace with any integer from 0 to 5 (00 mins to 59mins) -> Has to be same from check in time values
 * if (00:00 to 01:59) {
 *      firstBatch = HH:M1:59;
 *      if(currentTime == firstBatch) {
 *          remove all checked in users in query;
 *          set those users status: 'Enter Now';
 *          display message to user -> "Please enter event now!";
 *      }
 * } else if (02:00 to 03:59) {
 *      secondBatch;
 * } else if (04:00 to 05:59) {
 *      thirdBatch;
 * } else if (06:00 to 07:59) {
 *      fourthBatch;
 * } else if (08:00 to 09:59) {
 *      fifthBatch;
 * }
 * 
 * If no my Events, display "You haven't checked in to any events yet! Go to Events to view our available events!"
 * If there is checked in events, display their queue
 * 
 */