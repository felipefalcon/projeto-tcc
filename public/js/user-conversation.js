
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("body").innerHeight($(window).height());
	$("#chat-msgs-div").innerHeight($(window).height()-$("#logo-div").innerHeight()-$("#user-div").innerHeight()-$("#menu-bottom-div").innerHeight());

	function setInfoToUser(){
		$("#send-to-name-label").text(toUser.name);
		$("#send-to-name-label-2").text(toUser.name);
		$("#send-to-age-gender-label").text(toUser.age+" anos - "+toUser.gender);
		$("#send-to-location-label").text(toUser.location.city_district);
		$("#profile-img-div").css("background-image", "url("+toUser.pics_url.main_pic+"");
	}

	$("#btn-menu-back").click(function(){
		window.location.replace("./main-view.html");
	});

	$(document).ready(function(){
		$("#search-input").on("keyup", function() {
		  var value = $(this).val().toLowerCase();
		  $(".profile-info-div *").filter(function() {
			  $(this).parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		  });
		});
	});

	$("#send-message-button").click(function(){
		var message = {};
		message.author = userInfo._id;
		message.subject = toUser._id;
		message.text = $("#message-send-input").val();
		message.date = new Date();
		message.status = 0;
		$.get("./upd-users-messages", { _id_from: userInfo._id, _id_to: toUser._id, message: message})
		.done(function( data ) {
			if(data == null || data == "undefined"){
				alert("Algum erro");
			}else{
				getNewMessages();
			}
		});
	});

	function getNewMessages(){
		$.get("./get-user", { email: userInfo.email })
		.done(function( data ) {
			if(data == null || data == "undefined"){
				alert("Algum erro");
			}else{
				$("#message-send-input").val("");
				setUserCache(data);
				makeChatMessage();
			}
		});
	}

	function makeChatMessage(){
		$("#chat-msgs-div").empty();
		userInfo.messages.forEach(function(msg){
			//if(msg.subject != toUser._id) return;
			if(msg.author == userInfo._id){
				$("#chat-msgs-div").append("<div class='message-p' style='border-bottom-right-radius: 0px; margin-left: 12px; background-color: #f1e1ff;'>"+
				"<p class='chat-sub-p'>"+$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm')+"</p>"+
				"<p class='chat-msg-p'>"+msg.text.toString()+"</p>"+
				"</div>"
				);
			}else{
				$("#chat-msgs-div").append("<div class='message-p' style='border-bottom-left-radius: 0px; margin-right: 12px;'>"+
				"<p class='chat-sub-p'>"+$.format.date(msg.date.toString(), 'dd/MM/yyyy - HH:mm')+" - "+toUser.name+" diz:</p>"+
				"<p class='chat-msg-p'>"+msg.text.toString()+"</p>"+
				"</div>"
				);
			}
		});
	}

	setInfoToUser();
	makeChatMessage();

	setInterval(function(){getNewMessages();}, 10000)
