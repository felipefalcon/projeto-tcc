	// Desativado por enquanto
	$("document").ready(function () {
		navigator.geolocation.getCurrentPosition(sucessGeoLocation, failedGeoLocation);
	});

	function sucessGeoLocation(posicao) {
		$.get("https://nominatim.openstreetmap.org/reverse?lat=" + posicao.coords.latitude + "&lon=" + posicao.coords.longitude + "&format=json").done(function (data) {
			var location = data.address;
			console.log(data);
			location.region = data.display_name.split(",")[8];
			location.lat = posicao.coords.latitude;
			location.lng = posicao.coords.longitude;
			$.get("./upd-user-location", {
				email: userInfo.email,
				location: location
			}).done(function (data) {
				if (isNullOrUndefined(data)) {
					console.log("Deu merda");
				}
				//  else {
				// 	$.get(nodeHost+"get-user", {
				// 		email: userInfo.email
				// 	}).done(function (data) {
				// 		if (isNullOrUndefined(data)) {
				// 			console.log("Deu merda");
				// 		} else {
				// 			setUserCache(data);
				// 			getProfile();
				// 		}
				// 	});
				// }
				// loading('hide');
			});
		});

	}

	function failedGeoLocation(error) {

	}
