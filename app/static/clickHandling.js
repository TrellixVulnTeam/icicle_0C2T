function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup("This is a fucking snowy road, brah!");
    }
}


var veg2 = {
"type": "Feature", "properties": { "Name": "127.2", "description": null, "altitudeMode": "clampToGround", "tessellate": 1, "KOPIDATO": "27.02.2019", "METER_TIL": "59", "VEGSTATUS": "G", "VEGKATEGOR": "F", "KOMM": "5001", "NOYAKTIGHE": "33", "VEGNUMMER": "6686", "VKJORFLT": "", "HOVEDPARSE": "150", "LBVKLASSE": "0", "VERIFDATO": "", "SYNBARHET": "0", "GATENAVN": "", "GATENR": "0", "MEDIUM": "", "MALEMETODE": "24", "VFRADATO": "01.01.2018", "MAX_AVVIK": "0", "FID": "20724", "OBJTYPE": "GangSykkelVegSenterlinje", "METER_FRA": "3", "OMRADEID": "5001", "Field_1": "127.2", "ORGDATVERT": "NVDB", "H_NOYAKTIG": "16", "DATFGSTDAT": "10.05.2008", "TRAFIKKREG": "", "H_MALEMETO": "24", "KOORDH": "127.2" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 10.381505020420116, 63.370350842486516 ], [ 10.381538241276283, 63.370356055689456 ], [ 10.381557909565982, 63.370335920920496 ], [ 10.381643455006531, 63.370241306782233 ], [ 10.381700435257429, 63.370182275587617 ], [ 10.381760316385684, 63.370125136855755 ], [ 10.381824856858103, 63.370073904191514 ], [ 10.381894299175201, 63.370028315678177 ], [ 10.382019429279548, 63.369954137886495 ], [ 10.382059726473384, 63.369934042148643 ] ] ] } };


// veg
L.geoJSON(veg, {
    onEachFeature: onEachFeature
}).addTo(mymap);
//
// new L.geoJson(veg).addTo(mymap);
