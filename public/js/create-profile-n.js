
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 48;
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#profile-div").css("min-height", confHeight + "px");
	
	let flagInfoProfile = false;
	let newInfosUser = {};
	let activeInfo = true;
	let picOrder = 0;
	let qtPicsTotal = Object.values(userInfo.pics_url).filter(function(item){return item != "";}).length;
	let iconEdit = "<i class='fas fa-compress edit-icon'></i>";

	function getProfile() {
		if(qtPicsTotal > 1){
			$("#btn-change-pic").append("<p style='font-size: 12px;'><label id='act-pic'>1</label>&nbsp<label id='qt-pics'>/ "+qtPicsTotal+"</label></p>");
		}
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(userInfo.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(iconEdit+gender+"&nbsp&nbsp"+iconEdit+"<input type='text' id='edit-name-input' placeholder='???' value='"+userInfo.name+"'/>");
		$("#label-user-age").html(iconEdit+"<span style='position: relative; top: -3px;'>"+userInfo.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#main-descript-div-other-user").html(iconEdit+"<textarea maxlength='114' id='edit-about-input'>"+userInfo.about+"</textarea>");
		addAnotherInfos();
	}

	function addAnotherInfos(){
		let htmlInfos = [];
		let city = userInfo.location.city || "";
		let work = userInfo.work || "";
		htmlInfos.push("<label class='title-label label-name-other'>"+iconEdit+"<i class='fas fa-street-view' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp<input type='text' id='edit-city-input' placeholder='???' value='"+city+"'/></label>");
		htmlInfos.push("<label class='title-label label-name-other'>"+iconEdit+"<i class='fas fa-address-card' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp<input type='text' id='edit-work-input' placeholder='???' value='"+work+"'/></label>");
		$("#other-label-user-info").empty().append(htmlInfos.join(""));
	}

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		setTimeout(function(){
			flagInfoProfile = false;
		}, 1000);
		flagInfoProfile = true;
		if(activeInfo){
			$("#other-label-user-info").slideUp(600);
			$( "#main-descript-div-other-user" ).animate({
				height: "0%",
				opacity: "0"
			}, 400);
			return activeInfo = false;
		}
		$("#other-label-user-info").slideDown(300);
		$("#main-descript-div-other-user" ).animate({
			opacity: "1",
			height: "100%"
		}, 600);
		activeInfo = true;
	});

	function calcAgeOfUser(dtNasc){
		if(typeof dtNasc == "undefined") return "?";
		let dtNow = new Date();
		let age = dtNow.getFullYear()-dtNasc.getFullYear();
		if(dtNow.getMonth() <= dtNasc.getMonth()){
			age--;
		}else if(dtNow.getDate() <= dtNasc.getDate()){
			age--;
		}
		return age || "?";
	}

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in userInfo) || picDiv.css("opacity") < 1) return;
		if(picOrder >= qtPicsTotal-1) picOrder = -1;
		picDiv.fadeOut(150, function(){
			picDiv.css("background-image", "url(" + Object.values(userInfo.pics_url)[++picOrder] + ")");
			$("#act-pic").text(picOrder+1);
			picDiv.fadeIn(150);
		});
	});

	(function(){
		getProfile();
		configParams.history = "main-view";
		setConfigParams(configParams);
		$("#other-label-user-info").slideDown(300);
		$( "#main-descript-div-other-user" ).animate({
			opacity: "1",
			height: "100%"
		}, 600);

		$("#edit-name-input").css("width", $("#edit-name-input").val().length*9+"px");
		$("#edit-city-input").css("width", $("#edit-city-input").val().length*9+"px");
		$("#edit-work-input").css("width", $("#edit-work-input").val().length*9+"px");

	})();

	$("#btn-menu-back").click(function () {
		window.location.replace(document.referrer);
	});

	$("#label-user-age").click(function(){
		$("#edit-age-input").focus();
	});

	$("#edit-age-input").focusout(function(){
		let dateInput = new Date($("#edit-age-input").val());
		let age = calcAgeOfUser(dateInput);
		newInfosUser.dt_nasc = dateInput;
		$("#label-user-age").html(iconEdit+"<span style='position: relative; top: -3px;'>"+age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
	});

	$("#edit-name-input").focusout(function(){
		newInfosUser.name = $("#edit-name-input").val();
	});

	$("#edit-city-input").focusout(function(){
		newInfosUser.fix_local = $("#edit-city-input").val();
	});

	$("#edit-name-input").keydown(function(){
		if($("#edit-name-input").width() > 160) return;
		$("#edit-name-input").css("width", $("#edit-name-input").val().length*9+"px");
	});

	$("#edit-city-input").keydown(function(){
		if($("#edit-city-input").width() > 160) return;
		$("#edit-city-input").css("width", $("#edit-city-input").val().length*9+"px");
	});

	$("#edit-work-input").keydown(function(){
		if($("#edit-work-input").width() > 160) return;
		$("#edit-work-input").css("width", $("#edit-work-input").val().length*9+"px");
	});

	$("#edit-about-input").keydown(function(){
		$("#edit-about-input").attr("maxlength", 110+($("#edit-about-input").val().split(" ").length/2));
		if($("#main-descript-div-other-user").width() > 260) return;
		$("#main-descript-div-other-user").css("width", $("#edit-about-input").val().length*9+"px");
	});

	$("#edit-work-input").focusout(function(){
		newInfosUser.work = $("#edit-work-input").val();
	});

	$("#edit-about-input").focusout(function(){
		newInfosUser.descript = $("#edit-about-input").val();
	});




