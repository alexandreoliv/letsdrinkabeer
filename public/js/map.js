// document.addEventListener(
// 	"DOMContentLoaded",
//   	() => {
//     	// console.log("project2 JS imported successfully!");
//   	},
//   	false
// );

// Google Maps configuration

function initMap() {
  	const map = new google.maps.Map(document.getElementById("map"), {
    	zoom: 12,
    	//center: { lat: 52.520008, lng: 13.404954 }, // Berlin
  	});
	
	axios
		.get('/getlocations')
		.then(response => {
			// console.log('Locations: ', response.data.locations);

			// creates all the markers on the map
			var bounds = new google.maps.LatLngBounds(); //// NEW CODE
			const locations = response.data.locations;
			for (let i = 0; i < locations.length; i++) {
				let data = locations[i]
				let myLatlng = new google.maps.LatLng(data.position.lat, data.position.lng);
				let marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: data.name,
					icon: {                             
						url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
					}
				});

			  //extend the bounds to include each marker's position
			  bounds.extend(marker.position);
			}	

			//now fit the map to the newly inclusive bounds
			map.fitBounds(bounds);

			function letsDrinkABeer() {

				const directionsService = new google.maps.DirectionsService();
				const directionsRenderer = new google.maps.DirectionsRenderer();
		  
			  	directionsRenderer.setMap(map);
				directionsRenderer.setPanel(document.getElementById("sidebar"));
				const control = document.getElementById("floating-panel");
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

				let latArray = [];
				let lngArray = [];
				let distancesY = [];
				let distancesX = [];
				let latSum = 0;
				let lngSum = 0;
				let latAvg;
				let lngAvg;
				let distanceTotal = [];
				let mean = 0;
				let stdDev = 0;
				let locationsNew = [ ];

				function getCenter(arr) {
						latSum = 0;
						latArray = [ ];
						lngSum = 0;
						lngArray = [ ];
					for (let location of arr) {
						//console.log(location.position.lat);
						latSum += location.position.lat;
						latArray.push(location.position.lat);
						lngSum += location.position.lng;
						lngArray.push(location.position.lng);
					}
					latAvg = latSum / arr.length;
					lngAvg = lngSum / arr.length;
					center = [latAvg, lngAvg];
					return center;
				}

				function getDistancesFromCenter(arr) {
					distancesY = [];
					distancesX = [];
					distanceTotal = [];

					for (let lat of latArray)
						distancesY.push(Math.abs(latAvg - lat));
					for (let lng of lngArray)
						distancesX.push(Math.abs(lngAvg - lng));
					for (let i = 0; i < arr.length; i++)
						distanceTotal.push(Math.sqrt(distancesX[i]**2 + distancesY[i]**2))
					
					console.log('distanceTotal: ', distanceTotal);
					const n = distanceTotal.length;
					mean = distanceTotal.reduce((a, b) => a + b) / n;
					stdDev = Math.sqrt(distanceTotal.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
					console.log('stdDev: ', stdDev);
					console.log('mean: ', mean);
				}

				function getFinalCenter() {
					locationsNew = [ ];
					console.log('locations: ', locations)
					for (let i = 0; i < locations.length; i++)
						if (Math.abs(distanceTotal[i] - mean) <= stdDev) // if distance from this location to the potencial center is less than (2 * standard deviation), keep the location
							locationsNew.push(locations[i]);
						console.log('locationsNew: ', locationsNew);
					return getCenter(locationsNew);
				}

				let potentialCenter = getCenter(locations);
				console.log(`Potential Center at ${potentialCenter[0]}, ${potentialCenter[1]}`)

				let potentialMarker = new google.maps.Marker({
					position: {
						lat: potentialCenter[0],
						lng: potentialCenter[1]
					},
					map: map,
					title: 'Potential Center',
					icon: {                             
						url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
					}
				});

				getDistancesFromCenter(locations);

				let finalCenter = getFinalCenter();
				console.log(`Final Center at ${finalCenter[0]}, ${finalCenter[1]}`)

				let finalMarker = new google.maps.Marker({
					position: {
						lat: finalCenter[0],
						lng: finalCenter[1]
					},
					map: map,
					title: 'Final Center',
					icon: {                             
						url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
					}
				});

				getDistancesFromCenter(locationsNew);

				map.panTo({ lat: finalCenter[0], lng: finalCenter[1] });
				map.setZoom(16);

				let service = new google.maps.places.PlacesService(map);
				service.nearbySearch({
					location : { lat: finalCenter[0], lng: finalCenter[1] },
					radius : 500,
					type : [ 'bar' ]
				}, callback);
	
				function callback(results, status) {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						const displayBars = document.getElementById("display-bars");
						displayBars.innerHTML = `<p style="color: red">NEARY BARS:</p>`;
						console.log('nearby bars: ', results);
						for (var i = 0; i < results.length; i++) {
							createMarker(results[i]);
							displayBarInfo(results[i], displayBars);
						}
					}
				}

				function createMarker(place) {
					var placeLoc = place.geometry.location;
					var marker = new google.maps.Marker({
						map : map,
						position : place.geometry.location,
						title : place.name,
						icon: {                             
							url: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
							scaledSize: new google.maps.Size(25, 25)
						}
					});
		
					// google.maps.event.addListener(marker, 'click', function() {
					// 	const infowindow = new google.maps.InfoWindow();
					// 	infowindow.setContent(place.name);
					// 	infowindow.open(map, this);
					// });
				}

				function displayBarInfo(bar, displayBars) {
					// sometimes there's no rating for a place so the rating was displayed as "undefined". The code below shows an empty string instead
					let rating;
					if (bar.rating)
						rating = bar.rating;
					else
						rating = '';

					displayBars.innerHTML += `
					<div id="bar">
					<a id="bar-link" href="https://maps.google.com/maps?q=loc:${bar.name}, Berlin" target="_blank">${bar.name}</a> | Rating: ${rating}</p>
					</div>
					`;
				}

				// new code for updating the menu so that you can calculate your route to the center point:
				let menuEnd =  document.getElementById('end');
				let option = document.createElement('option')
				option.setAttribute('value','Choriner Str. 52, 10435 Berlin'); // fake address, need to do this dinamically
				option.innerHTML = 'Final Center';
				menuEnd.appendChild(option);
				// end of new code for updating the menu so that you can calculate your route to the center point

				const onChangeHandler = function () {
					calculateAndDisplayRoute(directionsService, directionsRenderer);
				};
			
				document.getElementById("start").addEventListener("change", onChangeHandler);
				document.getElementById("end").addEventListener("change", onChangeHandler);

			}

			document.getElementById("btn-beer").addEventListener("click", letsDrinkABeer, {once : true});
		})	
	
		.catch(err => { console.log(err); })
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
    		travelMode: google.maps.TravelMode.WALKING,
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