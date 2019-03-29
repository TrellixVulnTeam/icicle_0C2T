var mymap = L.map('mapid').setView([63.42  , 10.4], 4);

L.tileLayer(
    'https://api.mapbox.com/styles/v1/oyvihaab/cjtspzc0r08qs1fq8dre2ib6v/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib3l2aWhhYWIiLCJhIjoiY2pycTA4bmRpMWcwdDN6bWY0dmVqdXpvYiJ9.aym7ak2CaZZGRY8IBLBtdQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);