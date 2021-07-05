document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("rooms-app JS imported successfully!");
  },
  false
);

// Google Maps configuration
function startMap() {
  const berlin = {
  	lat: 52.52437,
  	lng: 13.41053};
  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 12,
      center: berlin
    }
  );
}
 
startMap();