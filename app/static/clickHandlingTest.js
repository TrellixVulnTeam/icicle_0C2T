// Script for adding marker on map click
mymap.on('click', onMapClick);
//Clicked holder oversikt over markers

var myFeatures = [];

function getColor(d) {
    colors = ['#5df42f','#fbff30','#f49b42','#c94600'];

        return d > 9 ? colors[3] :
            d > 5  ? colors[2] :
                d > 2  ? colors[1]:
                    colors[0];

}

function myStyle(feature) {
	return {
	        fillColor: getColor(feature['properties']['SNOWLEVEL']),
	        weight: 4,
	        opacity: 1,
	        color: getColor(feature['properties']['SNOWLEVEL']),
	        dashArray: '',
	        fillOpacity: 0.7
	    };
}

function onMapClick(e) {
  // Lager først et feature der clicket skjer.
		var coordinates = [e.latlng.lat, e.latlng.lng]
    var geojsonFeature = {
        "type": "Feature",
        "properties": {},
        "geometry": {
                "type": "Point",
                "coordinates": coordinates
        }
    }



    $.ajax({
      type: 'POST',
      // dataType: 'json',
      contentType: 'application/json',
      url: '/map.html',
      data: JSON.stringify(geojsonFeature),
      success: function(d) {

        // SHOULD RETURN A COLLECTION OF geoJSON
        console.log("SUCCESS");

				if (d != "null") {
				L.geoJSON(d, {
						style: myStyle,
						onEachFeature: onEachFeature,
        }).addTo(mymap);
					info._div.innerHTML = '<h4>Retrieved ' + d[0]['properties']['GATENAVN'] +  ' from database</h4><br>' + '<br>Click on the road to change its features!'
				} else {
					info._div.innerHTML = '<h4>Could not find any nearby roads. Try again!</h4><br>' + '<br>if no road is visible, click on the map!<br>if a road is nearby of where you clicked, <br>the application will find it.'
				}
      },
      error: function() {
        alert('error when giving coordinates to backend');
      }
    });
  }

  function onEachFeature(feature, layer) {
      // does this feature have a property named popupContent?
			if (feature.properties) {
				if(feature.properties['GATENAVN'] != '') {
					s = "<h4>" + feature.properties['GATENAVN'] + "</h4>";
				} else {
					s = "<h4>Undefined street</h4>";
				}

				layer.bindPopup(s
					// + "</br><body>This road has a snow factor of " + feature.properties['snowfactor'] + " out of 10</body></br>"
					// + "<body>What do you want to do?</body>" +
				 + "</head><br><input type='button' value='Remove this street' class='marker-delete-button'/>"
				 + "</head><br><input type='button' value='Remove ALL streets' class='delete-all-button'/>"
				 // + "<br><input type='button' value ='Change snow factor' class='shortest-path-button'/>"
				 // + "<form action='/action_page.php'>Snowlevel: <input type='text' name='FirstName' value='1-10'><input type='submit' value='Submit'></form>"
			 + '<div class="slidecontainer">	<p>Amount of snow:</p><input type="range" min="1" max="10" value="'+ feature.properties.SNOWLEVEL +'"class="slider" id="myRange">'
		 	 + "</head><br><input type='button' value='Submit' class='submit-snow-button'/>")

			}
			layer.on("popupopen", onPopupOpen);
  }

	function onPopupOpen() {

		var feature = this;
		console.log(feature['feature']['properties']['GATENAVN']);
		if (feature['feature']['properties']['GATENAVN'].length === 0) {
			info._div.innerHTML = '<h4>You have chosen ' + 'a undefined street!' + '</h4><br>' + '<br>Do you agree with the amount of snow?<br>Go ahead! Change it!'
		} else {
			info._div.innerHTML = '<h4>You have chosen ' + feature['feature']['properties']['GATENAVN'] + '!</h4><br>' + '<br>Do you agree with the snowlevel?<br>Go ahead! Change it!'
		}
	    // To remove marker on click of delete button in the popup of marker
	    // Foreløpig slettes begge markers når man klikker
	    $(".marker-delete-button:visible").click(function () {
					// deleteAllSimilarFeatures(feature);
	        // mymap.removeLayer(feature);
					mymap.eachLayer(function(layer){
						try {
						  if(layer['feature']['properties']['GATENAVN'] == feature['feature']['properties']['GATENAVN']) {
								mymap.removeLayer(layer);
								info._div.innerHTML = '<h4>Successfully removed ' + feature['feature']['properties']['GATENAVN'] + '<br><br>Click on the map!<br>if a road is nearby of where you clicked, <br>the application will find it.'
							}
						}
						catch(err) {
						}
					});
	    });

			$(".delete-all-button:visible").click(function () {
					// deleteAllSimilarFeatures(feature);
	        // mymap.removeLayer(feature);
					mymap.eachLayer(function(layer){
						try {
							mymap.eachLayer(function (layer) {
				    	mymap.removeLayer(layer);
							});
							L.tileLayer(
							  'https://api.mapbox.com/styles/v1/oyvihaab/cjtspzc0r08qs1fq8dre2ib6v/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib3l2aWhhYWIiLCJhIjoiY2pycTA4bmRpMWcwdDN6bWY0dmVqdXpvYiJ9.aym7ak2CaZZGRY8IBLBtdQ', {
							    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
							    maxZoom: 18,
							    id: 'mapbox.streets',
							    accessToken: 'your.mapbox.access.token'
							}).addTo(mymap);
							info._div.innerHTML = '<h4>Successfully removed ' + '...all features<br>' + '<br>To retrieve the roads click on the map!<br>if a road is nearby of where you clicked, <br>the application will find it.'
						}
						catch(err) {
						}
					});
	    });

			$(".submit-snow-button:visible").click(function () {
				feature['feature']['properties']['SNOWLEVEL'] = myRange.value;
				$.ajax({
		      type: 'POST',
		      // dataType: 'json',
		      contentType: 'application/json',
		      url: '/snow',
		      data: JSON.stringify(feature['feature']),
		      success: function(d) {
		        console.log("SUCCESS");
						L.geoJSON(d, {
								style: myStyle,
								onEachFeature: onEachFeature,
		        }).addTo(mymap);

						info._div.innerHTML = '<h4>Successfully submitted the snowlevel!<br>' + '<br>Thanks for contributing to our icicle-data!'

		      },
		      error: function() {
		        alert('error when giving coordinates to backend');
		      }
		    });
			});
		}



		// getting all the markers at once
// function deleteAllSimilarFeatures(feature) {
// console.log(feature['feature']['properties']['GATENAVN']);
// 	var index;
// 	for (index = 0; index < myFeatures.length; ++index) {
// 		console.log(myFeatures[index]['properties']['GATENAVN']);
// 	    if (myFeatures[index]['properties']['GATENAVN'] == feature['feature']['properties']['GATENAVN']) {
// 				console.log("THROUGH")
// 				mymap.removeLayer(myFeatures[index]);
// 				// myFeatures.splice(index, 1);
// 			}
// 	}
// }
