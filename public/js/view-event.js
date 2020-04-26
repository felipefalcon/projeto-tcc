
	let userParticipant = false;
	let userAuthor = false;

	$("#btn-menu-back").click(function () {
		window.sessionStorage.removeItem('cachedEvent');
		window.location.replace("./main-view.html");
	});

	$("#get-map").click(function(){
		configParams.show_map = true;
		setConfigParams(configParams);
		window.location.href = "./set-map.html";	
	});

	$("#set-interest").click(function(){
		setInterest();
	});

	function setInterest(){
		if(!userAuthor){
			if(!userParticipant){
				$("#set-interest").css("opacity", 1);
				$("#set-interest").animate({zoom: 1.1}, 300, function(){
					$("#set-interest").animate({zoom: 1}, 300);
					$("#set-interest").empty().append("<i class='fas fa-times' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -2px;'>DESISTO !</p>");
				});
				callService("set-interest-event");
			}else{
				$("#set-interest").css("opacity", 1);
				$("#set-interest").animate({zoom: 1.1}, 300, function(){
					$("#set-interest").animate({zoom: 1}, 300);
					$("#set-interest").animate({opacity: 0.7});
					$("#set-interest").empty().append("<i class='fas fa-hand-peace' style='font-size:32px;color:white'></i> <p id='text-set-interest'>BORA !</p>");
				});
				callService("set-desistence-event");
			}
		}else{
			$("#set-interest").css("opacity", 1);
			$("#set-interest").animate({zoom: 1.1}, 300, function(){
				$("#set-interest").animate({zoom: 1}, 300);
				$("#set-interest").animate({opacity: 0.7});
			});
			if(cachedEvent.participants.length == 0){
				setTimeout(function(){
					Swal.fire({
						title: 'EXCLUIR',
						html: "Não há nenhum usuário interessado ainda neste evento. Se você cancela-lo, você irá exclui-lo.<br> Você tem certeza que deseja excluir este evento?",
						padding: "8px",
						confirmButtonText: 'SIM',
						cancelButtonText: 'NÃO',
						allowOutsideClick: false,
						width: "80%",
						showCancelButton: true,
					}).then((data) => {
						if(data.value) {
							callService("del-event");
						}
					});
				}, 100);
			}else{
				setTimeout(function(){
					Swal.fire({
						title: 'CANCELAR',
						html: "Você tem certeza que deseja cancelar este evento?<br>Os usuários interessados receberão uma notificação com essa alteração.",
						padding: "8px",
						confirmButtonText: 'SIM',
						cancelButtonText: 'NÃO',
						allowOutsideClick: false,
						width: "80%",
						showCancelButton: true,
					}).then((data) => {
						if(data.value) callService("set-cancel-event");
					});
				}, 100);
			}
		}
	}

	function callService(serviceName){
		$.get(nodeHost+serviceName, {
			_id: 	cachedEvent._id,
			user_id: userInfo._id
		}).done(function(data) {
			if(isNullOrUndefined(data)){
				alerts.errorServer();
			}else{
				if(serviceName == "del-event") return $("#btn-menu-back").click();
				setCachedEvent(data);
				loadCachedEvent();
				// $("#main-body-div").LoadingOverlay('hide');
			}
		});
	}
	
	function verifyUserAlreadyInterested(event, user_id){
		if(event.status == 2){
			$("#menu-bottom-div-view-event").empty().append("<i class='fas fa-lock' style='font-size:32px;color:white'></i><p id='text-see-cancel'>CANCELADO !</p>");
			return;
		}

		if(event.status == 1){
			$("#menu-bottom-div-view-event").empty().append("<i class='fas fa-calendar-check' style='font-size:32px;color:white'></i><p id='text-see-cancel'>FINALIZADO !</p>");
			return;
		}

		if(event.author == userInfo._id){
			if(event.participants.length > 0){
				$("#menu-bottom-div-view-event").prepend("<div class='col-3 mx-auto' style='display: inline-block; max-width: 22% !important;'><button id='btn-view-all-users-events' type='button' class='general-button btns-prof mx-auto' style='opacity: 1;'><i class='fas fa-user-friends' style='font-size:21px;color:white;'></i></button></div>");
				$("#btn-view-all-users-events").click(function(){
					window.location.href = "./view-profiles.html";	
				});
			}

			$("#set-interest").remove();
			$("#separator-lbl").remove();
			$("#menu-bottom-div-view-event").append("<button style='max-width: 22% !important;' id='edit-event' type='button' class='general-button btns-prof col-3 mx-auto'><i class='fas fa-marker' style='font-size:32px;color:white'></i> <p id='text-edit-event'>EDITAR</p> </button>");
			$("#edit-event").css("display", "inline-block");
			$("#edit-event").click(function(){
				configParams.upd_event = true;
				setConfigParams(configParams);
				window.location.href = "./create-event.html";	
			});
			$("#edit-event").after("<button id='set-interest' type='button' class='general-button btns-prof col-3 mx-auto'></button>");
			$("#set-interest").empty().append("<i class='fas fa-ban' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -6px;'>CANCELAR</p>");
			userAuthor = true;
			
			$("#set-interest").click(function(){
				setInterest();
			});
			return;
		}
		let userFound = event.participants.find(function(item){return item == user_id});

		if(userFound){
			if(event.participants.length > 0){
				$("#menu-bottom-div-view-event").prepend("<div class='col-3 mx-auto' style='display: inline-block; max-width: 22% !important;'><button id='btn-view-all-users-events' type='button' class='general-button btns-prof mx-auto' style='opacity: 1;'><i class='fas fa-user-friends' style='font-size:21px;color:white;'></i></button></div>");
				$("#separator-lbl").remove();
			}
			
			$("#set-interest").css("opacity", 1);
			$("#set-interest").empty().append("<i class='fas fa-times' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -2px;'>DESISTO !</p>");
			userParticipant = true;
		}

		$("#btn-view-all-users-events").click(function(){
			window.location.href = "./view-profiles.html";	
		});
	}

	function loadCachedEvent(){
		getServerDate();
		if(JSON.stringify(cachedEvent) === JSON.stringify({})) return;
		verifyUserAlreadyInterested(cachedEvent, userInfo._id); 
		$("#qt-participants-text").text(cachedEvent.participants.length);
		if(cachedEvent.title) $("#title-input").val(cachedEvent.title);
		if(cachedEvent.data) $("#data-input").val(cachedEvent.data);
		if(cachedEvent.horario) $("#horario-input").val(cachedEvent.horario);
		if(cachedEvent.descricao) $("#descricao-input").val(cachedEvent.descricao);
		if(cachedEvent.address) {
			$("#local-input").css("opacity", "1");
			$("#local-input").val(cachedEvent.address.road + " - " + cachedEvent.address.house_number);
			$("#map-button").css({"color":"#4dcc80", "border": "2px solid #4dcc80", "opacity": "1"});
		}
		if(cachedEvent.tags) {
			let lengthTagsArray = cachedEvent.tags.length;
			for(var i = 0; i <= lengthTagsArray; ++i){
				$("#tag-"+cachedEvent.tags[i]).prop( "checked", true );
			}
		}
		if(cachedEvent.img) {
			$("#img-event").css("background-image", "url("+cachedEvent.img+")");
		}
		$("#get-map").css("display", "inline-block");
		$("#set-interest").css("display", "inline-block");
	}

	loadCachedEvent();


