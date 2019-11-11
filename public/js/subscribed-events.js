
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("body").innerHeight($(window).height());
	$("#events-div").innerHeight($(window).height()-$("#logo-div").innerHeight()-$("#search-div").innerHeight());

	$("#btn-menu-back").click(function(){
		window.location.replace("main-view.html");
	});

	function getAllUsersInfo(){
		$("#subscribed-events-div").LoadingOverlay("show", {background: "rgba(63, 51, 74, 0.8)",imageColor: "rgba(193, 55, 120, 0.82)",});
		$.get("./get-users").done(function( data ) {
			if(data == null || data == "undefined"){
				  
			}else{
				var excludeSelf = data.filter(function (em){
					return userInfo.email != em.email
				});
				setAllUsersCache(excludeSelf);
				getAllEvents();
			}
			$("#subscribed-events-div").LoadingOverlay('hide');
		});
	}

	function getAllEvents() {
		$.get("./get-events").done(function (data) {
			if (data == null || data == "undefined") {

			} else {
				setAllEvents(data);
				makeEventsObjects();
			}
			
		}).fail(function(){
			
		});
	}

	function makeEventsObjects() {
		var allEventsWithUser = [];
		allEvents.forEach(function(data){
			for(var i = 0; i < data.participants.length; ++ i){
				if(userInfo._id == data.participants[i]._id){
					allEventsWithUser.push(data);
				}
			}
		});
		//console.log(allEventsWithoutUser);
		allEventsWithUser.forEach(function (data, i) {
			if (i % 2 == 0) {
				$("#events-div").append("<div class='events-t' style='background-color: rgba(255, 255, 255, 0.24);' name='" + data._id + "'>" +
					"<label class='user-d-u-label event-user-label'>" + data.local + "<input class='event-notsubscribe-btn' name='"+data._id+"' type='button' value='DEIXAR'/><input class='event-seedetails-btn' name='"+data._id+"' type='button' value='DETALHES'/></label>" +
					"</div>");
			} else {
				$("#events-div").append("<div class='events-t' name='" + data._id + "'>" +
				"<label class='user-d-u-label event-user-label'>" + data.local + "<input class='event-notsubscribe-btn' name='"+data._id+"' type='button' value='DEIXAR'/><input class='event-seedetails-btn' name='"+data._id+"' type='button' value='DETALHES'/></label>" +
				"</div>");
			}
			$(".event-notsubscribe-btn").click(function () {
				if(window.confirm("Você tem certeza que não quer seguir mais este evento?")){
					var userBasic = {};
					userBasic._id = userInfo._id;
					userBasic.name = userInfo.name;
					userBasic.main_pic = userInfo.pics_url.main_pic;

					$.get("./exit-event", {
						_id: 	$(this).attr('name'),
						user: userBasic
					}).done(function( data ) {
						if(data == null || data == "undefined"){
							console.log("Deu merda");
						}else{
							$("#events-div").empty();
							getAllEvents();
						}
					});
				}
			});

			data.participants.forEach(function(participant){
				if(userInfo._id != participant._id){
					var fullParticipant = getProfileSubject(participant._id);
					$(".events-t[name='" + data._id + "']").append("<div class='user-e-u-div mx-auto'>"
					+ "<div id='user-e-u-div-content' name='" + participant._id + "'>"
					+ "<div class='send-msg-button' name='" + JSON.stringify(fullParticipant) + "'><i class='fas fa-comment-dots' style='font-size:28px; color:white; transform: translateY(-6px); float: right;text-shadow: 2px 2px 2px black'></i></div></div>"
					+ "</div>");
					$("#user-e-u-div-content[name='" + participant._id + "']").css("background-image", "url(" + participant.main_pic + "");
				}
				//console.log(fullParticipant);
			});
			
		});
		$(".events-t").fadeIn("slow");
		$(".send-msg-button").click(function () {
			setToUser($(this).attr('name'));
			window.location.href = "./user-conversation.html"
		});
	}

	function getProfileSubject(id){
		for(var i = 0; i < allUsersInfo.length; ++i){
			if(allUsersInfo[i]._id == id){
				return allUsersInfo[i];
				break;
			}
		}
	}

	$(document).ready(function(){
		$("#search-input").on("keyup", function() {
		  var value = $(this).val().toLowerCase();
		  $(".profile-info-div *").filter(function() {
			  $(this).parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		  });
		});
	  });

	getAllUsersInfo();