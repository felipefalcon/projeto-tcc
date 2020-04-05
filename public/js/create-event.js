	
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
					cachedEvent.img = imgLink;
					setCachedEvent(cachedEvent);
					$("#general-input-pic-reset-icon").css("display", "block");
					//addImgInUser(urlUpd, link, divImg);
				});
			}
		}
	
		$('#pic-input').on("change", function() {
			uploadImage(this, $("#img-event"));
		});
	
	});

	$("#btn-menu-back").click(function () {
		cacheAllInputs();
		if(JSON.stringify(cachedEvent) === JSON.stringify({})) return window.location.replace("./main-view.html");
		setTimeout(function(){
			Swal.fire({
				title: 'MUDANÇAS',
				html: "Você preencheu alguns campos, se você sair as mudanças serão perdidas.<br>Tem certeza que deseja sair?",
				padding: "8px",
				confirmButtonText: 'OK',
				cancelButtonText: 'NÃO',
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
			}).then((data) => {
				if(data.value){
					cachedEvent = undefined;
					window.sessionStorage.removeItem('cachedEvent');
					window.location.replace("./main-view.html");
				}
			});
		}, 100);
	});

	$("#btn-criar-evento").click(function () { createEvent(); });

	$("#local-input").click(function(){
		$("#local-input").blur();
		if(cachedEvent.address) {
			setTimeout(function(){
				Swal.fire({
					title: 'LIMPAR?',
					text: "Deseja resetar o campo de endereço?",
					padding: "8px",
					confirmButtonText: 'OK',
					cancelButtonText: 'NÃO',
					allowOutsideClick: false,
					width: "80%",
					showCancelButton: true,
				}).then((data) => {
					if(data.value){
						cachedEvent.address = undefined;
						setCachedEvent(cachedEvent);
						$("#local-input").css("opacity", "0.2");
						$("#local-input").val("Clique para definir");
						$("#map-button").css({"color":"#ebd7b1", "border": "2px solid #ebd7b1", "opacity": "0.3"});
					}
				});
			}, 100);
		}else{

			cacheAllInputs();
			window.location.href = "./set-map.html";	
		}
	});

	function cacheAllInputs(){
		if($("#title-input").val().length > 0) cachedEvent.title = $("#title-input").val();
		if($("#data-input").val().length > 0) cachedEvent.data = $("#data-input").val();
		if($("#horario-input").val().length > 0) cachedEvent.horario = $("#horario-input").val();
		if($("#descricao-input").val().length > 0) cachedEvent.descricao = $("#descricao-input").val();
		let tagsArray = [];
		for(var i = 1; i <= 6; ++i){
			if($("#tag-"+i).is(':checked')) tagsArray.push(i);
		}
		if(tagsArray.length > 0) cachedEvent.tags = tagsArray;
		setCachedEvent(cachedEvent);
	}

	function createEvent() {
		cacheAllInputs();
		if(jQuery.isEmptyObject(cachedEvent) || !("title" in cachedEvent) || !("address" in cachedEvent)
		|| !("data" in cachedEvent) || !("horario" in cachedEvent) || !("descricao" in cachedEvent)
		) return alerts.emptyInputs();

		loading();

		$.get("./crt-event", {
			_id: userInfo._id,
			evento: cachedEvent
		}).done(function (data) {
			loading('hide');
			if (data == null || data == "undefined") {
				alert("Deu merda");
			} else {
				alerts.registerEventSuccess();
				setTimeout(function () {
					cachedEvent = undefined;
					window.sessionStorage.removeItem('cachedEvent');
					window.location.replace("./main-view.html");
				}, 8000);
			}
		});
	}

	$("#general-input-pic-reset-icon").click(function(){
		setTimeout(function(){
			Swal.fire({
				title: 'LIMPAR?',
				text: "Deseja resetar a imagem para a padrão?",
				padding: "8px",
				confirmButtonText: 'OK',
				cancelButtonText: 'NÃO',
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
			}).then((data) => {
				if(data.value){
					cachedEvent.img = undefined;
					setCachedEvent(cachedEvent);
					$("#general-input-pic-reset-icon").css("display", "none");
					$("#img-event").css("background-image", "url('https://blog.egestor.com.br/wp-content/uploads/2017/04/evento.jpeg')");
				}
			});
		}, 100);
	});

	function loadCachedEvent(){
		getServerDate();
		if(JSON.stringify(cachedEvent) === JSON.stringify({})) return;
		if(cachedEvent.title) $("#title-input").val(cachedEvent.title);
		if(cachedEvent.data) $("#data-input").val(cachedEvent.data);
		if(cachedEvent.horario) $("#horario-input").val(cachedEvent.horario);
		if(cachedEvent.descricao) $("#descricao-input").val(cachedEvent.descricao);
		if(cachedEvent.address) {
			$("#local-input").css("opacity", "1");
			$("#local-input").val(cachedEvent.address.road);
			$("#map-button").css({"color":"#4dcc80", "border": "2px solid #4dcc80", "opacity": "1"});
		}
		if(cachedEvent.tags) {
			let lengthTagsArray = cachedEvent.tags.length;
			for(var i = 0; i <= lengthTagsArray; ++i){
				$("#tag-"+cachedEvent.tags[i]).prop( "checked", true );
			}
		}
		if(cachedEvent.img) {
			$("#general-input-pic-reset-icon").css("display", "block");
			$("#img-event").css("background-image", "url("+cachedEvent.img+")");
		}
		let dateString = todayDate.getFullYear()+"-"+((todayDate.getMonth()+1) < 10 ? "0"+(todayDate.getMonth()+1) : (todayDate.getMonth()+1))+"-"+((todayDate.getDate()) < 10 ? "0"+(todayDate.getDate()) : (todayDate.getDate()));
		$("#data-input").attr("min", dateString);
	}

	loadCachedEvent();


