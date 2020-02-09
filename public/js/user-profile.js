
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 48;
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#profile-div").css("min-height", confHeight + "px");
	
	let flagInfoProfile = false;
	let picOrder = 0;

	function getProfile() {
		$('#main-pic-div-c').css("background-image", "url(" + toUser.pics_url.main_pic + ")");
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(toUser.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(gender+"&nbsp&nbsp"+toUser.name);
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+toUser.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#label-user-location").text("São Paulo - SP");
		$("#main-descript-div-other-user").text(toUser.about);
	}

	$("#show-user-info").click(function () {
		if(flagInfoProfile) return;
		$("#other-label-user-info").slideDown(300);
		if(typeof toUser.about !== "undefined" && toUser.about != ""){
			$( "#main-descript-div-other-user" ).animate({
				width: "100%",
				opacity: "1"
			}, 600);
		}
		setTimeout(function(){
			$("#other-label-user-info").slideUp(600);
			if(typeof toUser.about !== "undefined" && toUser.about != ""){
				$( "#main-descript-div-other-user" ).animate({
					width: "0%",
					left: "100%",
					opacity: "0"
				}, 600, function(){
					$( "#main-descript-div-other-user" ).css("left", "0%");
				});
			}
			flagInfoProfile = false;
		}, 10000);
		flagInfoProfile = true;
	});

	$("#btn-menu-back").click(function () {
		window.location.replace(document.referrer);
	});

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in toUser) || picDiv.css("opacity") < 1) return;
		if(picOrder >= Object.values(toUser.pics_url).length-1) picOrder = -1;
		picDiv.fadeOut(150, function(){
			picDiv.css("background-image", "url(" + Object.values(toUser.pics_url)[++picOrder] + ")");
			picDiv.fadeIn(150);
		});
	});

	(function(){
		getProfile();
	})();



