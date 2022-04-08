$(document).ready(function () {
    // Get profile in accounts page
    getProfile();

    // Update profile in accounts page after save changes
    updateProfile();
});

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
                })
        }
    })
}

// Saves new information submitted by the user to their user document in the users collection
function updateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const form = document.querySelector("#profileForm");

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