
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 48;
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#profile-div").css("min-height", confHeight + "px");
	
	let flagInfoProfile = false;
	let picOrder = 0;
	let qtPicsTotal = 1+toUser.pics_url.sec_pics.filter(function(item){return item != "";}).length;

	function getProfile() {
		if(qtPicsTotal > 1){
			$("#btn-change-pic").append("<p style='font-size: 12px; height: 20px; margin-bottom: 0px;'><label id='act-pic'>1</label>&nbsp/&nbsp<label id='qt-pics'>"+qtPicsTotal+"</label></p>");
		}
		$('#main-pic-div-c').css("background-image", "url(" + toUser.pics_url.main_pic + ")");
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(toUser.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(gender+"&nbsp&nbsp<p style='display: contents; line-height: 25px;'>"+toUser.name+" "+toUser.lastname+"</p>");
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+toUser.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#label-user-location").text("São Paulo - SP");
		$("#main-descript-div-other-user").text(toUser.about);
		addAnotherInfos();
	}

	function addAnotherInfos(){
		let htmlInfos = [];
		let city = "";
		let work = "";
		if("location" in toUser) city = toUser.location.city;
		if("work" in toUser) work = toUser.work;
		if(city.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-street-view' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+city+"</label>");
		if(work.length > 0) htmlInfos.push("<label class='title-label label-name-other'><i class='fas fa-address-card' style='line-height: 0;font-size:18px; color: #aa98c5;vertical-align: middle;'></i>&nbsp&nbsp"+work+"</label>");
		if(htmlInfos.length == 0) return;
		$("#other-label-user-info").empty().append(htmlInfos.join(""));
	}

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		$("#other-label-user-info").slideDown(300);
		if(typeof toUser.about !== "undefined" && toUser.about != ""){
			$( "#main-descript-div-other-user" ).animate({
				opacity: "1",
				height: "100%"
			}, 600);
		}
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			if(typeof toUser.about !== "undefined" && toUser.about != ""){
				$( "#main-descript-div-other-user" ).animate({
					height: "0%",
					opacity: "0"
				}, 400);
			}
			flagInfoProfile = false;
		}, 10000);
		flagInfoProfile = true;
	});

	$("#btn-menu-back").click(function () {
		if(configParams.history == "next-u-main-view"){
			window.location.replace("main-view.html");
			configParams.history = "";
			setConfigParams(configParams);
			return;
		}
		window.location.replace(document.referrer);
	});

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in toUser) || picDiv.css("opacity") < 1) return;
		if(picOrder >= qtPicsTotal-1) picOrder = -1;
		picDiv.fadeOut(150, function(){
			let picActive = toUser.pics_url.main_pic;
			++picOrder;
			if(picOrder > 0) picActive = Object.values(toUser.pics_url.sec_pics)[picOrder-1]
			picDiv.css("background-image", "url(" + picActive + ")");
			$("#act-pic").text(picOrder+1);
			picDiv.fadeIn(150);
		});
	});

	(function(){
		getProfile();
		configParams.history = "main-view";
		setConfigParams(configParams);
	})();




