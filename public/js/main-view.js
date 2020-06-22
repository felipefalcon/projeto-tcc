
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 48;
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#events-div").css("min-height", confHeight + "px");
	$("#profile-div").css("min-height", confHeight + "px");
	$("#next-u-div").css("min-height", confHeight + "px");
	$("#next-u-div").css("height", $(window).innerHeight() - $("#logo-div").innerHeight() + "px");
	$("#chat-div").css("min-height", confHeight + "px");
	$("#chat-users-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#menu-bottom-prof").css("margin-bottom", $("#menu-bottom-div").innerHeight() + "px");
	$("#events-box-div").css("max-height", confHeight + "px");

	const MenuBottomHome = $("#menu-bottom-home");
	const MenuBottomProf = $("#menu-bottom-prof");
	const MenuBottomNextU = $("#menu-bottom-next-u");
	
	let flagInfoProfile = false;
	let picOrder = 0;
	let qtPicsTotal = 1;
	if(typeof userInfo !== "undefined"){
		qtPicsTotal = 1+userInfo.pics_url.sec_pics.filter(function(item){return item != "";}).length;
	}
	let tabActive = -1;
	let flagUserChanged = true;
	let cachedMessagesHere = [];
	let showBoxSubscriptions = true;
	let showBoxUserEvents = false;
	let titleTab = "";
	let filterEvent = 0;
	let filterDistance = 25;
	let filterEventDate = "month";
	let exitApp = false;
	let acessLocationGranted = false;
	let inCallLocation = false;
	let inCallSetStatusOnline = false;

	// Para verificar se o serviço ainda está sendo chamado
	let inCallGetUser = false;
	let inCallGetAllUsers = false;
	let inCallGetAllEvents = false;

	// Estilos de labels Finalizado e Cancelado
	let labelFinalizado = "<div class='label-warning-events label-finalizado'><i class='fas fa-calendar-check' style='margin-right: 8px'></i>FINALIZADO</div>";
	let labelCancelado = "<div class='label-warning-events label-cancelado'><i class='fas fa-ban' style='margin-right: 8px'></i>CANCELADO</div>";

	function getAllUsersInfo() {
		if(inCallGetAllUsers) return;
		inCallGetAllUsers = true;
		let requesParams = {_id: userInfo._id};
		if("location" in userInfo) {
			requesParams.lat = userInfo.location.lat;
			requesParams.lng = userInfo.location.lng;
		}
		$.get(nodeHost+"get-users", requesParams).done(function (data) {
			if (!(isNullOrUndefined(data))) {
				setAllUsersCache(data);
			}
			inCallGetAllUsers = false;
		}).fail(function(){
			inCallGetAllUsers = false;
		});
	}

	function getAllEvents() {
		if(inCallGetAllEvents) return;
		inCallGetAllEvents = true;
		$.get(nodeHost+"get-events").done(function (data) {
			if (!isNullOrUndefined(data)) {
				setAllEvents(data);
				inCallGetAllEvents = false;
			}
		}).fail(function(){
			inCallGetAllEvents = false;
		});
	}

	$("#slider-location-range").change(function(){
		filterDistance = $("#slider-location-range").val();
		$("#slider-div span").text($("#slider-location-range").val()+" KM")
	});

	$("#btn-reload-next-u").click(function(){
		if(inCallLocation) return;
		inCallLocation = true;
		navigator.geolocation.getCurrentPosition(sucessGeoLocation, failedGeoLocation);
	});

	function hasAcessLocation(){
		$("#next-u-div").css({"display": "none"});
		navigator.geolocation.getCurrentPosition(function(){
			acessLocationGranted = true;
			$("#next-u-div").css({"opacity": "0"});
			$("#next-u-div").css({"display": ""});
			$("#next-u-div").animate({opacity: 1}, 600);
		}, function(){
			acessLocationGranted = false;
			$("#next-u-div").empty().load("blocked-location.html", function(){
				$("#blocked-location").animate({opacity: 1}, 300);
			});
		});
	}

	function sucessGeoLocation(posicao) {
		$.get("https://nominatim.openstreetmap.org/reverse?lat=" + posicao.coords.latitude + "&lon=" + posicao.coords.longitude + "&format=json").done(function (data) {
			var location = data.address;
			location.region = data.display_name.split(",")[8];
			location.lat = posicao.coords.latitude;
			location.lng = posicao.coords.longitude;
			$.get(nodeHost+"upd-user-location", {_id: userInfo._id, location: location}).done(function (data) {
				if (isNullOrUndefined(data)) alerts.errorServer();
				else {
					inCallLocation = false;
					getAllUsersInfo();
					if(!showBoxUserEvents) makeUsersNextObjects();
				}
			});
		});
	}

	function failedGeoLocation(error) {
		inCallLocation = false;
		return console.log(error);
	}

	$("#change-next-u-func").click(function(){
		$("#change-next-u-func").animate({"opacity": "1 !important"}, 200, function(){
			$("#change-next-u-func").animate({"opacity": "0.7 !important"});
			$("#next-u-func-1").animate({opacity: 0}, 200);
			$("#next-u-func-2").animate({opacity: 0}, 200);

			showBoxUserEvents = !showBoxUserEvents;
			let titleTabHere = "PESSOAS DE INTERESSE";
			$("#change-next-u-func i").removeClass();
			if(showBoxUserEvents){
				$("#change-next-u-func i").addClass("fas fa-map-marker-alt");
				$("#next-u-func-1").css("display", "none");
				$("#next-u-func-2").css("display", "inline");
				$("#next-u-func-2").animate({opacity: 1}, 200);
				makeUsersInEvents();
			}else{
				$("#change-next-u-func i").addClass("fas fa-fire-alt");
				$("#next-u-func-2").css("display", "none");
				$("#next-u-func-1").css("display", "inline");
				$("#next-u-func-1").animate({opacity: 1}, 200);
				titleTabHere = "PESSOAS PRÓXIMAS"
				option = 2;
				makeUsersNextObjects();
			}
			$("#title-tab-top").text(titleTabHere);

		});
	});

	function makeUsersInEvents() {
		// console.log(allEvents);
		if(allEvents.length == 0 || !allEvents) return;
		let allEventsSubscribed = [];
		let eventsToDraw = [];

		allEvents.forEach(function(data){
			if(data.status == 0){
				if(data.author == userInfo._id){
					if(data.participants.length == 0) return;
					allEventsSubscribed.push(data);
				}
				if(data.author != userInfo._id){
					let userFound = data.participants.find(function(item){return item == userInfo._id});
					if(userFound){
						allEventsSubscribed.push(data);
					}
				}
			}
		});
		if(allEventsSubscribed.length == 0){
			$("#next-u-users").empty();
			emptyTab("#next-u-users");
			return;
		}
		eventsToDraw = allEventsSubscribed;
		
		let divsCreated = []; 
		let heightEventsDiv = [];
		eventsToDraw.forEach( function (data) {
			let imgData = "";
			let dateEvent = new Date(data.data);
			dateEvent.setDate(dateEvent.getDate()+1);
			dateEvent.setHours(0);
			dateEvent.setMinutes(0);
			dateEvent.setSeconds(0);
			dateEvent.setMilliseconds(0);
			
			imgData += "<div class='fix-users-events-div'><div class='events-t-header-next-u' style='";

			if("img" in data) {
				if(data.img != null && data.img != "") imgData += "background-image: url("+data.img+");";
			}
			divsCreated.push(imgData+"' name='" + data._id + "'>");
			
			let dayEvent = new Number(dateEvent.getDate());
			let monthEvent = new Number(dateEvent.getMonth())+1;
			if(dayEvent < 10) dayEvent = "0" + dayEvent;
			if(monthEvent < 10) monthEvent = "0" + monthEvent;
			divsCreated.push("<label class='user-d-u-label event-user-label'>" + data.title + " - " + (data.address.city_district || data.address.city) + 
			"</label></div>");

			let createdDivs = "<div class='user-n-u-block-events'><div class='user-n-u-div'><label class='event-msg-label' style='margin: 25%; margin-top: 4px; margin-bottom: 0px;'><p style='line-height: 0px;font-size: 8px; margin-bottom: 15px; color: rgba(255, 255, 255, 0.8);'>" 
			+ dateEvent.getFullYear() 
			+ "</p><p style='line-height: 10px; font-size: 22px; margin-bottom: 8px;'>" + dayEvent + "/" + monthEvent + "</p>"
			+ data.horario +"</label>"+
			"<button name='"+data._id+"' id='btn-view-all-users-events' type='button' class='general-button btns-prof mx-auto btn-view-ev' style='opacity: 1; background-color: #6b65c5; margin-right: 10px !important;'><i class='fas fa-poll-h' style='font-size:21px;color:white; padding-top: 4px;'></i></button>"+
			"<button name='"+data._id+"' id='btn-view-all-users-events' type='button' class='general-button btns-prof mx-auto btn-view-users-ev' style='opacity: 1;'><i class='fas fa-user-friends' style='font-size:21px;color:white; padding-top: 4px;'></i></button>"+
			"</div></div>";
			if(data.author != userInfo._id){
				data.participants.push(data.author.toString());
			}

			let allUsersInfoLength = allUsersInfo.length;
			let i = 0;
			let maxUsers = 0;
			for(i = 0; i < allUsersInfoLength; ++i){
				let user = allUsersInfo[i];
				if("status_account" in user){
					if(!user.status_account) continue;
				}
				if(data.participants.includes(user._id.toString())){
					let distance = new Number(user.location.distance);
					if(distance <= 0) distance = 0;
					distance = user.location.distance >= 999 ? "???" : distance+" km";
					let online = user.online == 1 ? "<div id='online-circle' style='margin-right: 20px;'></div>" : "";
					let msgButtonPose = user.online == 1 ? "transform: translate(-48px,37px);" : "";
					createdDivs += "<div class='user-n-u-block-events'><div class='user-n-u-div'><label class='user-n-u-label'>" +
					user.name +" "+ user.lastname.split(" ")[0] + "</label><i class='fas fa-user-circle view-prof-icon' name='"+user._id+
					"' ></i><div id='user-n-u-div-content' name='" +
					user._id + "' style='background-image: url(" + user.pics_url.main_pic + ");'>" + online
					+"<div class='send-msg-button' name='" +
					user._id + "'><i class='fas fa-comment send-msg-icon' style='"+msgButtonPose+"'></i></div></div><label id='city-district-n-u-label'>" + 
					distance + "</label></div></div>";
					maxUsers++;
				}
				if(maxUsers == 8) break;
			};
	
			divsCreated.push(createdDivs+"</div>");
			let calcHeight = 436;
			if(maxUsers < 3){
				calcHeight = 180;
			}else if(maxUsers < 6){
				calcHeight = 310;
			}
			heightEventsDiv.push(calcHeight);

		});

		divsCreated.push("<div style=' height: 112px'></div>");

		$("#next-u-users").empty().append(divsCreated.join(""));
		$(".fix-users-events-div").each(function(i){
			$(this).css("height", heightEventsDiv[i]+"px");
		});

		$(".user-n-u-block-events").each(function(i){
			$(this).animate({opacity: 1}, 300+i);
		});

		$(".btn-view-ev").click(function () {
			setCachedEvent(getEventInAllEventsById($(this).attr('name')));
			return window.location.href = "./view-event.html";
		});

		$(".btn-view-users-ev").click(function () {
			setCachedEvent(getEventInAllEventsById($(this).attr('name')));
			return window.location.href = "./view-profiles.html";	
		});

		$(".send-msg-button").click(function () {
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setToUser(subject);
			configParams.history = "main-view";
			setConfigParams(configParams);
			window.location.href = "./user-conversation.html";
		});

		$(".view-prof-icon").click( function () {
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setTimeout(function () {
				setToUser(subject);
				configParams.history = "next-u-main-view";
				setConfigParams(configParams);
				window.location.href = "./user-profile.html";
			}, 60);
		});

	}


	function makeEventsObjects(type = 0) {
		// console.log(allEvents);
		if(allEvents.length == 0 || !allEvents) return;
		let allEventsOftUser = [];
		let allEventsWithtUser = [];
		let allEventsWithoutUser = [];
		let eventsToDraw = [];
		
		if(type == 1){
			allEvents.forEach(function(data){
				var eventoData =  moment(data.data);
				if(data.author == userInfo._id && moment().diff(eventoData, 'days') <= 60){
					allEventsOftUser.push(data);
				}
			});
			if(allEventsOftUser.length == 0){
				$("#my-events-author-box-div").empty();
				emptyTab("#my-events-author-box-div");
				return;
			}
			eventsToDraw = allEventsOftUser;
		}else if(type == 2){
			allEvents.forEach(function(data){
				if(data.author != userInfo._id){
					let userFound = data.participants.find(function(item){return item == userInfo._id});
					if(userFound){
						allEventsWithtUser.push(data);
					}
				}
			});
			if(allEventsWithtUser.length == 0){
				$("#my-events-box-div").empty();
				emptyTab("#my-events-box-div");
				return;
			}
			eventsToDraw = allEventsWithtUser;
		}else{
			let qtdEventsActive = 0;
			allEvents.forEach(function(data){
				if(data.author != userInfo._id && data.status != 2 && data.status != 1){
					qtdEventsActive++;
					var eventoData =  moment(data.data);
					if((filterEventDate == "today" && eventoData.format('DD-MM-YYYY').toString() == moment().format('DD-MM-YYYY').toString()) ||
					(filterEventDate == "month" && eventoData.format('MM-YYYY').toString() == moment().format('MM-YYYY').toString()) ||
					(filterEventDate == "year" && eventoData.format('YYYY').toString() == moment().format('YYYY').toString()) ||
					(filterEventDate == "more")){
						let userFound = data.participants.find(function(item){return item == userInfo._id});
						if((typeof userFound === "undefined")){
							allEventsWithoutUser.push(data);
						}
					}
					
				}
			});
			if(allEventsWithoutUser.length == 0 && qtdEventsActive == 0){
				$("#events-tags-div").css("display", "none");
				$("#events-box-div").empty();
				emptyTab("#events-box-div");
				return;
			}else{
				$("#events-tags-div").css("display", "block");
			}

			if(filterEvent.toString() != "0"){
				allEventsWithoutUser = allEventsWithoutUser.filter(function(event){return event.tags.includes(filterEvent.toString())});
			}

			if(allEventsWithoutUser.length == 0){
				$("#events-box-div").empty().load("empty-events-filtered.html", function(){
					$("#empty-events-filtered").animate({opacity: 1}, 300);
				});
				return;
			}

			eventsToDraw = allEventsWithoutUser;
		}
		
		let divsCreated = []; 

		eventsToDraw.forEach( function (data) {
			let imgData = "";
			let dateEvent = new Date(data.data);
			dateEvent.setDate(dateEvent.getDate()+1);
			dateEvent.setHours(0);
			dateEvent.setMinutes(0);
			dateEvent.setSeconds(0);
			dateEvent.setMilliseconds(0);
			
			if(data.status == 2 || data.status == 1){
				imgData += "<div class='events-t events-t-faded' style='";
			}else{
				imgData += "<div class='events-t' style='";
			}

			if("img" in data) {
				if(data.img != null && data.img != "") imgData += "background-image: url("+data.img+");";
			}
			divsCreated.push(imgData+"' name='" + data._id + "'>");
			
			let dayEvent = new Number(dateEvent.getDate());
			let monthEvent = new Number(dateEvent.getMonth())+1;
			if(dayEvent < 10) dayEvent = "0" + dayEvent;
			if(monthEvent < 10) monthEvent = "0" + monthEvent;
			divsCreated.push("<label class='user-d-u-label event-user-label'>" + data.title + " - " + (data.address.city_district || data.address.city) + 
			"</label><label class='event-msg-label'><p style='line-height: 0px;font-size: 8px; margin-bottom: 15px; color: rgba(255, 255, 255, 0.8);'>" 
			+ dateEvent.getFullYear() 
			+ "</p><p style='line-height: 10px; font-size: 22px; margin-bottom: 8px;'>" + dayEvent + "/" + monthEvent + "</p>"
			+ data.horario +"</label></div>");

			if(data.status == 2){
				divsCreated.push(labelCancelado);
			}else if(data.status == 1){
				divsCreated.push(labelFinalizado);
			}

		});
		divsCreated.push("<div style=' height: 56px'></div>");

		if(type == 1){
			divsCreated.push("<div style=' height: 46px'></div>");
			$("#my-events-author-box-div").empty().append(divsCreated.join(""));
		}else if(type == 2){
			divsCreated.push("<div style=' height: 46px'></div>");
			$("#my-events-box-div").empty().append(divsCreated.join(""));
		}else{
			$("#events-box-div").empty().append(divsCreated.join(""));
		}

		$(".events-t").click(function () {
			setCachedEvent(getEventInAllEventsById($(this).attr('name')));
			return window.location.href = "./view-event.html";
		});

		$(".events-t").each(function(){
			$(this).animate({opacity: 1}, 200);
		});

		$(".label-warning-events").each(function(){
			$(this).animate({opacity: 1}, 205);
		});
	}

	function makeUsersNextObjects() {
		let createdDivs = [];
		allUsersInfo.forEach( function (data) {
			if("status_account" in data){
				if(!data.status_account) return;
			}
			let distance = data.location.distance;
			if(new Number(distance) >= filterDistance || data.location.distance == "???") return;
			if(new Number(distance) == 0) distance = 0;
			let online = data.online == 1 ? "<div id='online-circle'></div>" : "";
			let msgButtonPose = data.online == 1 ? "transform: translate(-48px,37px);" : "";
			createdDivs.push("<div class='user-n-u-block'><div class='user-n-u-div'><label class='user-n-u-label'>" +
			data.name +" "+ data.lastname.split(" ")[0] + "</label><i class='fas fa-user-circle view-prof-icon' name='"+data._id+
			"' ></i><div id='user-n-u-div-content' name='" +
			data._id + "' style='background-image: url(" + data.pics_url.main_pic + ");'>" + online
			+"<div class='send-msg-button' name='" +
			data._id + "'><i class='fas fa-comment send-msg-icon' style='"+msgButtonPose+"'></i></div></div><label id='city-district-n-u-label'>" + 
			distance + " km</label></div></div>");
		});

		createdDivs.push("<div style='float: left;width: 100%; height: 110px'></div>");

		$("#next-u-users").empty().append(createdDivs.join(""));

		$(".send-msg-button").click(function () {
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setToUser(subject);
			configParams.history = "main-view";
			setConfigParams(configParams);
			window.location.href = "./user-conversation.html";
		});

		$(".view-prof-icon").click( function () {
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setTimeout(function () {
				setToUser(subject);
				configParams.history = "next-u-main-view";
				setConfigParams(configParams);
				window.location.href = "./user-profile.html";
			}, 60);
		});

		$(".user-n-u-block").each(function(i){
			$(this).animate({opacity: 1}, 300+i);
		});
	}

	function makeChatObjects() {
		let usersDistincs = userInfo.conversations;
		if(usersDistincs.length == 0) {
			 if($("#empty-conversations").length == 0){
				emptyTab("#chat-users-div", false);
			 }
			return;
		}
		// Verifica se algo mudou, se não mudou ele volta e não faz mais nada
		if(JSON.stringify(cachedMessagesHere) == JSON.stringify(usersDistincs)) return;
		cachedMessagesHere = [...usersDistincs];
		
		let divsCreated = []; 
		usersDistincs.forEach(function(item){
			let profile = getProfInAllUsersById(item._id);
			let dateLastMsg = new Date($.format.date(item.messages[item.messages.length-1].date, 'yyyy-MMM-dd HH:mm'));
			if(dateLastMsg.toLocaleDateString() == todayDate.toLocaleDateString()){
				dateLastMsg = "Hoje às " + (dateLastMsg.getHours() < 10 ? "0" : "") + dateLastMsg.getHours() + ":" + (dateLastMsg.getMinutes() < 10 ? "0" : "") + dateLastMsg.getMinutes();
			}else{
				dateLastMsg = dateLastMsg.toLocaleDateString();
			}

			let newMsgAlert = "style='opacity: 0'>";
			if(item.newmsgs > 0){
				newMsgAlert += "<span class='new-msg'><i class='fas fa-exclamation'></i></span>";
			}
			let statusAccount = "";
			if("status_account" in profile){
				if(!profile.status_account) statusAccount = "filter: grayscale(80%)";
			}

			let online = profile.online == 1 ? "<div id='online-circle' style='margin-top: 2px; left: 0; z-index: 9;'></div>" : "";
			divsCreated.push("<div class='users-t-chat' name='" + item._id + "'"+ newMsgAlert +"<div id='profile-img-div' style='background-image: url(" + profile.pics_url.main_pic +
			");"+statusAccount+"'>"+online+"</div><div class='profile-info-div'><label class='user-d-u-label chat-user-label'>" + profile.name + " " + profile.lastname.split(" ")[0] +
			"<span class='chat-date-label'>"+ dateLastMsg +"</span></label><label class='user-d-u-label chat-msg-label'>" 
			+ item.messages[item.messages.length-1].text + "</label></div></div>");
		});

		divsCreated.push("<div style=' height: "+$("#menu-bottom-div").innerHeight()+"px'></div>");
		$("#chat-users-div").empty().append(divsCreated.join(""));

		$(".users-t-chat").click( function () {
			var elmt = $(".users-t-chat[name='" + $(this).attr('name') + "']");
			elmt.css("background-color", "#e8e8e8");
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setToUser(subject);
			configParams.history = "main-view";
			setConfigParams(configParams);
			setTimeout(function () {
				window.location.href = "./user-conversation.html";
			}, 60);
		});

		$(".users-t-chat").each(function(){
			if($(this).children().attr('class') == "new-msg") $(this).animate({opacity: 1}, 200);
			else $(this).animate({opacity: 0.8}, 200);
		});

	}

	function getProfInAllUsersById(id){
		return allUsersInfo.find(function(item){return item._id == id;});
	}

	function getEventInAllEventsById(id){
		return allEvents.find(function(item){return item._id === id;});
	}

	function getUser(){
		if(inCallGetUser) return;
		inCallGetUser = true;
		$.get(nodeHost+"get-user-logged", { _id: userInfo._id}).done(function (data) {
			if (isNullOrUndefined(data)) {
				console.log("Deu merda");
			}else {
				if(JSON.stringify(userInfo) == JSON.stringify(data)) {
					flagUserChanged = false;
					return inCallGetUser = false;
				}
				if(exitApp) return;
				setUserCache(data);
				getQtNoReadMsgs();
				flagUserChanged = true;
				inCallGetUser = false;
			}
		});
	}

	function getProfile() {
		// getUser();
		$("#profile-content-div").prepend("<div id='user-information-div' class='container'> <div id='name-label-user-info'> <label class='title-label' id='label-user-name'></label> </div> <label class='title-label' id='label-user-age'>?</label> <div id='other-label-user-info'> </div> </div> <div id='main-pic-div-c'></div> <div id='main-descript-div'></div>");
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(userInfo.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(gender+"&nbsp&nbsp<p style='display: contents; line-height: 25px;'>"+userInfo.name+" "+userInfo.lastname+"</p>");
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+userInfo.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#main-descript-div").text(userInfo.about);
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
		$("#main-pic-div-c").animate({opacity: 1}, 300, function(){
			if(qtPicsTotal > 1){
				$("#btn-change-pic").append("<p style='font-size: 12px;'><label id='act-pic'>1</label>&nbsp/&nbsp<label id='qt-pics'>"+qtPicsTotal+"</label></p>");
			}
			addAnotherInfos();
		});
	}

	function addAnotherInfos(){
		let htmlInfos = [];
		let city = "";
		let work = "";
		if("location" in userInfo) city = userInfo.location.city;
		if("work" in userInfo) work = userInfo.work;
		if(city.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-street-view' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+city+"</label>");
		if(work.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-address-card' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+work+"</label>");
		if(htmlInfos.length == 0) return;
		$("#other-label-user-info").empty().append(htmlInfos.join(""));
	}

	function verifyAdminPermission() {
		if (!userInfo.is_admin) return false;
		$("#menu-1").prepend("<a href='./admin-page.html'>Administrador</a>");
	}

	$("#exit-app-btn").click(function(){
		exitApp = true;
		resetAllUsersCache();
		resetToUser();
		resetAllEvents();
		resetConfigParams();
		resetUserCache();
		setTimeout(function(){
			window.location.replace("index.html");
		}, 500);
	});

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		$("#other-label-user-info").slideDown(300);
		if(userInfo.about.length > 0){
			$( "#main-descript-div" ).animate({
				opacity: "1",
				height: "100%"
			}, 600);
		}
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			if(userInfo.about.length > 0){
				$( "#main-descript-div" ).animate({
					height: "0%",
					opacity: "0"
				}, 400);
			}
			flagInfoProfile = false;
		}, 10000);
		flagInfoProfile = true;
	});

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in userInfo) || picDiv.css("opacity") < 1 || qtPicsTotal == 1) return;
		if(picOrder >= qtPicsTotal-1) picOrder = -1;
		picDiv.fadeOut(150, function(){
			let picActive = userInfo.pics_url.main_pic;
			++picOrder;
			if(picOrder > 0) picActive = Object.values(userInfo.pics_url.sec_pics)[picOrder-1];
			picDiv.css("background-image", "url(" + picActive + ")");
			$("#act-pic").text(picOrder+1);
			picDiv.fadeIn(150);
		});
	});

	$("#events-tags-labels").children().click(function(){
		let filterButton = $(this);
		if(filterEvent.toString() == filterButton.attr('option').toString()) return;
		$("#events-tags-labels").children().css("opacity", "0.3");
		$(".events-t").animate({opacity: 0}, 200);
		// $(".events-t").animate({opacity: 0}, 200);
		$(".label-warning-events").animate({opacity: 0}, 200);
		filterButton.animate({opacity: 1}, 200);
		filterEvent = filterButton.attr('option');
		setTimeout(makeEventsObjects, 300);
	});

	$("#event-filter-date").change(function(){
		filterEventDate = $(this).val();
		setTimeout(makeEventsObjects, 300);
	});

	function emptyTab(tabSelector, tabEvents = true){
		if(tabEvents){
			$(tabSelector).load("empty-events.html", function(){
				$("#empty-events").animate({opacity: 1}, 300);
			});
			return;
		}
		if(tabSelector == "#next-u-users"){
			$(tabSelector).load("empty-events.html", function(){
				$("#empty-events").animate({opacity: 1}, 300);
			});
			return;
		}
		$(tabSelector).load("empty-conversations.html", function(){
			$("#empty-conversations").animate({opacity: 1}, 300);
		});
	}

	function getQtNoReadMsgs(){
		let qtNoReadMsgs = 0;
		userInfo.conversations.forEach(function(item){
			if(item.newmsgs != 0){
				qtNoReadMsgs += item.newmsgs;
			}
		});
		if(qtNoReadMsgs > 0){
			$("#qt-msgs").animate({
				opacity: "1"
			}, 600);
			$("#qt-msgs").text(qtNoReadMsgs < 100 ? qtNoReadMsgs.toString() : "99+");
		}
	}

	$("#btn-event-new").click(function(){
		setCachedEvent({});
		window.location.replace('create-event.html');
	});

	$("#btn-subscript").click(function(){
		$("#btn-subscript").animate({opacity: 0.4}, 200, function(){
			$("#btn-subscript").animate({opacity: 1});
		});
		showBoxSubscriptions = !showBoxSubscriptions;
		$("#my-events-box-div").empty();
		$("#my-events-author-box-div").empty();
		let titleTabHere = "MEUS EVENTOS";
		let option = 1;
		if(showBoxSubscriptions){
			$("#my-events-box-div").css("display", "none");
			$("#my-events-author-box-div").css("display", "block");
			$("#btn-subscript").val("SUBSCRIÇÕES");
		}else{
			$("#my-events-author-box-div").css("display", "none");
			$("#my-events-box-div").css("display", "block");
			$("#btn-subscript").val("CRIAÇÕES");
			titleTabHere = "EVENTOS SUBSCRITOS"
			option = 2;
		}
		$("#title-tab-top").text(titleTabHere);
		makeEventsObjects(option);
	});

	function setStatusOnline(){
		if(inCallSetStatusOnline) return;
		inCallSetStatusOnline = true;
		$.get(nodeHost+"upd-user-status", {_id: userInfo._id}).done(function (data) {
			if (isNullOrUndefined(data)) {
				console.log("Deu merda");
			}
			inCallSetStatusOnline = false;
		});
	}

	function titleTopTable(){
		let titleTabHere = "";
		if(tabActive == 4){
			titleTabHere = "CONVERSAS";
		}else if(tabActive == 3){
			titleTabHere = "MEUS EVENTOS";
		}else if(tabActive == 2){
			titleTabHere = "EVENTOS";
		}else if(tabActive == 1) {
			titleTabHere = "PESSOAS PRÓXIMAS";
		}else if(titleTab == titleTabHere) return;
		titleTab = titleTabHere;
		$("#title-tab-top").text(titleTab);
	}

	function clearAnotherTabs(){
		if(tabActive != 2) 	{
			$("#events-box-div").empty();
			$("#menu-bottom-div").css("box-shadow", "none");
		}else{
			$("#menu-bottom-div").css("box-shadow", "rgba(39, 19, 81, 0.75) 0px -1px 5px");
		}
		if(tabActive != 1) {
			$("#next-u-users").empty();
			showBoxUserEvents = false;
			$("#change-next-u-func i").addClass("fas fa-fire-alt");
			$("#next-u-func-2").css("display", "none");
			$("#next-u-func-1").css("display", "inline");
			$("#next-u-func-1").animate({opacity: 1}, 200);
		}
		if(tabActive != 4)	$("#chat-users-div").empty();
		if(tabActive != 0)  $("#profile-content-div").empty();
		if(tabActive != 3) {
			$("#my-events-author-box-div").empty();
			$("#my-events-box-div").empty();
			$("#btn-subscript").val("SUBSCRIÇÕES");
			$("#my-events-author-box-div").css("display", "block");
			$("#my-events-box-div").css("display", "none");
			showBoxSubscriptions = true;
		}
	}

	function checkTab(){
		titleTopTable();
		clearAnotherTabs();
		setTimeout(function(){
			switch(tabActive){
				case 4:  	makeChatObjects(); break;
				case 3:		makeEventsObjects(1); break;
				case 2: 	makeEventsObjects(); break;
				case 1: 	makeUsersNextObjects(); break;
				case 0: 	getProfile(); break;
				default: 	break;
			}
		}, 200);
	}

	(function(){
		getServerDate();
		// MenuBottomHome.slideUp(1);
		// MenuBottomProf.slideUp(1);
		// MenuBottomNextU.slideUp(1);
		getAllEvents();
		getAllUsersInfo();
		setStatusOnline();
		getQtNoReadMsgs();
		verifyAdminPermission();

		$("#btn-menu-1").click(function () {
			$("#menu-1").slideToggle(300);
		});

		$("#about-btn").click(function () {
			alerts.aboutAlert();
		});
	
		$("body").click( function () {
			if (parseInt($("#menu-1").css('height')) < 50) return;
			$("#menu-1").slideUp(300);
		});

		setInterval(function(){
			getUser();
			if(tabActive == 4 && flagUserChanged) checkTab();
		}, 1000);

		setInterval(function(){
			getAllUsersInfo();
			getAllEvents();
			setStatusOnline();
		}, 10003);

		setInterval(function(){
			getServerDate();
		}, 60000);

		let initTabs = setInterval(function(){
			if(userInfo){
				if(configParams.tab == "chat-tab"){
					$("#btn-menu-8").click();
					clearInterval(initTabs);
				}else if(configParams.tab == "profile-tab"){ 
					$("#btn-menu-4").click();
					clearInterval(initTabs);
				}
			}
			if(allUsersInfo){
				if(configParams.tab == "next-u-tab"){
					$("#btn-menu-5").click();
					clearInterval(initTabs);
				}
			}
			if(allEvents){
				if(allEvents.length > 0){
					if(configParams.tab == "main-tab" || JSON.stringify(configParams) == "{}"){
						$("#btn-menu-6").click();
						clearInterval(initTabs);
					}else if(configParams.tab == "your-events-tab"){
						$("#btn-menu-7").click();
						clearInterval(initTabs);
					}
				}else if(!inCallGetAllEvents){
					$("#btn-menu-6").click();
					clearInterval(initTabs);
				}
			}
		}, 0);

		$("#btn-menu-7").click(function(){
			if(tabActive == 3) return;
			tabActive = 3;
			configParams.tab = "your-events-tab";
			setConfigParams(configParams);
			checkTab();
			setTimeout(function(){
				MenuBottomHome.slideDown(300);
				MenuBottomNextU.slideUp(0);
				MenuBottomProf.slideUp(0);
			}, 200);
		});
	
		$("#btn-menu-8").click(function(){
			if(tabActive == 4) return;
			tabActive = 4;
			configParams.tab = "chat-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideUp(0);
			MenuBottomProf.slideUp(0);
			MenuBottomNextU.slideUp(0);
			cachedMessagesHere = [];
			checkTab();
		});
	
		$("#btn-menu-4").click(function(){
			if(tabActive == 0) return;
			tabActive = 0;
			configParams.tab = "profile-tab";
			setConfigParams(configParams);
			checkTab();
			setTimeout(function(){
				MenuBottomProf.slideDown(300);
				MenuBottomHome.slideUp(0);
				MenuBottomNextU.slideUp(0);
			}, 200);
		});
	
		$("#btn-menu-5").click(function(){
			if(tabActive == 1) return;
			tabActive = 1;
			configParams.tab = "next-u-tab";
			setConfigParams(configParams);
			checkTab();
			setTimeout(function(){
				MenuBottomNextU.slideDown(300);
				MenuBottomHome.slideUp(0);
				MenuBottomProf.slideUp(0);
			}, 200);
			if(!acessLocationGranted) hasAcessLocation();
		});
	
		$("#btn-menu-6").click(function(){
			if(tabActive == 2) return;
			tabActive = 2;
			configParams.tab = "main-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideUp(0);
			MenuBottomProf.slideUp(0);
			MenuBottomNextU.slideUp(0);
			checkTab();
		});

	})();



