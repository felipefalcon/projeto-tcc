	$("document").ready(function () {

		
		navigator.geolocation.getCurrentPosition(sucessGeoLocation, failedGeoLocation);

	});

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
		switch(error.code) {
			case error.PERMISSION_DENIED:
			  alert("User denied the request for Geolocation.");
			  break;
			case error.POSITION_UNAVAILABLE:
				alert("Location information is unavailable.");
			  break;
			case error.TIMEOUT:
				alert("The request to get user location timed out.");
			  break;
			case error.UNKNOWN_ERROR:
				alert("An unknown error occurred.");
			  break;
		  }
	}
