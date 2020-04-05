	
	$("document").ready(function () {
		if(configParams.show_map) {
			$("#set-location-btn").remove();
			$(".mapboxgl-ctrl-top-right").remove();
			let posicao = {
				coords: {
					longitude: cachedEvent.address.lng,
					latitude:  cachedEvent.address.lat
				}
			};
			return sucessGeoLocation(posicao);
		}
		navigator.geolocation.getCurrentPosition(sucessGeoLocation, function(){});
	});

	function sucessGeoLocation(posicao) {
		setTimeout(function(){
			marker.setLngLat([posicao.coords.longitude, posicao.coords.latitude]);
			addressMarker = {lng: posicao.coords.longitude, lat: posicao.coords.latitude};
		}, 1000);
		map.flyTo({
			center: [posicao.coords.longitude, posicao.coords.latitude],
			speed: 0.3,
			duration: 0,
			pitch: 45,
			bearing: -45,
			essential: true,
			antialias: false
		});
	}

	$("#btn-menu-back").click(function () {
		if(configParams.show_map){
			configParams.show_map = undefined;
			setConfigParams(configParams);
		}
		window.location.replace(document.referrer);
	});

	mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXBlZmFsY29uIiwiYSI6ImNrNHZoNHlocTN3N3MzbnE4eXpnMG5wMnUifQ.qnAXlW-__Z9B8SfszJgioA';
	var map = new mapboxgl.Map({
		style: 'mapbox://styles/felipefalcon/ck7mo2d1a072i1ipkjmird6m5?optimize=true',
		center: [0, 0],
		container: 'map',
		antialias: false,
		pitch: 45,
		bearing: -45,
		minZoom: 14,
		essential: true
	});

	if(!("show_map" in configParams)){
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
		placeholder: 'Procurar endereço',
		mapboxgl: mapboxgl,
		language: 'pt-BR',
		marker: marker
		})
		);
	}
	
	if(!("show_map" in configParams)){
		var marker = new mapboxgl.Marker({
			draggable: true,
			color: 'red'
			})
			.setLngLat([90, 90])
			.addTo(map);

		var addressMarker = 0;

		function onDragEnd() {
			addressMarker = marker.getLngLat();
		}
		
		map.on('click', function(e) {
		marker.setLngLat(e.lngLat.wrap());
			addressMarker = marker.getLngLat();
		});

		marker.on('dragend', onDragEnd);
	}else{
		var marker = new mapboxgl.Marker({
			draggable: false,
			color: 'red'
			})
			.setLngLat([90, 90])
			.setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false, className: "popup-map" })
    		.setHTML('<p>'+cachedEvent.address.road+" - "+cachedEvent.address.house_number+'</p>'))
			.addTo(map).togglePopup();
	}

	$("#map").animate({opacity: 1}, 1000);

	if(!( "show_map" in configParams)){
		$("#set-location-btn").animate({opacity: 1}, 2000);

		$("#set-location-btn").click(function(){
			if(!addressMarker) return;
			$.get("https://nominatim.openstreetmap.org/reverse?lat=" + addressMarker.lat + "&lon=" + addressMarker.lng + "&format=json").done(function (data) {	
			var valueInput = typeof data.address.house_number == "undefined" ? '' : data.address.house_number;
			var addressText = data.address.road;
			let addressForSave = data.address;
			addressForSave.lat = addressMarker.lat;
			addressForSave.lng = addressMarker.lng;
			// console.log(addressForSave);
			if(data.address.city_district) addressText += " - " + data.address.city_district
			if(data.address.city) addressText += "<br>" + data.address.city
			if(data.address.state) addressText += " - " + data.address.state
				setTimeout(function(){
					Swal.fire({
						title: 'CORRETO?',
						html: "<p style='line-height: 22px'>"+addressText+"</p><label style='color: #a570df'>Confirmar número</label>",
						input: 'number',
						inputValue: valueInput,
						padding: "8px",
						confirmButtonText: 'OK',
						cancelButtonText: 'NÃO',
						allowOutsideClick: false,
						width: "80%",
						showCancelButton: true,
						inputValidator: (value) => {
							addressForSave.house_number = value;
							//console.log(addressForSave);
							cachedEvent.address = addressForSave;
							setCachedEvent(cachedEvent);
							window.location.replace(document.referrer);
						}
					});
				}, 600);
			});
		});
	}