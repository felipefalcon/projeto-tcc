
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
	
	let flagInfoProfile = false;
	let picOrder = 0;
	let tabActive = -1;
	let flagUserChanged = true;
	let cachedMessagesHere = [];
	let cachedEventsHere = [];
	let firstTimeProf = true;

	function getAllUsersInfo() {
		//$("#main-body-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$.get("./get-users", {_id: userInfo._id}).done(function (data) {
//			$(".search-div").fadeIn();
			if (!(isNullOrUndefined(data))) {
				setAllUsersCache(data);
				//makeChatObjects();
				//makeUsersNextObjects();
			}
			//setTimeout(function(){$("#main-body-div").LoadingOverlay('hide');}, 1000);
			//$("#btn-menu-1").attr("disabled", false);
		}).fail(function(){
			$("#error-div").css("display", "show");
//			$("#main-body-div").LoadingOverlay('hide');
//			$("#btn-menu-1").attr("disabled", false);
//			$(".search-div").fadeIn();
		});
	}

	$("#reload-error").click(function(){
		$("#error-div").css("display", "none");
		getAllUsersInfo();
		getProfile();
		verifyAdminPermission();
	});

	function getAllEvents() {
		$.get("./get-events").done(function (data) {
			if (data == null || data == "undefined") {

			} else {
				setAllEvents(data);
				//console.log(allEvents);
				//makeEventsObjects();
			}
			
		}).fail(function(){
			$("#error-div").css("display", "show");
			// $("#main-body-div").LoadingOverlay('hide');
			// $("#btn-menu-1").attr("disabled", false);
		});
	}

	function makeEventsObjects() {
		// console.log(allEvents);
		if(allEvents.length == 0 || !allEvents) return;
		let allEventsWithoutUser = [];//allEvents.slice();
		// allEvents.forEach(function(data){
		// 	var flag = false;
		// 	var participantLength = data.participants.length;
		// 	for(var i = 0; i < participantLength; ++i){
		// 		if(userInfo._id != data.participants[i]._id){
		// 			flag = true;
		// 		}else{
		// 			flag = false;
		// 			break;
		// 		}
		// 	}
		// 	if(flag){
		// 		allEventsWithoutUser.push(data);
		// 	}
		// });

		allEvents.forEach(function(data){
			let userFound = data.participants.find(function(item){return item._id == userInfo._id});
			if((typeof userFound === "undefined")){
				allEventsWithoutUser.push(data);
			}
		});

		if(allEventsWithoutUser.length == 0){
			$("#events-box-div").empty();
			return;
		}

		// Verifica se algo mudou, se não mudou ele volta e não faz mais nada
		if(_.isEqual(cachedEventsHere, allEventsWithoutUser)) return;
		cachedEventsHere = allEventsWithoutUser.slice();

		let divsCreated = []; 
		allEventsWithoutUser.forEach(async function (data, i) {
			if(i == 0){
				divsCreated.push("<div class='carousel-item events-t active' style='background-color: rgba(250, 237, 255, 0.3);' name='" + data._id + "'>");
			}else{
				divsCreated.push("<div class='carousel-item events-t' style='background-color: rgba(250, 237, 255, 0.3);' name='" + data._id + "'>");
			}
			
			let dateEvent = new Date(data.data);
			let dayEvent = new Number(dateEvent.getDate())+1;
			if(dayEvent < 10){
				dayEvent = "0" + dayEvent;
			}
			divsCreated.push("<label class='user-d-u-label event-user-label'>" + data.local + "<button class='event-subscribe-btn' name='"+data._id+"'>"
			+ "<i class='fas fa-hand-peace'></i></button>"
			+ "</label><label class='event-msg-label'>"
			+ "<p style='line-height: 0px;font-size: 8px; margin-bottom: 18px; color: rgba(255, 255, 255, 0.8);'>" + dateEvent.getFullYear() + "</p>"
			+ "<p style='line-height: 10px; font-size: 22px; margin-bottom: 8px;'>" + dayEvent + "/" + dateEvent.getMonth()+1 + "</p>"
			+ data.horario +"</label>"
			// + "<marquee class='event-msg-label-descr' behavior='scroll' direction='left' scrollamount='1'>"+ data.descricao +"</marquee>
			+"</div>");

		});
		divsCreated.push("<div style=' height: "+$("#menu-bottom-div").innerHeight()+"px'></div>");
		divsCreated.push("<div style=' height: "+$("#menu-bottom-home").innerHeight()+"px'></div>");

		$("#events-box-div").empty().append(divsCreated.join(""));

		$(".event-subscribe-btn").click(function () {
			// $("#main-body-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
			var userBasic = {_id: userInfo._id, name: userInfo.name, main_pic: userInfo.pics_url.main_pic};
			$(this).parent().parent().fadeOut(600);
			$.get("./upd-event", {
				_id: 	$(this).attr('name'),
				user: userBasic
			}).done(function( data ) {
				if(isNullOrUndefined(data)){
					console.log("Deu merda");
				}else{
					getAllEvents();
					setTimeout(function(){makeEventsObjects();}, 5000);
					// $("#main-body-div").LoadingOverlay('hide');
				}
			});
		});

	}

	// BACKUP da função de eventos - que só puxava usuários
	// function makeEventsObjects2() {
	// 	allUsersInfo.forEach(function (data, i) {
	// 		if (i % 2 == 0) {
	// 			$("#events-div").append("<div class='users-t' style='background-color: rgba(255, 255, 255, 0.24);' name='" + data._id + "'>" +
	// 				"<div id='profile-img-div' name='" + data._id + "'></div>" +
	// 				"<div class='profile-info-div'>" +
	// 				"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
	// 				"<label class='user-d-u-label chat-msg-label'>" + data.age + " anos - " + data.gender + "</label>" +
	// 				"<label class='user-d-u-label'>" + data.email + "</label>" +
	// 				"</div></div>");
	// 			$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
	// 		} else {
	// 			$("#events-div").append("<div class='users-t' name='" + data._id + "'>" +
	// 				"<div id='profile-img-div' name='" + data._id + "'></div>" +
	// 				"<div class='profile-info-div'>" +
	// 				"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
	// 				"<label class='user-d-u-label chat-msg-label'>" + data.age + " anos - " + data.gender + "</label>" +
	// 				"<label class='user-d-u-label'>" + data.email + "</label>" +
	// 				"</div></div>");
	// 			$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
	// 		}
	// 	});
	// 	$(".users-t").fadeIn("slow");
	// }

	function makeUsersNextObjects() {
		let createdDivs = "";
		allUsersInfo.forEach(async function (data) {
			var cityD = data.location ? data.location.city_district : "???";
			createdDivs += "<div class='user-n-u-div mx-auto'>"
			+ "<label class='user-n-u-label'>" + data.name + "</label>"
			+ "<div id='user-n-u-div-content' name='" + data._id + "' style='background-image: url(" + data.pics_url.main_pic + "'>"
			+ "<div class='send-msg-button' name='" + JSON.stringify(data) + "'><i class='fas fa-comment-dots' style='font-size:28px; color:white; transform: translateY(-6px); float: right;text-shadow: 2px 2px 2px black'></i></div></div>"
			+ "<label id='city-district-n-u-label'>" + cityD + "</label></div>";
		});

		$("#next-u-users").empty().append(createdDivs);

		$(".send-msg-button").click(function () {
			setToUser($(this).attr('name'));
			window.location.href = "./user-conversation.html";
		});
	}

	function makeChatObjects() {
		// userInfo.messages.forEach(function(item){
		// 	item.date = new Date(item.date);
		// });
		//userInfo.messages = _.orderBy(userInfo.messages, 'date', 'desc' );
		if(!("messages" in userInfo)) return;
		userInfo.messages.forEach(async function(item){
			item.date = new Date(item.date);
			item.day = (new Date(item.date)).getDate();
		});
		let usersDistincs = Object.values(_.groupBy(userInfo.messages, msg => msg.author));
		//console.log(userInfo.messages);

		// Verifica se algo mudou, se não mudou ele volta e não faz mais nada
		if(_.isEqual(cachedMessagesHere, usersDistincs)) return;
		cachedMessagesHere = usersDistincs.slice();

		let profiles = [];
		let userMsgs = [];

		//console.log(usersDistincs);
		usersDistincs.forEach( async function(data){
			//console.log(data);
			let prof = "";
			if(data[0].subject == userInfo._id) {
				prof = getProfileSubject(data[0].author);
			}else if(data[0].author == userInfo._id){
				//prof = getProfileSubject(data[0].subject); // Ver se pega sem isso
				userMsgs = Object.values(_.groupBy(data, msg => msg.subject));
				userMsgs.forEach(async function(data){
					prof = getProfileSubject(data[0].subject);
					if(!profiles.includes(prof) && typeof prof !== "undefined"){
						profiles.push(prof);
					}
				});
			}
			if(!profiles.includes(prof) && typeof prof !== "undefined"){
				profiles.push(prof);
			}
		});

		profiles.forEach(async function(data){
			data.messages.forEach(async function(msg){
				msg.day = (new Date(msg.date)).getDate();
			});
		});

		profiles = _.orderBy(profiles, ['messages[0].day', 'messages[0].date'] , ['desc', 'desc']);
		//console.log(profiles);

		let divsCreated = []; 
		const dateN = (new Date(getServerDate())).toLocaleDateString();
		
		profiles.forEach( async function(data){
			//console.log(getLastMessage(data._id, usersDistincs));
			//var userLength = userMsgs.length;
			let lastMsgSubject = getLastMessage(data._id, usersDistincs) || "";
			// for(var i = 0; i < userLength; ++i){
			// 	if(data._id == userMsgs[i][0].subject){
			// 		lastMsgUser = userMsgs[i][0];
			// 		break;
			// 	}
			// }
			let lastMsgUser = userMsgs.find(function(item){return data._id == item[0].subject});
			lastMsgUser = typeof lastMsgUser === "undefined" ? "" : lastMsgUser[0];

			let dateMsgUser = new Date(lastMsgUser.date);
			var dateMsgSubject = typeof lastMsgSubject !== "undefined" ? new Date(lastMsgSubject.date) : dateMsgUser;
			
			if(lastMsgUser == "" || dateMsgSubject.getTime() > dateMsgUser.getTime()){
				var lastMsg = lastMsgSubject;
				var lastDate = dateMsgSubject;
			}else {//if(lastMsgSubject == "" || dateMsgSubject.getTime() <= dateMsgUser.getTime()){
				var lastMsg = lastMsgUser;
				var lastDate = dateMsgUser;
			}
			
			if(lastDate.toLocaleDateString() == dateN){
				lastDate = "Hoje às " + (lastDate.getHours() < 10 ? "0" : "") + lastDate.getHours() + ":" + (lastDate.getMinutes() < 10 ? "0" : "") + lastDate.getMinutes();
			}else{
				lastDate = lastDate.toLocaleDateString();
			}

			let newMsgAlert = "";
			if(lastMsg.status == "0"){
				newMsgAlert = "<span class='new-msg'>!</span>";
			}
			
			divsCreated.push("<div class='users-t-chat' name='" + JSON.stringify(data) + "'>"+ newMsgAlert +"<div id='profile-img-div' style='background-image: url(" + data.pics_url.main_pic + "'></div>" +
			"<div class='profile-info-div'><label class='user-d-u-label chat-user-label'>" 
			+ data.name + 
			"<span class='chat-date-label'>"+ lastDate +"</span></label><label class='user-d-u-label chat-msg-label'>" 
			+ lastMsg.text + "</label></div></div>");
		});

		divsCreated.push("<div style=' height: "+$("#menu-bottom-div").innerHeight()+"px'></div>");
		//$("#chat-users-div").fadeOut(200);
		//$("#chat-users-div").empty();
		$("#chat-users-div").empty().append(divsCreated.join(""));
		//$("#chat-users-div").fadeIn(200);

		$(".users-t-chat").click(async function () {
			var elmt = $(".users-t-chat[name='" + $(this).attr('name') + "']");
			elmt.css("background-color", "#e8e8e8");
			var subject = $(this).attr('name');
			setTimeout(function () {
				setToUser(subject);
				window.location.href = "./user-conversation.html";
			}, 60);
		});
	}

	// function getLastMessage(id, usersDistincs){
	// 	var usersDistincsLength = usersDistincs.length;
	// 	for(var i = 0; i < usersDistincsLength; ++i){
	// 		if(usersDistincs[i][0].author == id){
	// 			return usersDistincs[i][0];
	// 		}
	// 	}
	// 	return "";
	// }

	function getLastMessage(id, usersDistincs){
		var lastMsg = usersDistincs.find(function(item){return item[0].author == id;});
		return typeof lastMsg === "undefined" ? "" : lastMsg[0];
	}

	// function getProfileSubject(id){
	// 	var allUsersInfoLength = allUsersInfo.length;
	// 	for(var i = 0; i < allUsersInfoLength; ++i){
	// 		if(allUsersInfo[i]._id == id){
	// 			return allUsersInfo[i];
	// 		}
	// 	}
	// }

	function getProfileSubject(id){
		return allUsersInfo.find(function(item){return item._id == id;});
	}

	function getUser(){
		$.get(nodeHost+"get-user", { email: userInfo.email}).done(function (data) {
			if (isNullOrUndefined(data)) {
				console.log("Deu merda");
			}else {
				if(JSON.stringify(userInfo) === JSON.stringify(data)) return flagUserChanged = false;
				setUserCache(data);
				getQtNoReadMsgs();
				flagUserChanged = true;
			}
		});
	}

	function getProfile() {
		getUser();
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
		let gender = "?";
		if(userInfo.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}else{
			gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(gender+"&nbsp&nbsp"+userInfo.name);
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+userInfo.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#label-user-location").text("São Paulo - SP");
		$("#main-descript-div").text(userInfo.about);
	}

	function deleteAccount() {
		if (window.confirm("Tem certeza que deseja deletar sua conta?\nEsta ação é irreversível!")) {
			$.get("./del-user", { email: userInfo.email })
				.done(function (data) {
					if (data == null || data == "undefined") {
						alert("Algum erro");
					} else {
						alert("Sua conta foi deletada!");
						resetUserCache();
						window.location.replace("/");
					}
				});
		}
	}

	function verifyAdminPermission() {
		if (!userInfo.is_admin) return false;
		$("#menu-1").prepend("<a href='./admin-page.html'>Administrador</a>");
	}

	$("#exit-app-btn").click(function(){
		resetUserCache();
		resetAllUsersCache();
		resetToUser();
		resetAllEvents();
		window.location.replace("/");
	});

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		$("#other-label-user-info").slideDown(300);
		$( "#main-descript-div" ).animate({
			width: "100%",
			opacity: "1"
		}, 600);
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			$( "#main-descript-div" ).animate({
				width: "0%",
				left: "100%",
				opacity: "0"
			}, 600, function(){
				$( "#main-descript-div" ).css("left", "0%");
			});
			flagInfoProfile = false;
		}, 10000);
		flagInfoProfile = true;
	});

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in userInfo) || picDiv.css("opacity") < 1) return;
		if(picOrder >= Object.values(userInfo.pics_url).length-1) picOrder = -1;
		picDiv.fadeOut(150, function(){
			picDiv.css("background-image", "url(" + Object.values(userInfo.pics_url)[++picOrder] + ")");
			picDiv.fadeIn(150);
		});
	});

	function getQtNoReadMsgs(){
		let qtNoReadMsgs = 0;
		userInfo.messages.forEach(function(message){
			if(parseInt(message.status) == 0) qtNoReadMsgs++;
		});
		if(qtNoReadMsgs > 0){
			$("#qt-msgs").css("opacity", "1");
			$("#qt-msgs").text(qtNoReadMsgs.toString());
		}else{
			$("#qt-msgs").css("opacity", "0");
		}
	}

	function checkTab(){
		switch(tabActive){
			case 4:  	makeChatObjects(); break;
			case 2: 	makeEventsObjects(); break;
			// case 1: 	makeUsersNextObjects(); break;
			default: 	break;
		}
	}

	(async function(){
		//getProfile();
		const MenuBottomHome = $("#menu-bottom-home");
		const MenuBottomProf = $("#menu-bottom-prof");
		MenuBottomHome.slideUp(1);
		MenuBottomProf.slideUp(1);
		getQtNoReadMsgs();
		getAllUsersInfo();
		getAllEvents();
		verifyAdminPermission();

		$('.carousel').carousel({
			interval: false
		  })

		$("#btn-menu-1").click(function () {
			$("#menu-1").slideToggle(300);
		});

		$("#about-btn").click(function () {
			alerts.aboutAlert();
		});
	
		$("body").click(async function () {
			if (parseInt($("#menu-1").css('height')) < 50) return;
			$("#menu-1").slideUp(300);
		});

		setInterval( async function(){
			if(flagUserChanged) getAllUsersInfo();
			getUser();
			checkTab();
		}, 1000);

		setTimeout(function(){
			$("#btn-menu-6").click(); 
			$(".search-div").fadeIn();
		}, 200);

		$("#btn-menu-7").click(function(){
			if(tabActive == 3) return;
			tabActive = 3;
			MenuBottomHome.slideDown(300);
			MenuBottomProf.slideUp(300);
		});
	
		$("#btn-menu-8").click(function(){
			if(tabActive == 4) return;
			tabActive = 4;
			MenuBottomHome.slideUp(300);
			MenuBottomProf.slideUp(300);
			makeChatObjects();
		});
	
		$("#btn-menu-4").click(function(){
			if(tabActive == 0) return;
			tabActive = 0;
			MenuBottomHome.slideUp(300);
			if(firstTimeProf){
				setTimeout(function(){
					MenuBottomProf.slideDown(300);
					firstTimeProf = false;
				}, 200);
			}else{
				MenuBottomProf.slideDown(300);
			}
			getProfile();
		});
	
		$("#btn-menu-5").click(function(){
			if(tabActive == 1) return;
			tabActive = 1;
			MenuBottomHome.slideUp(300);
			MenuBottomProf.slideUp(300);
			makeUsersNextObjects();
		});
	
		$("#btn-menu-6").click(function(){
			if(tabActive == 2) return;
			tabActive = 2;
			MenuBottomHome.slideDown(300);
			MenuBottomProf.slideUp(300);
			makeEventsObjects();
		});

	})();



