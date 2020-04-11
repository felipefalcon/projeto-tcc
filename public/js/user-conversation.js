

	$("body").innerHeight($(window).height());
	$("#chat-msgs-div").css("min-height", $(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight() + "px");
	$("#chat-msgs-div").innerHeight($(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight());

	// Para verificar se o serviço ainda está sendo chamado
	let inCallGetMessages = false;
	let inCallUpdMsgs = false;
	let inCallUpdMsgsBD = false;
	let cachedMsgsHere = {};
	let ajaxMsgs = "";

	function setInfoToUser() {
		$("#send-to-name-label").text(toUser.name+" "+toUser.lastname.split(" ")[0]);
		$("#profile-img-div-chat").css("background-image", "url(" + toUser.pics_url.main_pic + "");
	}

	$("#btn-menu-back").click(function () {
		if(configParams.history == "main-view") {
			window.location.replace("./main-view.html");
			configParams.history = "";
			return setConfigParams(configParams);
		}
		window.location.replace(document.referrer);
	});

	$("#send-message-button").click(function () {
		if ($("#message-send-input").val() == "") return;
		var message = {
			text: $("#message-send-input").val(),
		};
		inCallUpdMsgs = true;
		$("#message-send-input").val("");
		let divsCreated = [];
		$.get("./upd-users-messages", { _id_from: userInfo._id, _id_to: toUser._id, message: message })
		.done(function (data) {
				if (data == null || data == "undefined") {
					alert("Algum erro");
				} else {
					inCallUpdMsgs = false;
					let msg = data;
					$("#message-send-input").val("");
					divsCreated.push("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 8px; background-color: #ffeafe;'><p class='chat-sub-p'>" + 
					$.format.date(msg.date_msg.toString(), 'dd/MM/yyyy - HH:mm') +
					" - Você diz:</p><p class='chat-msg-p' style='color: #706589;'>" + message.text + "</p></div>");
					$("#chat-msgs-div").append(divsCreated.join(""));
					ajaxMsgs.abort();
					inCallGetMessages = false;
					if(parseInt($("#chat-msgs-div").scrollTop()) <= parseInt(document.getElementById("chat-msgs-div").scrollHeight-520)){
						if(parseInt($("#chat-msgs-div").scrollTop()) > parseInt(document.getElementById("chat-msgs-div").scrollHeight-520)-110){
							if(parseInt(document.getElementById("chat-msgs-div").scrollHeight+520) == parseInt($("#chat-msgs-div").scrollTop())) return;
							$("#chat-msgs-div").animate({
								scrollTop: parseInt(document.getElementById("chat-msgs-div").scrollHeight+520)
							}, 3000);
							$("#message-send-input").val("");
						}
					}
				}
			});
	});

	function scrollChat(){
		if(parseInt($("#chat-msgs-div").scrollTop()) <= parseInt(document.getElementById("chat-msgs-div").scrollHeight-520)){
			if(parseInt($("#chat-msgs-div").scrollTop()) > parseInt(document.getElementById("chat-msgs-div").scrollHeight-520)-110){
				if(parseInt(document.getElementById("chat-msgs-div").scrollHeight+520) == parseInt($("#chat-msgs-div").scrollTop())) return;
				$("#chat-msgs-div").animate({
					scrollTop: parseInt(document.getElementById("chat-msgs-div").scrollHeight+520)
				}, 3000);
				return true;
			}
		}
		return false;
	}

	function getNewMessages() {
		// if(inCallGetMessages || inCallUpdMsgs) return;
		inCallGetMessages = true;
		ajaxMsgs = $.get("./get-user-msgs", { _id: userInfo._id })
					.done(function (data) {
						if (data == null || data == "undefined") {
							alert("Algum erro");
						} else {
							inCallGetMessages = false;
							if(inCallUpdMsgs || cachedMsgsHere == JSON.stringify(data)) return;
							cachedMsgsHere = JSON.stringify(data);
							userInfo.conversations = data;
							setUserCache(userInfo);
							makeChatMessage();
						}
					});
	}

	function makeChatMessage() {
		// if(JSON.stringify(userInfo) === JSON.stringify(cachedUserHere)) return;
		// cachedUserHere = userInfo;
		if(userInfo.conversations.length == 0) return;
		let divsCreated = []; 
		let toUserMessages = userInfo.conversations.filter(function(item){return item._id == toUser._id;})[0];
		if(!toUserMessages) return;

		toUserMessages.messages.forEach(function(msg){
			if (msg.author == userInfo._id) {
				divsCreated.push("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 8px; background-color: #ffeafe;'><p class='chat-sub-p'>" + 
				$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
				" - Você diz:</p><p class='chat-msg-p' style='color: #706589;'>" + msg.text + "</p></div>"
				);
			} else{
				divsCreated.push("<div class='message-p' style='border-bottom-left-radius: 0px; margin-right: 8px;'><p class='chat-sub-p'>" +
					$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
					" - " + toUser.name + " diz:</p><p class='chat-msg-p'>" + 
					msg.text + "</p></div>"
				);
			}
		});
		
		$("#chat-msgs-div").empty().append(divsCreated.join(""));

		if(inCallUpdMsgsBD || toUserMessages.newmsgs == 0) return;
		inCallUpdMsgsBD = true;
		$.get("./upd-users-status-messages", {_id_from: userInfo._id, _id_to: toUser._id})
		.done(function(data){
			if (isNullOrUndefined(data)) {
				return alert("Algum erro");
			}
			inCallUpdMsgsBD = false;
		});
	}

	$("#btn-menu-1").click(function () {
		$("#menu-1").slideToggle(300);
	});

	$("#show-prof-btn").click(function () {
		window.location.href = "./user-profile.html";
	});

	$("#del-chat-btn").click(function () {
		setTimeout(function(){
			Swal.fire({
				title: 'Excluir conversa',
				text: 'Você tem certeza que deseja apagar a conversa que teve com este usuário?',
				icon: 'warning',
				padding: "8px",
				showCancelButton: true,
				allowOutsideClick: false,
				confirmButtonText: 'SIM',
				cancelButtonText: 'NÃO',
				focusCancel: true,
				width: "80%"
			}).then(function(data){
				if(data.value == true){
					$.get("./del-user-messages", {_id_from: userInfo._id, _id_to: toUser._id})
					.done(function(data){
						if (isNullOrUndefined(data)) {
							return alert("Algum erro");
						}
						setUserCache(data);
						$("#btn-menu-back").click();
					});
				}
			});
		}, 600);
	});

	$("#report-user-btn").click(function () {
		// setTimeout(function(){
		// 	Swal.fire({
		// 		title: 'Denunciar usuário',
		// 		text: 'Você tem certeza que deseja apagar a conversa que teve com este usuário?',
		// 		icon: 'warning',
		// 		padding: "8px",
		// 		showCancelButton: true,
		// 		allowOutsideClick: false,
		// 		confirmButtonText: 'SIM',
		// 		cancelButtonText: 'NÃO',
		// 		focusCancel: true,
		// 		width: "80%"
		// 	}).then(function(data){
		// 		if(data == true){
		// 			$.get("./del-user-messages", {_id_from: userInfo._id, _id_to: toUser._id})
		// 			.done(function(data){
		// 				if (isNullOrUndefined(data)) {
		// 					return alert("Algum erro");
		// 				}
		// 				setUserCache(data);
		// 				$("#btn-menu-back").click();
		// 			});
		// 		}
		// 	});
		// }, 100);
		setTimeout(function(){
			Swal.mixin({
				confirmButtonText: 'PRÓX. &rarr;',
				cancelButtonText: 'NÃO',
				showCancelButton: true,
				focusCancel: true,
				progressSteps: ['1', '2'],
				width: "80%"
			}).queue([
				{
				title: 'Denunciar usuário',
				text: 'Você tem certeza que deseja denunciar este usuário?'
				},
				{
					title: 'Denúncia',
					text: 'Selecione a razão para a denúncia',
					input: 'select',
					inputOptions: {
						reason_1: "Motivo 1",
						reason_2: "Motivo 2",
						reason_2: "Motivo 3",
					},
					confirmButtonText: 'ENVIAR'
				}
			]).then((result) => {
				if (result.value) {
				const answers = JSON.stringify(result.value)
				Swal.fire({
					title: 'Denúncia registrada',
					text: 'Obrigado pela sua denúcia. Ela será avaliada e assim que houver uma resposta, você receberá um email de feedback.',
					timer: 10000,
					icon: 'success',
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				})
				}
			});
		}, 600);
	});

	$("body").click( function () {
		if (parseInt($("#menu-1").css('height')) < 50) return;
		$("#menu-1").slideUp(300);
	});

	setInfoToUser();
	makeChatMessage();
	// getNewMessages();
	$("#chat-msgs-div").scrollTop(parseInt(document.getElementById("chat-msgs-div").scrollHeight+520));

	setInterval(function () {
		if(!inCallGetMessages) getNewMessages(); 
		// makeChatMessage(); 
	}, 500);

	// setInterval(function () {
	// 	// getNewMessages(); 
	// 	// makeChatMessage(); 
	// }, 50);
