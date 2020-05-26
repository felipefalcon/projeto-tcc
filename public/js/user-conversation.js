

	$("body").innerHeight($(window).height());
	// $("#chat-msgs-div").css("min-height", $(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight() + "px");
	// $("#chat-msgs-div").innerHeight($(window).height() - $("#logo-div").innerHeight() - $("#menu-bottom-div").innerHeight());

	// Para verificar se o serviço ainda está sendo chamado
	let inCallGetMessages = false;
	let cachedMsgsHere = {};
	let indexMsg = 0;

	function setInfoToUser() {
		$("#send-to-name-label").text(toUser.name+" "+toUser.lastname.split(" ")[0]);
		$("#profile-img-div-chat").css("background-image", "url(" + toUser.pics_url.main_pic + "");
		let online = toUser.online == 1 ? "<div id='online-circle' style='margin-right: -6px;'></div>" : "";
		if(online.length > 0) $("#profile-img-div-chat").append(online);
	}

	$("#btn-menu-back").click(function () {
		userInfo.conversations.sort(function(item, item2){return (new Date(item2.messages[item2.messages.length-1].date))-(new Date(item.messages[item.messages.length-1].date));})
		setUserCache(userInfo);
		$.get("./upd-users-status-messages", {_id_from: userInfo._id, _id_to: toUser._id}).done(function(data){
			if(configParams.history == "main-view") {
				window.location.replace("./main-view.html");
				configParams.history = "";
				return setConfigParams(configParams);
			}
			window.location.replace(document.referrer);
		});
	});

	$("#send-message-button").click(function () {
		if ($("#message-send-input").val() == "") return;
		var message = {
			text: $("#message-send-input").val(),
		};
		$("#message-send-input").val("");
		$.get("./upd-users-messages", { _id_from: userInfo._id, _id_to: toUser._id, message: message });
		let divsCreated = [];
		divsCreated.push("<div class='message-p message-p-send' style='opacity: 0.6; border-bottom-right-radius: 0px; margin-left: 8px; background-color: #ffeafe;'><p class='chat-sub-p'>Enviando . . .</p><p class='chat-msg-p' style='color: #706589;'>" +
		message.text.toString() + "</p></div>");
		$("#chat-msgs-div").append(divsCreated.join(""));
		$("#chat-msgs-div").animate({scrollTop: parseInt(document.getElementById("chat-msgs-div").scrollHeight+520)}, 3000);

	});

	function getNewMessages() {
		// if(inCallGetMessages || inCallUpdMsgs) return;
		inCallGetMessages = true;
		$.get({url: nodeHost+"get-user-msgs", timeout: 3000}, { _id: userInfo._id })
		.done(function (data) {
			if (data == null || data == "undefined") {
				alert("Algum erro");
			} else {
				inCallGetMessages = false;
				userInfo.conversations = data;
				setUserCache(userInfo);
				makeChatMessage();
			}
		}).fail(function(data){
			inCallGetMessages = false;
		});
	}

	function makeChatMessage() {
		if(userInfo.conversations.length == 0 || inCallGetMessages) return;
		let divsCreated = []; 
		let toUserMessages = userInfo.conversations.filter(function(item){return item._id == toUser._id;})[0];
		if(!toUserMessages) return;

		if(indexMsg == toUserMessages.messages.length) return;
		
		if(indexMsg == 0){
			toUserMessages.messages.forEach(function(msg){
				$(".message-p-send").first().remove();
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
			$("#chat-msgs-div").append(divsCreated.join(""));
			indexMsg = toUserMessages.messages.length;
			return;
		}else{
			let msg = toUserMessages.messages[indexMsg];
			if (msg.author == userInfo._id) {
				$(".message-p-send").first().replaceWith("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 8px; background-color: #ffeafe;'><p class='chat-sub-p'>" + 
				$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
				" - Você diz:</p><p class='chat-msg-p' style='color: #706589;'>" + msg.text + "</p></div>"
				);
			} else{
				$("#chat-msgs-div").append("<div class='message-p' style='border-bottom-left-radius: 0px; margin-right: 8px;'><p class='chat-sub-p'>" +
					$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm') +
					" - " + toUser.name + " diz:</p><p class='chat-msg-p'>" + 
					msg.text + "</p></div>"
				);
			}
		}
		indexMsg++;
	}

	$("#btn-menu-1").click(function () {
		$("#menu-1").slideToggle(300);
	});

	$("#show-prof-btn").click(function () {
		configParams.show_msg_icon = false;
		setConfigParams(configParams);
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
		let inputsQuestion = {
			0: "Racismo",
			1: "Preconceito",
			2: "Abuso",
		};
		setTimeout(function(){
			Swal.mixin({
				confirmButtonText: 'PRÓX.',
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
					inputOptions: inputsQuestion,
					confirmButtonText: 'ENVIAR'
				}
			]).then((result) => {
				if (result.value) {
					const answersVal = Object.values(inputsQuestion);
					let report = {
						reason: answersVal[new Number(result.value[1])],
						user_id: userInfo._id
					};
					$.get(nodeHost+"upd-user-reports", {_id_to: toUser._id, report: report})
						.done(function( data ) {
							if(!isNullOrUndefined(data)){
								Swal.fire({
									title: 'Denúncia registrada',
									text: 'Obrigado pela sua denúcia. Ela será avaliada e assim que houver uma resposta, você receberá um email de feedback.',
									timer: 5000,
									icon: 'success',
									showConfirmButton: false,
									allowOutsideClick: false,
									width: "80%"
								})
							}
					});
				}
			});
		}, 600);
	});

	$("body").click( function () {
		if (parseInt($("#menu-1").css('height')) < 50) return;
		$("#menu-1").slideUp(300);
	});

	$.get("./upd-users-status-messages", {_id_from: userInfo._id, _id_to: toUser._id});
	setInfoToUser();
	makeChatMessage();
	// getNewMessages();
	$("#chat-msgs-div").scrollTop(parseInt(document.getElementById("chat-msgs-div").scrollHeight+520));

	setInterval(function () {
		if(!inCallGetMessages) getNewMessages(); 
		// makeChatMessage(); 
	}, 200);

	// setInterval(function () {
	// 	// getNewMessages(); 
	// 	// makeChatMessage(); 
	// }, 50);
