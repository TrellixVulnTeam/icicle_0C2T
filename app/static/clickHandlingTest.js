// Script for adding marker on map click
mymap.on('click', onMapClick);
//Clicked holder oversikt over markers

var myFeatures = [];

function getColor(d) {
    console.log("HEYA")
    return d > 9 ? '#0570b0' :
        d > 8  ? '#045a8d' :
            d > 7  ? '#0570b0' :
                d > 6  ? '#3690c0' :
                    '#f7fcf5';
}

function myStyle(feature) {
    return {
        fillColor: getColor(feature.properties.SNOWLEVEL),
        weight: 2,
        opacity: 1,
        color: getColor(feature.properties.SNOWLEVEL),
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

            L.geoJSON(d, {
                myStyle: style,
                onEachFeature: onEachFeature
            }).addTo(mymap);

            mymap.eachLayer(function(layer){
                layer.togglePopup();
            })
        },
        error: function() {
            alert('error when giving coordinates to backend');
        }
    });
}

function onEachFeature(feature, layer) {
    myFeatures.push(feature);
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
            // + "<br><input type='button' value ='Change snow factor' class='shortest-path-button'/>"
            // + "<form action='/action_page.php'>Snowlevel: <input type='text' name='FirstName' value='1-10'><input type='submit' value='Submit'></form>"
            + '<div class="slidecontainer">	<p>Amount of snow:</p><input type="range" min="1" max="10" value="'+ feature.properties.SNOWLEVEL +'"class="slider" id="myRange">'
            + "</head><br><input type='button' value='Submit' class='submit-snow-button'/>")
    }
    layer.on("popupopen", onPopupOpen);
}

function onPopupOpen() {
    var feature = this;
    // To remove marker on click of delete button in the popup of marker
    // Foreløpig slettes begge markers når man klikker
    $(".marker-delete-button:visible").click(function () {
        // deleteAllSimilarFeatures(feature);
        // mymap.removeLayer(feature);
        mymap.eachLayer(function(layer){
            try {
                if(layer['feature']['properties']['GATENAVN'] == feature['feature']['properties']['GATENAVN']) {
                    mymap.removeLayer(layer);
                }
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
                myStyle(feature.feature);

            },
            error: function() {
                alert('error when giving coordinates to backend');
            }
        });
    });
}

function getColor(x) {
    return x < 3     ?    '#bd0026':
        x < 5     ?   '#f03b20':
            x < 7     ?   '#fd8d3c':
                x < 2000     ?   '#fecc5c':
                    '#ffffb2' ;
};


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