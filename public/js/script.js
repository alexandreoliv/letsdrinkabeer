document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project2 JS imported successfully!");
  },
  false
);

// Google Maps configuration
function startMap() {
  
  const ironhackBerlin = {
  	lat: 52.52437,
  	lng: 13.41053
  };

  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 12,
      center: ironhackBerlin
    }
  );

  const alexHome = new google.maps.Marker({
    position: {
      lat: 52.55436280866809,
      lng: 13.3766352451393
    },
    map: map,
    title: "Alex home"
  });

  const ironhackBerlinMarker = new google.maps.Marker({
    position: {
      lat: ironhackBerlin.lat,
      lng: ironhackBerlin.lng
    },
    map: map,
    title: "Ironhack Berlin"
  });

  const brandenburgerTorMarker = new google.maps.Marker({
    position: {
      lat: 52.51642249057365,
      lng: 13.377630834676086
    },
    map: map,
    title: "Brandenburger Tor"
  });

}

startMap();