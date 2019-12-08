	$("document").ready(function () {

		handlePermission();

	});

	function handlePermission() {
		navigator.permissions.query({name:'geolocation'}).then(function(result) {
		  if (result.state == 'granted') {
			navigator.geolocation.getCurrentPosition(sucessGeoLocation, failedGeoLocation);
		  } else if (result.state == 'denied') {
			alert("Você não deu permissão para acessar sua localização");
		  }
		});
	}

	function sucessGeoLocation(posicao) {
		$.get("https://nominatim.openstreetmap.org/reverse?lat=" + posicao.coords.latitude + "&lon=" + posicao.coords.longitude + "&format=json").done(function (data) {
			var location = {};
			location = data.address;
			location.region = data.display_name.split(",")[8];
			$.get("./upd-user-location", {
				email: userInfo.email,
				location: location
			}).done(function (data) {
				if (data == null || data == "undefined") {
					console.log("Deu merda");
				} else {
					$.get("./get-user", {
						email: userInfo.email
					}).done(function (data) {
						if (data == null || data == "undefined") {
							console.log("Deu merda");
						} else {
							setUserCache(data);
							getProfile();
						}
					});
				}
				loading('hide');
			});
		});

	}

	function failedGeoLocation(error) {
		alert("Ocorreu alguma falha a acessar a localização");
	}
