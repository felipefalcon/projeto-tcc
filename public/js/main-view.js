
	var h = $(window).height() / 10;
	$("#form-main").innerHeight(h * 9);
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#main-div").css("margin-top", $("#logo-div").innerHeight() + "px");
	$("#events-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#next-u-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#chat-div").css("min-height", $(window).innerHeight() - 64 - 48 + "px");
	$("#menu-top-div").innerHeight(h * 1);
	$("#logo-div img").innerHeight(h / 1.6);
	$("#main-pic-div-c").innerHeight(h * 6.5);
	$("html").innerHeight("auto");
	$("body").innerHeight($(window).height() - 60);

	$("#btn-menu-1").attr("disabled", true);

	function getAllUsersInfo() {
		$("#profile-div").LoadingOverlay("show", { background: "rgba(63, 51, 74, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$("#events-div").LoadingOverlay("show", { background: "rgba(63, 51, 74, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$("#next-u-div").LoadingOverlay("show", { background: "rgba(63, 51, 74, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$("#chat-div").LoadingOverlay("show", { background: "rgba(63, 51, 74, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$.get("./get-users").done(function (data) {
			if (data == null || data == "undefined") {

			} else {
				var excludeSelf = data.filter(function (em) {
					return userInfo.email != em.email
				});
				setAllUsersCache(excludeSelf);
				makeEventsObjects();
				makeUsersNextObjects();
				makeChatObjects();
			}
			$("#profile-div").LoadingOverlay('hide');
			$("#events-div").LoadingOverlay('hide');
			$("#next-u-div").LoadingOverlay('hide');
			$("#chat-div").LoadingOverlay('hide');
			$("#btn-menu-1").attr("disabled", false);
		});
	}

	function makeEventsObjects() {
		allUsersInfo.forEach(function (data, i) {
			if (i % 2 == 0) {
				$("#events-div").append("<div class='users-t' style='background-color: rgba(255, 255, 255, 0.24);' name='" + data._id + "'>" +
					"<div id='profile-img-div' name='" + data._id + "'></div>" +
					"<div class='profile-info-div'>" +
					"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
					"<label class='user-d-u-label chat-msg-label'>" + data.age + " anos - " + data.gender + "</label>" +
					"<label class='user-d-u-label'>" + data.email + "</label>" +
					"</div></div>");
				$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
			} else {
				$("#events-div").append("<div class='users-t' name='" + data._id + "'>" +
					"<div id='profile-img-div' name='" + data._id + "'></div>" +
					"<div class='profile-info-div'>" +
					"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
					"<label class='user-d-u-label chat-msg-label'>" + data.age + " anos - " + data.gender + "</label>" +
					"<label class='user-d-u-label'>" + data.email + "</label>" +
					"</div></div>");
				$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
			}
		});
		$(".users-t").fadeIn("slow");
	}

	function makeUsersNextObjects() {
		allUsersInfo.forEach(function (data) {
			var cityD = data.location ? data.location.city_district : "???";
			$("#next-u-users").append("<div class='user-n-u-div mx-auto'>"
			+ "<label class='user-n-u-label'>" + data.name + "</label>"
			+ "<div id='user-n-u-div-content' name='" + data._id + "'>"
			+ "<div class='send-msg-button' name='" + JSON.stringify(data) + "'><i class='fas fa-comment-dots' style='font-size:28px; color:white; transform: translateY(-6px); float: right;text-shadow: 2px 2px 2px black'></i></div></div>"
			+ "<label id='city-district-n-u-label'>" + cityD + "</label></div>");
		
			$("#user-n-u-div-content[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
		}
		);

		$(".send-msg-button").click(function () {
			setToUser($(this).attr('name'));
			window.location.href = "./user-conversation.html"
		});
	}

	function makeChatObjects() {
		var usersDistincs = Object.values(_.groupBy(userInfo.messages, msg => msg.author));
		console.log(usersDistincs);
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
			if(!profiles.includes(prof)){
				profiles.push(prof);
			}
		});

		userMsgs = Object.values(_.groupBy(userMsgs, msg => msg.subject))

		//console.log(userMsgs);

		profiles.forEach(function(data, j){
			//console.log(getLastMessage(data._id, usersDistincs));
			var lastMsgSubject = "";
			var lastMsgUser = "";
			lastMsgSubject = getLastMessage(data._id, usersDistincs);
			for(var i = 0; i < userMsgs.length; ++i){
				if(data._id == userMsgs[i][0].subject){
					lastMsgUser = userMsgs[i][userMsgs[i].length-1];
				}
			}
			if(lastMsgUser == "" || lastMsgSubject.date > lastMsgUser.date){
				var lastMsg = lastMsgSubject;
			}else if(lastMsgSubject == "" || lastMsgSubject.date <= lastMsgUser.date){
				var lastMsg = lastMsgUser;
			}
			
			if (j % 2 == 0) {
				$("#chat-users-div").append("<div class='users-t-chat' style='background-color: rgba(255, 255, 255, 0.24);' name='" + JSON.stringify(data) + "'>" +
					"<div id='profile-img-div' name='" + data._id + "'></div>" +
					"<div class='profile-info-div'>" +
					"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
					"<label class='user-d-u-label chat-msg-label'>" + lastMsg.text + "</label>" +
					"</div></div>");
				$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
			} else {
				$("#chat-users-div").append("<div class='users-t-chat' name='" + JSON.stringify(data) + "'>" +
					"<div id='profile-img-div' name='" + data._id + "'></div>" +
					"<div class='profile-info-div'>" +
					"<label class='user-d-u-label chat-user-label'>" + data.name + "</label>" +
					"<label class='user-d-u-label chat-msg-label'>" + lastMsg.text + "</label>" +
					"</div></div>");
				$("#profile-img-div[name='" + data._id + "']").css("background-image", "url(" + data.pics_url.main_pic + "");
			}
		});
		
	
		$(".users-t-chat").fadeIn("slow");

		$(".users-t-chat").click(function () {
			var elmt = $(".users-t-chat[name='" + $(this).attr('name') + "']");
			elmt.css("background-color", "rgba(255, 255, 255, 0.6)");
			var subject = $(this).attr('name');
			setTimeout(function () {
				setToUser(subject);
				window.location.href = "./user-conversation.html"
			}, 200);
		});
	}

	function getLastMessage(id, usersDistincs){
		for(var i = 0; i < usersDistincs.length; ++i){
			if(usersDistincs[i][0].author == id){
				return usersDistincs[i][usersDistincs[i].length-1];
			}
		}
	}

	function getProfileSubject(id){
		for(var i = 0; i < allUsersInfo.length; ++i){
			if(allUsersInfo[i]._id == id){
				return allUsersInfo[i];
				break;
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

	getAllUsersInfo();
	getProfile();
	getMainImg();
	verifyAdminPermission();