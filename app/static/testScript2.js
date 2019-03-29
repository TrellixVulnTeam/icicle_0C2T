var district_boundary = new L.geoJson();
district_boundary.addTo(mymap);

$.ajax({
dataType: "json",
url: "roads/Sti_linje.json",
success: function(data) {
    $(data.features).each(function(key, data) {
        district_boundary.addData(data);
    });
}
}).error(function() {});
