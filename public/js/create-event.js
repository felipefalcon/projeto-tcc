	
	var imgLink = "";
	
	$("document").ready(function () {
		function uploadImage(elmnt){
			var $files = $(elmnt).get(0).files;
	
			if ($files.length) {
	
				if ($files[0].size > $(elmnt).data("max-size") * 1024) {
					alert("Arquivo muito pesado.");
					return false;
				}

				$('#img-event').animate({
					opacity: 0.1
				}, 1000, function(){
					$('#img-event').addClass("loading-img");
				});
				
				$.ajax(uploadImgur($files[0])).done(function(response) {
					var res = JSON.parse(response);
					var link = res.data.link.replace(/^http:\/\//i, 'https://');
					imgLink = link;
					$('#img-event').animate({
						opacity: 0
					}, 1000, function(){
						$('#img-event').css("background-image", "url("+imgLink+")");
						$('#img-event').animate({
							opacity: 1
						}, 1000, function(){
							$('#img-event').removeClass("loading-img");
							cachedEvent.img = imgLink;
							setCachedEvent(cachedEvent);
							$("#general-input-pic-reset-icon").css("display", "block");
						});
					});
				});
			}
		}
	
		$('#pic-input').on("change", function() {
			uploadImage(this);
		});
	
	});

	$("#btn-menu-back").click(function () {
		cacheAllInputs();
		if(JSON.stringify(cachedEvent) === JSON.stringify({})) return window.location.replace("./main-view.html");
		setTimeout(function(){
			Swal.fire({
				title: 'MUDANÇAS',
				html: "Se você sair as mudanças serão perdidas.<br>Tem certeza que deseja sair?",
				padding: "8px",
				confirmButtonText: 'OK',
				cancelButtonText: 'NÃO',
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
			}).then((data) => {
				if(data.value){
					if(configParams.upd_event){
						$.get(nodeHost+"get-event", { _id: cachedEvent._id}).done(function (data) {
							if (isNullOrUndefined(data)) {
								console.log("Deu merda");
							}else {
								cachedEvent = data;
								setCachedEvent(cachedEvent);
								configParams.upd_event = undefined;
								setConfigParams(configParams);
								window.location.replace("./view-event.html");
							}
						});
					}else{
						cachedEvent = undefined;
						window.sessionStorage.removeItem('cachedEvent');
						window.location.replace("./main-view.html");
					}
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

		let nameService = "crt-event";
		if(configParams.upd_event) nameService = "upd-event";

		$.get(nodeHost + nameService, {_id: userInfo._id, evento: cachedEvent})
		.done(function (data) {
			loading('hide');
			if (isNullOrUndefined(data)) {
				alerts.errorServer();
			} else {
				if(configParams.upd_event){
					alerts.updateEventSuccess();
					setTimeout(function () {
						cachedEvent = data;
						setCachedEvent(cachedEvent);
						configParams.upd_event = undefined;
						setConfigParams(configParams);
						window.location.replace("./view-event.html");
					}, 6000);
				}else{
					alerts.registerEventSuccess();
					setTimeout(function () {
						cachedEvent = undefined;
						window.sessionStorage.removeItem('cachedEvent');
						window.location.replace("./main-view.html");
					}, 8000);
				}
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
		if(configParams.upd_event){
			$("#btn-criar-evento").val("ATUALIZAR");
		}
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


