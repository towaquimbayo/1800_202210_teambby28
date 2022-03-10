const address = "3700+Willingdon+Ave,+Burnaby,+BC+V5G+3H2" // for now since the single-event view is hardcoded, so is this address
const addressURL = "https://www.google.com/maps/embed/v1/place?q="+ address + "&key="
const apiKey = firebaseConfig.apiKey;

const injectURL = addressURL + apiKey;

function mapLoad() {
    iframe = document.getElementById("map-widget");

    iframe.setAttribute("src", injectURL);
}

console.log(injectURL);

mapLoad();