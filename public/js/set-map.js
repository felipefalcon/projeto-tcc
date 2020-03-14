	// Desativado por enquanto
	$("document").ready(function () {
		navigator.geolocation.getCurrentPosition(sucessGeoLocation, function(){});
	});

	function sucessGeoLocation(posicao) {
		marker.setLngLat([posicao.coords.longitude, posicao.coords.latitude]);

			map.flyTo({
				center: [posicao.coords.longitude, posicao.coords.latitude],
				pitch: 45,
				bearing: -45,
				speed: 0.1,
				zoom: 12
		});
	}

	mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXBlZmFsY29uIiwiYSI6ImNrNHZoNHlocTN3N3MzbnE4eXpnMG5wMnUifQ.qnAXlW-__Z9B8SfszJgioA';
	var map = new mapboxgl.Map({
	style: 'mapbox://styles/felipefalcon/ck7mo2d1a072i1ipkjmird6m5?optimize=true',
	center: [0, 0],
	container: 'map',
	antialias: false,
	minZoom: 16
	});

// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
// Insert the layer beneath any symbol layer.
var layers = map.getStyle().layers;

var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}
});

var coordinatesGeocoder = function(query) {
// match anything which looks like a decimal degrees coordinate pair
var matches = query.match(
/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
);
if (!matches) {
return null;
}

function coordinateFeature(lng, lat) {
return {
center: [lng, lat],
geometry: {
type: 'Point',
coordinates: [lng, lat]
},
place_name: 'Lat: ' + lat + ' Lng: ' + lng,
place_type: ['coordinate'],
properties: {},
type: 'Feature'
};
}

var coord1 = Number(matches[1]);
var coord2 = Number(matches[2]);
var geocodes = [];

if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
geocodes.push(coordinateFeature(coord1, coord2));
}

if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
geocodes.push(coordinateFeature(coord2, coord1));
}

if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
geocodes.push(coordinateFeature(coord1, coord2));
geocodes.push(coordinateFeature(coord2, coord1));
}

return geocodes;
};

map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
localGeocoder: coordinatesGeocoder,
zoom: 4,
placeholder: 'Informe o endereço',
mapboxgl: mapboxgl,
language: 'pt-BR',
marker: marker
})
);

var marker = new mapboxgl.Marker({
draggable: true,
color: 'red'
})
.setLngLat([0, 0])
.addTo(map);

function onDragEnd() {
var lngLat = marker.getLngLat();
coordinates.style.display = 'block';
coordinates.innerHTML =
'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
}

map.on('click', function(e) {
marker.setLngLat(e.lngLat.wrap());

});

marker.on('dragend', onDragEnd);
