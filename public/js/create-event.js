	
	var imgLink = "";
	
	$("document").ready(function () {
		function uploadImage(elmnt, divImg){
			var $files = $(elmnt).get(0).files;
	
			if ($files.length) {
	
				if ($files[0].size > $(elmnt).data("max-size") * 1024) {
					alert("Arquivo muito pesado.");
					return false;
				}
	
				var apiUrl = 'https://api.imgur.com/3/image';
				var apiKey = '4409588f10776f7';
	
				var settings = {
					async: true,
					crossDomain: true,
					processData: false,
					contentType: false,
					type: 'POST',
					url: apiUrl,
					headers: {
						Authorization: 'Client-ID ' + apiKey,
						Accept: 'application/json'
					},
					mimeType: 'multipart/form-data'
				};
	
				var formData = new FormData();
				formData.append("image", $files[0]);
				settings.data = formData;
			
				loading();
				
				$.ajax(settings).done(function(response) {
					var res = JSON.parse(response);
					var link = res.data.link.replace(/^http:\/\//i, 'https://');
					imgLink = link;
					divImg.css("background-image", "url("+imgLink+")");
					loading('hide');
					//addImgInUser(urlUpd, link, divImg);
				});
			}
		}
	
		$('#pic-input').on("change", function() {
			uploadImage(this, $("#img-event"),);
		});
	
	});

	$("#btn-criar-evento").click(function () { createEvent(); });

	function createEvent() {
		loading();

		var evento = {};
		evento.name = $("#title-input").val();
		evento.date = $("#data-input").val();
		evento.local = $("#local-input").val();
		evento.descricao = $("#descricao-input").val();
		evento.horario = $("#horario-input").val();
		console.log(evento)

		var userBasic = {};
		userBasic._id = userInfo._id;
		userBasic.name = userInfo.name;
		userBasic.main_pic = userInfo.pics_url.main_pic;

		$.get("./crt-event", {
			user: userBasic,
			evento: evento
		}).done(function (data) {
			if (data == null || data == "undefined") {
				alert("Deu merda");
			} else {
				alert("Evento criado!");
			}
			loading('hide');
		});
	}


