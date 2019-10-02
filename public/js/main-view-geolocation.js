	$("document").ready(function () {

		if ("geolocation" in navigator) {
			/* geolocation is available */
			alert("Geolocation funciona aqui");
		  } else {
			alert("I'm sorry, but geolocation services are not supported by your browser.");
		  }


		navigator.geolocation.getCurrentPosition(function (posicao) {
			//var url = "http://nominatim.openstreetmap.org/reverse?lat="+posicao.coords.latitude+"&lon="+posicao.coords.longitude+"&format=json&json_callback=preencherDados";
			$.get("https://nominatim.openstreetmap.org/reverse?lat=" + posicao.coords.latitude + "&lon=" + posicao.coords.longitude + "&format=json").done(function (data) {
				var location = {};
				location = data.address;
				location.region = data.display_name.split(",")[8];
				$.get("./upd-user-location", {
					email: 	userInfo.email,
					location: location
				}).done(function( data ) {
					if(data == null || data == "undefined"){
						console.log("Deu merda");
					}else{
						console.log("Atualizou");
						$.get("./get-user", {
							email: userInfo.email
						}).done(function( data ) {
							if(data == null || data == "undefined"){
								console.log("Deu merda");
							}else{
								setUserCache(data);
								getProfile();
							}
						});
					}
					loading('hide');
				});
			});
		});

	});
