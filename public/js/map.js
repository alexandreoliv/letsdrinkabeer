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
    	// center: { lat: 52.520008, lng: 13.404954 }, // Berlin
  	});
	
	axios
		.get('/getlocations')
		.then(response => {
			// creates all the markers on the map
			const bounds = new google.maps.LatLngBounds(); // markers' boundaries
			const locations = response.data.locations;
			const geocoder = new google.maps.Geocoder();

			for (let i = 0; i < locations.length; i++) {
				let data = locations[i]
				let myLatLng;

				function findLatLng(address, geocoder, map) {
					return new Promise(function(resolve, reject) {
						geocoder.geocode({'address': address}, function(results, status) {
							if (status === 'OK') {
								resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
							}
						})
					})
				} 

				function getPoints(geocoder,map) {
					let locationsArray = [];
					for(let i = 0; i < locations.length; i++){
						locationsArray.push(findLatLng(locations[i].address, geocoder, map))
					}
					return locationsArray // array of promises
				}
				
				let locationsArray = getPoints(geocoder,map)
				
				Promise.all(locationsArray)     
				.then(function(positions){
					// you should have return values here when
					// all promises have resolved
					for (let i = 0; i < locations.length; i++) {
						myLatLng = {
							lat: positions[i][0],
							lng: positions[i][1]
						};
						let marker = new google.maps.Marker({
							position: myLatLng,
							map: map,
							title: data.name,
							icon: {                             
								url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
							}
						});
		
						// extends the bounds to include each marker's position
						bounds.extend(marker.position);
					}
					// now fits the map to the newly inclusive bounds
					map.fitBounds(bounds);

					function letsDrinkABeer() {
						// creates the floating panel
						const directionsService = new google.maps.DirectionsService();
						const directionsRenderer = new google.maps.DirectionsRenderer();
							directionsRenderer.setMap(map);
						directionsRenderer.setPanel(document.getElementById("sidebar"));
						const control = document.getElementById("floating-panel");
						map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
		
						// variables for calculating the final center
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
						let positionsNew = [ ];
		
						function getCenter(arr) {
							latSum = 0;
							latArray = [ ];
							lngSum = 0;
							lngArray = [ ];
							for (let location of arr) {
								latSum += location[0];
								latArray.push(location[0]);
								lngSum += location[1];
								lngArray.push(location[1]);
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
							positionsNew = [ ];
							for (let i = 0; i < locations.length; i++)
								if (Math.abs(distanceTotal[i] - mean) <= stdDev) // if distance from this location to the potential center is less than the standard deviation), keep the location
									positionsNew.push(positions[i]);
								console.log('positionsNew: ', positionsNew);
							return getCenter(positionsNew);
						}
		
						let potentialCenter = getCenter(positions);
						console.log(`Potential Center at ${potentialCenter[0]}, ${potentialCenter[1]}`)
		
						// adds the potential center to the map (yellow marker)
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
		
						// adds the final center to the map (green marker)
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
		
						getDistancesFromCenter(positionsNew);
		
						// >>>>>>>>>>>>>>>>>>> ----------------------- NEW CODE STARTING HERE ------------------------- <<<<<<<<<<<<<<<<<<<<<<<<<
						function calcRoute() {
							let request = {
								origin: 'Ironhack Berlin',
								destination: 'BrewDog Berlin Mitte',
								travelMode: 'WALKING'
							}
		
							directionsService.route(request, function(result, status) {
								if (status == 'OK')
									console.log('Distance is: ', result.routes[0].legs[0].distance.value / 1000, 'km');
							});
						}
						// >>>>>>>>>>>>>>>>>>> ----------------------- NEW CODE FINISHING HERE ------------------------- <<<<<<<<<<<<<<<<<<<<<<<<<
		
						calcRoute();
		
						map.panTo({ lat: finalCenter[0], lng: finalCenter[1] }); // changes the center of the map to the final center
						map.setZoom(16); // zooms out
		
						// finds the nearby bars
						let service = new google.maps.places.PlacesService(map);
						service.nearbySearch({
							location : { lat: finalCenter[0], lng: finalCenter[1] },
							radius : 500,
							type : [ 'bar' ]
						}, callback);
			
						// displays the nearby bars in the panel and also creates the markers
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
		
						// creates markers for the nearby bars
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
				
						}
		
						// displays the nearby bars in the panel
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
						
						// add listeners so that the floating panel distances can be calculated
						const onChangeHandler = function () {
							calculateAndDisplayRoute(directionsService, directionsRenderer);
						};
						document.getElementById("start").addEventListener("change", onChangeHandler);
						document.getElementById("end").addEventListener("change", onChangeHandler);
					}
		
					// listener for the 'Let's drink a beer' button
					document.getElementById("btn-beer").addEventListener("click", letsDrinkABeer, {once : true});
				})
			}
		
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