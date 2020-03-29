
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
	let qtPicsTotal = 1+userInfo.pics_url.sec_pics.filter(function(item){return item != "";}).length;
	let tabActive = -1;
	let flagUserChanged = true;
	let cachedMessagesHere = [];
	let cachedEventsHere = [];
	let firstTimeProf = true;

	// Para verificar se o serviço ainda está sendo chamado
	let inCallGetUser = false;
	let inCallGetAllUsers = false;

	function getAllUsersInfo() {
		if(inCallGetAllUsers) return;
		inCallGetAllUsers = true;
		$.get("./get-users", {_id: userInfo._id}).done(function (data) {
			if (!(isNullOrUndefined(data))) {
				setAllUsersCache(data);
			}
			inCallGetAllUsers = false;
		}).fail(function(){
			$("#error-div").css("display", "show");
			inCallGetAllUsers = false;
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
			}
			
		}).fail(function(){
			$("#error-div").css("display", "show");
		});
	}

	function makeEventsObjects() {
		// console.log(allEvents);
		if(allEvents.length == 0 || !allEvents) return;
		let allEventsWithoutUser = [];//allEvents.slice();

		allEvents.forEach(function(data){
			let userFound = data.participants.find(function(item){return item == userInfo._id});
			if((typeof userFound === "undefined")){
				allEventsWithoutUser.push(data);
			}
		});

		if(allEventsWithoutUser.length == 0){
			$("#events-box-div").empty();
			return;
		}

		// Verifica se algo mudou, se não mudou ele volta e não faz mais nada
		// if(_.isEqual(cachedEventsHere, allEventsWithoutUser)) return;
		// cachedEventsHere = allEventsWithoutUser.slice();

		let divsCreated = []; 
		allEventsWithoutUser.forEach( function (data, i) {
			let imgData = "";
			if("img" in data) imgData = "background: url("+data.img+") center; background-size: cover; background-color: rgba(250, 237, 255, 0.3);"
			divsCreated.push("<div class='events-t' style='background-color: rgba(250, 237, 255, 0.3);"+imgData+"' name='" + data._id + "'>");
			
			let dateEvent = new Date(data.data);
			let dayEvent = new Number(dateEvent.getDate())+1;
			let monthEvent = new Number(dateEvent.getMonth())+1;
			if(dayEvent < 10) dayEvent = "0" + dayEvent;
			if(monthEvent < 10) monthEvent = "0" + monthEvent;
			divsCreated.push("<label class='user-d-u-label event-user-label'>" + data.title + " - " + data.address.road + " - " + data.address.house_number + "<button class='event-subscribe-btn' name='"+data._id+
			"'><i class='fas fa-hand-peace'></i></button></label><label class='event-msg-label'><p style='line-height: 0px;font-size: 8px; margin-bottom: 15px; color: rgba(255, 255, 255, 0.8);'>" 
			+ dateEvent.getFullYear() 
			+ "</p><p style='line-height: 10px; font-size: 22px; margin-bottom: 8px;'>" + dayEvent + "/" + monthEvent + "</p>"
			+ data.horario +"</label></div>");

		});
		divsCreated.push("<div style=' height: 100px'></div>");

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

	$(window).scroll(function(){
		if (tabActive != 2) return;
		let poseWindow = $(window).scrollTop() - $("#events-div").innerHeight() - $("#logo-div").innerHeight();
		$(".events-t").each(function(){
			let poseItem = $(this).offset().top - $(window).height();
			if(poseItem < poseWindow){
				if($(this).css("opacity") <= 0.4) return;
				$(this).animate({opacity: "0.4"}, 200);
			}else{
				if($(this).css("opacity") >= 1) return;
				$(this).animate({opacity: "1"}, 200);
			} 
		});
	});

	function makeUsersNextObjects() {
		let createdDivs = "";
		allUsersInfo.forEach( function (data) {
			var cityD = data.location ? data.location.city_district : "???";
			createdDivs += "<div class='user-n-u-block'><div class='user-n-u-div'><label class='user-n-u-label'>" + 
			data.name +" "+ data.lastname + "</label><i class='fas fa-user-circle view-prof-icon' name='"+data._id+
			"' ></i><div id='user-n-u-div-content' name='" +
			data._id + "' style='background-image: url(" + data.pics_url.main_pic + "'><div class='send-msg-button' name='" +
			data._id + "'><i class='fas fa-comment send-msg-icon' ></i></div></div><label id='city-district-n-u-label'>" + 
			cityD + "</label></div></div>";
		});

		$("#next-u-users").empty().append(createdDivs);

		$(".send-msg-button").click(function () {
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setToUser(subject);
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

	function makeChatObjects() {
		let usersDistincs = userInfo.conversations;
		if(userInfo.conversations.length == 0) return;
		// Verifica se algo mudou, se não mudou ele volta e não faz mais nada
		if(JSON.stringify(cachedMessagesHere) == JSON.stringify(usersDistincs)) return;
		cachedMessagesHere = [...usersDistincs];

		let divsCreated = []; 
		const dateN = (new Date(getServerDate())).toLocaleDateString();
		usersDistincs.forEach(function(item){

			let profile = getProfInAllUsersById(item._id);
			let dateLastMsg = new Date(item.messages[0].date);
			
			if(dateLastMsg.toLocaleDateString() == dateN){
				dateLastMsg = "Hoje às " + (dateLastMsg.getHours() < 10 ? "0" : "") + dateLastMsg.getHours() + ":" + (dateLastMsg.getMinutes() < 10 ? "0" : "") + dateLastMsg.getMinutes();
			}else{
				dateLastMsg = dateLastMsg.toLocaleDateString();
			}

			let newMsgAlert = "";
			if(item.messages[0].status == "0"){
				newMsgAlert = "<span class='new-msg'><i class='fas fa-exclamation'></i></span>";
			}
			
			divsCreated.push("<div class='users-t-chat' name='" + item._id + "'>"+ newMsgAlert +"<div id='profile-img-div' style='background-image: url(" + profile.pics_url.main_pic +
			 "'></div><div class='profile-info-div'><label class='user-d-u-label chat-user-label'>" + profile.name + 
			"<span class='chat-date-label'>"+ dateLastMsg +"</span></label><label class='user-d-u-label chat-msg-label'>" 
			+ item.messages[0].text + "</label></div></div>");
		});

		divsCreated.push("<div style=' height: "+$("#menu-bottom-div").innerHeight()+"px'></div>");
		$("#chat-users-div").empty().append(divsCreated.join(""));

		$(".users-t-chat").click( function () {
			var elmt = $(".users-t-chat[name='" + $(this).attr('name') + "']");
			elmt.css("background-color", "#e8e8e8");
			var idSubject = $(this).attr('name').toString();
			var subject = JSON.stringify(allUsersInfo.find(function(item){return item._id == idSubject}));
			setTimeout(function () {
				setToUser(subject);
				window.location.href = "./user-conversation.html";
			}, 60);
		});
	}


	function getProfInAllUsersById(id){
		return allUsersInfo.find(function(item){return item._id == id;});
	}

	function getUser(){
		if(inCallGetUser) return;
		inCallGetUser = true;
		$.get(nodeHost+"get-user", { email: userInfo.email}).done(function (data) {
			if (isNullOrUndefined(data)) {
				console.log("Deu merda");
			}else {
				data.conversations.forEach(function(item){
					item.messages[0].date = new Date($.format.date(item.messages[0].date, 'ddd MMM dd yyyy HH:mm:ss'));
				});
				if(JSON.stringify(userInfo) == JSON.stringify(data)) {
					flagUserChanged = false;
					return inCallGetUser = false;
				}
				setUserCache(data);
				getQtNoReadMsgs();
				flagUserChanged = true;
				inCallGetUser = false;
			}
		});
	}

	function getProfile() {
		// getUser();
		if(qtPicsTotal > 1){
			$("#btn-change-pic").append("<p style='font-size: 12px;'><label id='act-pic'>1</label>&nbsp/&nbsp<label id='qt-pics'>"+qtPicsTotal+"</label></p>");
		}
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(userInfo.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(gender+"&nbsp&nbsp<p style='display: contents; line-height: 25px;'>"+userInfo.name+" "+userInfo.lastname+"</p>");
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+userInfo.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#main-descript-div").text(userInfo.about);
		addAnotherInfos();
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
	}

	function addAnotherInfos(){
		let htmlInfos = [];
		let city = "";
		let work = "";
		if(location in userInfo) city = userInfo.location.city;
		if(work in userInfo) work = userInfo.work;
		if(city.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-street-view' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+city+"</label>");
		if(work.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-address-card' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+work+"</label>");
		if(htmlInfos.length == 0) return;
		$("#other-label-user-info").empty().append(htmlInfos.join(""));
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
		resetAllUsersCache();
		resetToUser();
		resetAllEvents();
		resetUserCache();
		window.location.replace("/");
	});

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		$("#other-label-user-info").slideDown(300);
		$( "#main-descript-div" ).animate({
			opacity: "1",
			height: "100%"
		}, 600);
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			$( "#main-descript-div" ).animate({
				height: "0%",
				opacity: "0"
			}, 400);
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
			if(picOrder > 0) picActive = Object.values(userInfo.pics_url.sec_pics)[picOrder-1]
			picDiv.css("background-image", "url(" + picActive + ")");
			$("#act-pic").text(picOrder+1);
			picDiv.fadeIn(150);
		});
	});

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
			$("#qt-msgs").text(qtNoReadMsgs.toString());
		}
	}

	function clearAnotherTabs(){
		if(tabActive != 2) 	$("#events-box-div").empty();
		if(tabActive != 1)	$("#next-u-users").empty();
		if(tabActive != 4)	$("#chat-users-div").empty()
	}

	function checkTab(){
		clearAnotherTabs();
		switch(tabActive){
			case 4:  	makeChatObjects(); break;
			case 2: 	makeEventsObjects(); break;
			case 1: 	makeUsersNextObjects(); break;
			case 0: 	getProfile(); break;
			default: 	break;
		}
	}

	(function(){
		//getProfile();
		const MenuBottomHome = $("#menu-bottom-home");
		const MenuBottomProf = $("#menu-bottom-prof");
		MenuBottomHome.slideUp(1);
		MenuBottomProf.slideUp(1);
		getQtNoReadMsgs();
		getAllUsersInfo();
		getAllEvents();
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
			if(tabActive == 4) checkTab();
		}, 1000);

		setInterval(function(){
			if(flagUserChanged) getAllUsersInfo();
		}, 10000);

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
				if(configParams.tab == "main-tab" || JSON.stringify(configParams) == "{}"){
					$("#btn-menu-6").click();
					clearInterval(initTabs);
				}
			}
		}, 50);

		$("#btn-menu-7").click(function(){
			if(tabActive == 3) return;
			tabActive = 3;
			MenuBottomHome.slideDown(300);
			MenuBottomProf.slideUp(300);
			checkTab();
		});
	
		$("#btn-menu-8").click(function(){
			if(tabActive == 4) return;
			tabActive = 4;
			configParams.tab = "chat-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideUp(300);
			MenuBottomProf.slideUp(300);
			cachedMessagesHere = [];
			checkTab();
		});
	
		$("#btn-menu-4").click(function(){
			if(tabActive == 0) return;
			tabActive = 0;
			configParams.tab = "profile-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideUp(300);
			if(firstTimeProf){
				setTimeout(function(){
					MenuBottomProf.slideDown(300);
					firstTimeProf = false;
				}, 200);
			}else{
				MenuBottomProf.slideDown(300);
			}
			checkTab();
		});
	
		$("#btn-menu-5").click(function(){
			if(tabActive == 1) return;
			tabActive = 1;
			configParams.tab = "next-u-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideUp(300);
			MenuBottomProf.slideUp(300);
			checkTab();
		});
	
		$("#btn-menu-6").click(function(){
			if(tabActive == 2) return;
			tabActive = 2;
			configParams.tab = "main-tab";
			setConfigParams(configParams);
			MenuBottomHome.slideDown(300);
			MenuBottomProf.slideUp(300);
			checkTab();
		});

	})();



