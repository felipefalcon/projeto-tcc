

	$("body").innerHeight($(window).height());
	$("#chat-msgs-div").css("min-height", $(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight() + "px");
	$("#chat-msgs-div").innerHeight($(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight());

	// Para verificar se o serviço ainda está sendo chamado
	let inCallGetUser = false;
	let inCallUpdMsgs = false;

	function setInfoToUser() {
		$("#send-to-name-label").text(toUser.name);
		$("#profile-img-div-chat").css("background-image", "url(" + toUser.pics_url.main_pic + "");
	}

	$("#btn-menu-back").click(function () {
		window.location.replace(document.referrer);
	});

	$("#send-message-button").click(function () {
		if ($("#message-send-input").val() == "") return;
		var message = {
			author: userInfo._id,
			subject: toUser._id,
			text: $("#message-send-input").val(),
		};
		inCallUpdMsgs = true;
		$.get("./upd-users-messages", { _id_from: userInfo._id, _id_to: toUser._id, message: message })
			.done(function (data) {
				if (data == null || data == "undefined") {
					alert("Algum erro");
				} else {
					inCallUpdMsgs = false;
					$("#message-send-input").val("");
					// getNewMessages();
					setTimeout(function(){
						$("#chat-msgs-div").scrollTop(1000000000000000);
					}, 3000);
				}
			});
	});

	function getNewMessages() {
		if(inCallGetUser || inCallUpdMsgs) return;
		inCallGetUser = true;
		$.get("./get-user", { email: userInfo.email })
			.done(function (data) {
				if (data == null || data == "undefined") {
					alert("Algum erro");
				} else {
					inCallGetUser = false;
					if(JSON.stringify(userInfo) === JSON.stringify(data)) return;
					setUserCache(data);
					makeChatMessage();
				}
			});
	}

	function makeChatMessage() {
		if(inCallUpdMsgs) return;
		if(("messages" in userInfo)) {
			userInfo.messages = userInfo.messages.reverse();
		};
		if(typeof userInfo.messages == "undefined") return;
		// for(var i = 0; i < userInfo.messages.length; ++i){
		// 	var msg = userInfo.messages[i];
		// 	if (msg.author == userInfo._id && msg.subject == toUser._id) {
		// 		$("#chat-msgs-div").append("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 12px; background-color: #f1e1ff;'>" +
		// 			"<p class='chat-sub-p'>" + $.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') + "</p>" +
		// 			"<p class='chat-msg-p'>" + msg.text.toString() + "</p>" +
		// 			"</div>"
		// 		);
		// 	} else if(msg.subject == userInfo._id && msg.author == toUser._id){
		// 		$("#chat-msgs-div").append("<div class='message-p' style='border-bottom-left-radius: 0px; margin-right: 12px;'>" +
		// 			"<p class='chat-sub-p'>" + $.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') + " - " + toUser.name + " diz:</p>" +
		// 			"<p class='chat-msg-p'>" + msg.text.toString() + "</p>" +
		// 			"</div>"
		// 		);
		// 		msg.status = 1;
		// 	}
		// }
		let divsCreated = []; 
		userInfo.messages.forEach(function(msg){
			if (msg.author == userInfo._id && msg.subject == toUser._id) {
				divsCreated.push("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 8px; background-color: #ffeafe;'><p class='chat-sub-p'>" + 
				$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
				" - Você diz:</p><p class='chat-msg-p' style='color: #706589;'>" + msg.text.toString() + "</p></div>"
				);
			} else if(msg.subject == userInfo._id && msg.author == toUser._id){
				divsCreated.push("<div class='message-p' style='border-bottom-left-radius: 0px; margin-right: 8px;'><p class='chat-sub-p'>" +
					$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
					" - " + toUser.name + " diz:</p><p class='chat-msg-p'>" + 
					msg.text.toString() + "</p></div>"
				);
			}
		});
		
		$("#chat-msgs-div").empty().append(divsCreated);
		$.get("./upd-users-status-messages", {_id_from: userInfo._id, _id_to: toUser._id})
		.done(function(data){
			if (isNullOrUndefined(data)) {
				return alert("Algum erro");
			}
			// setUserCache(userInfo);
		});
	}

	setInfoToUser();
	makeChatMessage();
	$("#chat-msgs-div").scrollTop(1000000000000000);

	setInterval(function () { getNewMessages(); }, 1000);
