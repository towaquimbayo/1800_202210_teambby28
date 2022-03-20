const address = encodeURI("10153 King George Blvd, Surrey, BC V3T 2W1") // for now since the single-event view is hardcoded, so is this address
const addressURL = "https://www.google.com/maps/embed/v1/place?q="+ address + "&key="
const apiKey = firebaseConfig.apiKey;

const injectURL = addressURL + apiKey;

function mapLoad() {
    iframe = document.getElementById("map-widget");

    iframe.setAttribute("src", injectURL);
}

console.log(injectURL);

mapLoad();