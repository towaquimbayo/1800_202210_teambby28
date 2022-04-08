$(document).ready(function () {
    // Display Event Cards
    displayEvents('events');

    // Display User Name in Event Listings
    insertName();
});

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