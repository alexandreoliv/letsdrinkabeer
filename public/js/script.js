document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project2 JS imported successfully!");
  },
  false
);

// Google Maps configuration

// const berlin = new google.maps.LatLng(52.520008, 13.404954);

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 52.520008, lng: 13.404954 },
  });
  directionsRenderer.setMap(map);

  const firstRandomHome = new google.maps.Marker({
    position: {
      lat: 52.54236280866809,
      lng: 13.3802352451393
    },
    map: map,
    title: "First random home"
  });

  const secondRandomHome = new google.maps.Marker({
    position: {
      lat: 52.52242249057365,
      lng: 13.357630834676086
    },
    map: map,
    title: "Second random home"
  });

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("start").addEventListener("change", onChangeHandler);
  document.getElementById("end").addEventListener("change", onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
  .route({
    origin: {
      query: document.getElementById("start").value,
    },
    destination: {
      query: document.getElementById("end").value,
    },
    travelMode: google.maps.TravelMode.BICYCLING,
  })
  .then((response) => {
    directionsRenderer.setDirections(response);
  })
  .catch((e) => window.alert("Directions request failed due to " + status));
}

// geocoder for translating addresses into coordinates:

// const geocoder = new google.maps.Geocoder();

// document.getElementById('submit').addEventListener('click', () => {
//   geocodeAddress(geocoder, map);
// });

// function geocodeAddress(geocoder, resultsMap) {
//   const address = document.getElementById('address').value;

//   geocoder.geocode({ address: address }, (results, status) => {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//       let marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location
//       });
//       document.getElementById('latitude').value = results[0].geometry.location.lat();
//       document.getElementById('longitude').value = results[0].geometry.location.lng();
//     } else {
//       console.log(`Geocode was not successful for the following reason: ${status}`);
//     }
//   });
// }