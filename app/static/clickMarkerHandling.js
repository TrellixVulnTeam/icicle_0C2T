// Script for adding marker on map click
mymap.on('click', onMapClick);
//Clicked holder oversikt over markers
var clicked = [];
var clickedJson = [];
var cars = [
    { "make":"Porsche", "model":"911S" },
    { "make":"Mercedes-Benz", "model":"220SE" },
    { "make":"Jaguar","model": "Mark VII" }
];

function onMapClick(e) {
    // Lager først et feature der clicket skjer.
    var coordinates = [e.latlng.lat, e.latlng.lng]
    coordinates = "" + coordinates


    var geojsonFeature = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        }
    }

    var marker;
    var str ="";
    //Definer heading gitt om det er første eller andre marker
    if (clicked.length == 0){ str = "From"} else {str = "To"};


    marker = L.geoJson(geojsonFeature, {
        pointToLayer: function(feature, latlng){
            marker = L.marker(e.latlng, {
                title: "Resource Location",
                alt: "Resource Location",
                riseOnHover: true,
                draggable: true,
            }).bindPopup("<head>" + str +"</head><br><input type='button' value='Delete this marker' class='marker-delete-button'/>"
                + "<br><input type='button' value ='Find Shortest Path' class='shortest-path-button'/>");

            marker.on("popupopen", onPopupOpen);

            // Skjekker om det finnes to markers fra før; hvis ja; slett den forrige "end"-markern
            if (clicked.length > 1) {
                var m = clicked[1];
                mymap.removeLayer(m);
                clickedJson.pop();
                clicked.pop();
            }

            clicked.push(marker);
            clickedJson.push(geojsonFeature);
            return marker;
        }
    }).addTo(mymap);
}

// Function to handle delete as well as other events on marker popup open



function onPopupOpen() {

    var tempMarker = this;

    // To remove marker on click of delete button in the popup of marker
    // Foreløpig slettes begge markers når man klikker
    $(".marker-delete-button:visible").click(function () {
        mymap.removeLayer(clicked[0]);
        mymap.removeLayer(clicked[1]);
        clicked = [];
        clickedJson = [];
    });

    $(".shortest-path-button:visible").click(function () {
        // ajax the JSON to the server

        console.log((clickedJson[0]))
        $.ajax({
            type: 'POST',
            // dataType: 'json',
            contentType: 'application/json',
            url: '/map.html',
            data: JSON.stringify(clickedJson[0]),
            success: function(d) {
                console.log("SUCCESS");
                console.log(d)
            },
            error: function() {
                alert('error when giving coordinates to backend');
            }
        })
    });
}