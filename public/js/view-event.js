
	let userParticipant = false;
	let userAuthor = false;

	$("#btn-menu-back").click(function () {
		window.location.replace("./main-view.html");
	});

	$("#btn-criar-evento").click(function () { createEvent(); });

	$("#local-input").click(function(){
		window.location.href = "./set-map.html";	
	});

	$("#set-interest").click(function(){
		let serviceName = "set-interest-event";
		if(!userAuthor){
			if(!userParticipant){
				$("#set-interest").css("opacity", 1);
				$("#set-interest").animate({zoom: 1.1}, 300, function(){
					$("#set-interest").animate({zoom: 1}, 300);
					$("#set-interest").empty().append("<i class='fas fa-times' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -2px;'>DESISTO !</p>");
				});
			}else{
				$("#set-interest").css("opacity", 1);
				$("#set-interest").animate({zoom: 1.1}, 300, function(){
					$("#set-interest").animate({zoom: 1}, 300);
					$("#set-interest").animate({opacity: 0.7});
					$("#set-interest").empty().append("<i class='fas fa-hand-peace' style='font-size:32px;color:white'></i> <p id='text-set-interest'>BORA !</p>");
				});
				serviceName = "set-desistence-event";
			}
		}else{
			$("#set-interest").css("opacity", 1);
				$("#set-interest").animate({zoom: 1.1}, 300, function(){
					$("#set-interest").animate({zoom: 1}, 300);
				});
				serviceName = "";
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
							if(data.value){
								serviceName = "set-del-event";
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
							if(data.value){
								serviceName = "set-cancel-event";
							}
						});
					}, 100);
				}
		}
		if(serviceName == "") return;
		$.get(nodeHost+serviceName, {
			_id: 	cachedEvent._id,
			user_id: userInfo._id
		}).done(function(data) {
			if(isNullOrUndefined(data)){
				alerts.errorServer();
			}else{
				setCachedEvent(data);
				loadCachedEvent();
				// $("#main-body-div").LoadingOverlay('hide');
			}
		});
	});
	
	function verifyUserAlreadyInterested(event, user_id){
		if(event.status == 1){
			$("#menu-bottom-div-view-event").empty().append("<i class='fas fa-lock' style='font-size:32px;color:white'></i><p id='text-see-cancel'>CANCELADO !</p>");
			return;
		}

		let dateEvent = new Date(event.data);
		let todayDatehere = todayDate;
		dateEvent.setDate(dateEvent.getDate()+1);
		dateEvent.setHours(0);
		dateEvent.setMinutes(0);
		dateEvent.setSeconds(0);
		todayDatehere.setHours(0);
		todayDatehere.setMinutes(0);
		todayDatehere.setSeconds(0)
		if(dateEvent.getTime() < todayDate.getTime()){
			$("#menu-bottom-div-view-event").empty().append("<i class='fas fa-calendar-check' style='font-size:32px;color:white'></i><p id='text-see-cancel'>FINALIZADO !</p>");
			return;
		}

		if(event.author == userInfo._id){
			$("#set-interest").css("opacity", 1);
			$("#set-interest").empty().append("<i class='fas fa-ban' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -2px;'>CANCELA !</p>");
			userAuthor = true;
			return;
		}
		let userFound = event.participants.find(function(item){return item == user_id});
		if(userFound){
			$("#set-interest").css("opacity", 1);
			$("#set-interest").empty().append("<i class='fas fa-times' style='font-size:32px;color:white'></i><p id='text-set-interest' style='margin-left: -2px;'>DESISTO !</p>");
			userParticipant = true;
		}
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
			$("#img-event").css("background-image", "url("+cachedEvent.img+")");
		}
		$("#get-map").css("display", "inline-block");
		$("#set-interest").css("display", "inline-block");
	}

	loadCachedEvent();


