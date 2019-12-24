
	var h = $(window).height() / 10;
	$("#form-main").innerHeight(h * 9);
	$("#logo-div").innerHeight(44);
	//$("#logo-div").css("background-color", "rgba(59, 29, 78, 0.75)");
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#events-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#profile-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#next-u-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#chat-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#menu-bottom-prof").css("margin-bottom", $("#menu-bottom-div").innerHeight() + "px");
	$("#menu-top-div").innerHeight(h * 1);
	// $("#logo-div img").innerHeight(h / 1.6);
	//$("html").innerHeight("auto");
	//$("body").innerHeight($(window).height() - 60);

	$("#btn-menu-1").attr("disabled", true);
	
	let flagInfoProfile = false;

	function getAllUsersInfo() {
		$("#main-body-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$.get("./get-users", {_id: userInfo._id}).done(function (data) {
			if (!(isNullOrUndefined(data))) {
				setAllUsersCache(data);
				makeChatObjects();
				//makeUsersNextObjects();
			}
			$("#main-body-div").LoadingOverlay('hide');
			$("#btn-menu-1").attr("disabled", false);
		}).fail(function(){
			$("#error-div").css("display", "show");
			$("#main-body-div").LoadingOverlay('hide');
			$("#btn-menu-1").attr("disabled", false);
		});
	}

	$("#reload-error").click(function(){
		$("#error-div").css("display", "none");
		getAllUsersInfo();
		getProfile();
		getMainImg();
		verifyAdminPermission();
	});

	function getAllEvents() {
		$.get("./get-events").done(function (data) {
			if (data == null || data == "undefined") {

			} else {
				setAllEvents(data);
				//console.log(allEvents);
				makeEventsObjects();
			}
			
		}).fail(function(){
			$("#error-div").css("display", "show");
			$("#main-body-div").LoadingOverlay('hide');
			$("#btn-menu-1").attr("disabled", false);
		});
	}

	function makeEventsObjects() {
		//console.log(allEvents);
		var allEventsWithoutUser = [];//allEvents.slice();
		allEvents.forEach(function(data){
			var flag = false;
			var participantLength = data.participants.length;
			for(var i = 0; i < participantLength; ++i){
				if(userInfo._id != data.participants[i]._id){
					flag = true;
				}else{
					flag = false;
					break;
				}
			}
			if(flag){
				allEventsWithoutUser.push(data);
			}
		});

		if(allEventsWithoutUser.length == 0){
			//$("#events-box-div").append("<p>Sem eventos no momento</p>");
			$("#events-box-div").empty();
			return;
		}

		let createdDivs = "";
		allEventsWithoutUser.forEach(function (data, i) {
			if (i % 2 == 0) {
				createdDivs +="<div class='events-t' style='background-color: rgba(255, 255, 255, 0.24);' name='" + data._id + "'>";
			} else {
				createdDivs += "<div class='events-t' name='" + data._id + "'>";
			}
			createdDivs += "<label class='user-d-u-label event-user-label'>" + data.local + "<input class='event-subscribe-btn' name='"+data._id+"' type='button' value='PARTICIPAR'/></label>" +
			"<label class='user-d-u-label chat-msg-label' style='padding-left: 18px; color: rgba(245, 234, 159, 0.99);'> No dia: &nbsp&nbsp"+ data.data +" as " + data.horario +"</label>"+
			"<label class='user-d-u-label chat-msg-label' style='padding-left: 18px;'>"+data.descricao+"</label>"+
			"</div>";

		});

		$("#events-box-div").empty();
		$("#events-box-div").append(createdDivs);

		$(".event-subscribe-btn").click(function () {
			$("#main-body-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
			var userBasic = {_id: userInfo._id, name: userInfo.name, main_pic: userInfo.pics_url.main_pic};
			$.get("./upd-event", {
				_id: 	$(this).attr('name'),
				user: userBasic
			}).done(function( data ) {
				if(isNullOrUndefined(data)){
					console.log("Deu merda");
				}else{
					getAllEvents();
					$("#main-body-div").LoadingOverlay('hide');
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
		allUsersInfo.forEach(function (data) {
			var cityD = data.location ? data.location.city_district : "???";
			createdDivs += "<div class='user-n-u-div mx-auto'>"
			+ "<label class='user-n-u-label'>" + data.name + "</label>"
			+ "<div id='user-n-u-div-content' name='" + data._id + "' style='background-image: url(" + data.pics_url.main_pic + "'>"
			+ "<div class='send-msg-button' name='" + JSON.stringify(data) + "'><i class='fas fa-comment-dots' style='font-size:28px; color:white; transform: translateY(-6px); float: right;text-shadow: 2px 2px 2px black'></i></div></div>"
			+ "<label id='city-district-n-u-label'>" + cityD + "</label></div>";
		});

		$("#next-u-users").append(createdDivs);

		// allUsersInfo.forEach(function (data) {
		// 	$("#user-n-u-div-content[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
		// });

		$(".send-msg-button").click(function () {
			setToUser($(this).attr('name'));
			window.location.href = "./user-conversation.html"
		});
	}

	function makeChatObjects() {
		var usersDistincs = Object.values(_.groupBy(userInfo.messages, msg => msg.author));
		//console.log(usersDistincs);
		var profiles = [];
		var userMsgs = [];
		usersDistincs.forEach(function(data, i){
			//console.log(data);
			if(data[0].subject == userInfo._id) {
				var prof = getProfileSubject(data[0].author);
			}else if(data[0].author == userInfo._id){
				userMsgs = data;
				var prof = getProfileSubject(data[0].subject);
			}
			if(!profiles.includes(prof) && typeof prof !== "undefined"){
				profiles.push(prof);
			}
		});

		userMsgs = Object.values(_.groupBy(userMsgs, msg => msg.subject))

		userMsgs.forEach(function(data){
			var prof = getProfileSubject(data[0].subject);
			if(!profiles.includes(prof) && typeof prof !== "undefined"){
				profiles.push(prof);
			}
		});

		var divsCreated = ""; 
		profiles.forEach(function(data, j){
			//console.log(getLastMessage(data._id, usersDistincs));
			var lastMsgSubject = "";
			var lastMsgUser = "";
			var userLength = userMsgs.length;
			lastMsgSubject = getLastMessage(data._id, usersDistincs);
			for(var i = 0; i < userLength; ++i){
				if(data._id == userMsgs[i][0].subject){
					lastMsgUser = userMsgs[i][userMsgs[i].length-1];
					break;
				}
			}

			var dateMsgUser = new Date(lastMsgUser.date);
			var dateMsgSubject = new Date(lastMsgSubject.date);
			
			if(lastMsgUser == "" || dateMsgSubject.getTime() > dateMsgUser.getTime()){
				var lastMsg = lastMsgSubject;
			}else if(lastMsgSubject == "" || dateMsgSubject.getTime() <= dateMsgUser.getTime()){
				var lastMsg = lastMsgUser;
			}
			
			if (j % 2 == 0) {
				divsCreated += "<div class='users-t-chat' style='background-color: rgba(255, 255, 255, 0.3);' name='" + JSON.stringify(data) + "'>";
			} else {
				divsCreated += "<div class='users-t-chat' name='" + JSON.stringify(data) + "'>";
			}
			divsCreated += "<div id='profile-img-div' name='" + data._id + "' style='background-image: url(" + data.pics_url.main_pic + "'></div>" +
			"<div class='profile-info-div'>" +
			"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
			"<label class='user-d-u-label chat-msg-label'>" + lastMsg.text + "</label>" +
			"</div></div>";
		});

		$("#chat-users-div").append(divsCreated);
		
		// profiles.forEach(function(data){
		// 	$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
		// });

		$("#chat-users-div").append("<div style=' height: "+$("#menu-bottom-div").innerHeight()+"px'></div>");

		$(".users-t-chat").click(function () {
			var elmt = $(".users-t-chat[name='" + $(this).attr('name') + "']");
			elmt.css("background-color", "rgba(255, 255, 255, 0.6)");
			var subject = $(this).attr('name');
			setTimeout(function () {
				setToUser(subject);
				window.location.href = "./user-conversation.html"
			}, 100);
		});
	}

	function getLastMessage(id, usersDistincs){
		var usersDistincsLength = usersDistincs.length;
		for(var i = 0; i < usersDistincsLength; ++i){
			if(usersDistincs[i][0].author == id){
				return usersDistincs[i][usersDistincs[i].length-1];
			}
		}
		return "";
	}

	function getProfileSubject(id){
		var allUsersInfoLength = allUsersInfo.length;
		for(var i = 0; i < allUsersInfoLength; ++i){
			if(allUsersInfo[i]._id == id){
				return allUsersInfo[i];
			}
		}
	}

	function getMainImg() {
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
	}

	function getProfile() {
		$("#label-user-name").text(userInfo.name);
		$("#label-user-age").text(userInfo.age + " anos");
		$("#label-user-location").text("São Paulo - SP");
	}

	$("#btn-menu-1").click(function () {
		$("#menu-1").slideToggle(300);
	});

	$("body").click(function () {
		if (parseInt($("#menu-1").css('height')) < 50) {
			return;
		}
		$("#menu-1").slideUp(300);
	});

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
		if (!userInfo.is_admin) {
			return false;
		}
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
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			flagInfoProfile = false;
		}, 10000);
		flagInfoProfile = true;
	});

	$("#btn-change-pic").click(function(){
		$('#main-pic-div-c').fadeOut(300, function(){
			$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.sec_pic1 + ")");
			$('#main-pic-div-c').fadeIn(300);
		});
	});

	// getAllUsersInfo();
	// getProfile();
	// getMainImg();
	// verifyAdminPermission();

	(function(){
		getAllUsersInfo();
		getAllEvents();
		getProfile();
		getMainImg();
		verifyAdminPermission();
	})();