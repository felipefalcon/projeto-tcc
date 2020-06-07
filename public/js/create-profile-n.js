
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 48;
	$("#main-div").css("padding-top", $("#logo-div").innerHeight() + "px");
	$("#profile-div").css("min-height", confHeight + "px");
	$("body").css("min-height", $(window).innerHeight() + "px");
	$("html").css("min-height", $(window).innerHeight() + "px");
	$("#main-div").css("min-height", $(window).innerHeight() + "px");
	$("#main-div").css("height", $(window).innerHeight() + "px");
	$("#profile-div").css("min-height", $(window).innerHeight() + "px");
	$("#main-pic-div-c").css("min-height", $(window).innerHeight() + "px");
	$("#profile-div").css("height", $(window).innerHeight() + "px");
	$("#main-pic-div-c").css("height", $(window).innerHeight() + "px");
	
	let flagInfoProfile = false;
	let activeInfo = true;
	let picOrder = 0;
	let qtPicsTotal = 1+userInfo.pics_url.sec_pics.filter(function(item){return item != "";}).length;
	let iconEdit = "<i class='fas fa-compress edit-icon'></i>";
	let userBeforeModified = {...userInfo};
	let nameCachedHere = [];
	let nameAndLastNameCachedHere = [];

	function getProfile() {
		if(qtPicsTotal > 1){
			$("#btn-change-pic").append("<p style='font-size: 12px; height: 20px; margin-bottom: 0px;' id='qt-pics-p' ><label id='act-pic'>1</label>&nbsp/&nbsp<label id='qt-pics'>"+qtPicsTotal+"</label></p>");
		}
		$('#main-pic-div-c').css("background-image", "url(" + userInfo.pics_url.main_pic + ")");
		let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
		if(userInfo.gender == "M"){
			gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
		}
		$("#label-user-name").html(iconEdit+"<div id='gender-ico' style='display: inherit; width: 20px;'>"+gender+"</div>&nbsp&nbsp"+iconEdit+"<input type='text' id='edit-name-input' placeholder='???' value='"+userInfo.name+" "+userInfo.lastname+"'/>");
		$("#label-user-age").html("<span style='position: relative; top: -3px;'>"+userInfo.age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
		$("#main-descript-div-other-user").html(iconEdit+"<textarea maxlength='114' id='edit-about-input' placeholder='???'>"+userInfo.about+"</textarea>");
		if("dt_nasc" in userInfo){
			let dtNassFormat = new Date(userInfo.dt_nasc);
			let monthFormat = dtNassFormat.getMonth()+1 < 10 ? "0" : "";
			let dayFormat = dtNassFormat.getDate() < 10 ? "0" : "";
			$("#edit-age-input").val(dtNassFormat.getFullYear()+"-"+monthFormat+(dtNassFormat.getMonth()+1)+"-"+dayFormat+dtNassFormat.getDate());
		}
		addAnotherInfos();
	}

	function userDescriptionUpdateDiv(){
		if($(window).innerHeight() < 500){
			$("#main-descript-div-other-user").css({"margin-bottom": "10px"});
		}else{
			$("#main-descript-div-other-user").css({"margin-bottom": "110px"});
		}
	}

	function addAnotherInfos(){
		let htmlInfos = [];
		let city = "";
		let work = "";
		if("location" in userInfo) city = userInfo.location.city;
		if("work" in userInfo) work = userInfo.work;
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
			$(".general-input-pic-icon-edit-prof").animate({marginTop: "90px"});
			$(".general-input-reset-pic-icon-edit-prof").animate({marginTop: "90px"});
			$("#other-label-user-info").slideUp(600);
			$( "#main-descript-div-other-user" ).animate({
				height: "0%",
				opacity: "0"
			}, 400);
			return activeInfo = false;
		}
		$(".general-input-pic-icon-edit-prof").animate({marginTop: "16px"});
		$(".general-input-reset-pic-icon-edit-prof").animate({marginTop: "16px"});
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
		if(age > 99 || age < 0) age = "?";
		return age || "?";
	}

	$("#btn-change-pic").click(function(){
		const picDiv = $('#main-pic-div-c');
		if(!("pics_url" in userInfo) || picDiv.css("opacity") < 1) return;
		if(picOrder >= qtPicsTotal-1) picOrder = -1;
		if(qtPicsTotal == 1) return;
		picDiv.fadeOut(150, function(){
			let picActive = userInfo.pics_url.main_pic;
			++picOrder;
			if(picOrder <= 0){
				$("#general-input-pic-reset-icon-edit-prof").fadeOut(300);
			}else{
				$("#general-input-pic-reset-icon-edit-prof").fadeIn(600);
				picActive = Object.values(userInfo.pics_url.sec_pics)[picOrder-1];
			}
			picDiv.css("background-image", "url(" + picActive + ")");
			$("#act-pic").text(picOrder+1);
			picDiv.fadeIn(150);
		});
	});

	(function(){
		$("#btn-prof-save").prop('disabled', true);
		$("#btn-prof-save").animate({"opacity": "0.6"}, 200);
		getProfile();
		configParams.history = "main-view";
		setConfigParams(configParams);
		$("#other-label-user-info").slideDown(300);
		$( "#main-descript-div-other-user" ).animate({
			opacity: "1",
			height: "100%"
		}, 600);

		let widthInputs = $("#edit-name-input").val().length*9;
		if(widthInputs <= 158){
			$("#edit-name-input").css("width", widthInputs+"px");
		}else{
			$("#edit-name-input").css("width", widthInputs+"px");
		}
		widthInputs = $("#edit-city-input").val().length*9;
		if(widthInputs <= 160){
			$("#edit-city-input").css("width", widthInputs+"px");
		}
		widthInputs = $("#edit-work-input").val().length*9;
		if(widthInputs <= 160){
			$("#edit-work-input").css("width", widthInputs+"px");
		}

		if(qtPicsTotal >= picsLimit){ 
			$("#btn-prof-add-pic").animate({"opacity":"0.3"});
		}else{
			$("#btn-prof-add-pic").animate({"opacity":"1"});
		}

	})();

	$("#btn-menu-back").click(function () {
		window.location.replace("main-view.html");
	});

	$("#edit-age-input").change(function(){
		let dateInput = new Date($("#edit-age-input").val());
		let age = calcAgeOfUser(dateInput);
		$("#label-user-age").html(iconEdit+"<span style='position: relative; top: -3px;'>"+age + "</span><p style='line-height: 0px; font-size: 10px; margin: 0; position: relative; top: -4px;'>anos</p>");
	});

	$("#edit-name-input").keydown(function(){
		$("#edit-name-input").css("width", $("#edit-name-input").val().length*9+"px");
		if($("#edit-name-input").width() > 158) $("#edit-name-input").css("width", "150px");
	});

	$("#edit-city-input").keydown(function(){
		$("#edit-city-input").css("width", $("#edit-city-input").val().length*9+"px");
		if($("#edit-city-input").width() > 160) $("#edit-city-input").css("width", "160px");
	});

	$("#edit-work-input").keydown(function(){
		$("#edit-work-input").css("width", $("#edit-work-input").val().length*9+"px");
		if($("#edit-work-input").width() > 160) $("#edit-work-input").css("width", "160px");
	});

	$("#gender-ico").click(function(){
		$("#edit-name-input").blur();
		setTimeout(function(){
			Swal.fire({
				html: "Selecione o sexo<br><br><i class='fas fa-mars' style='margin: 20px; margin-right: 30px;line-height: 0;font-size:40px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i><i class='fas fa-venus' style='margin: 20px; margin-left: 30px; line-height: 0;font-size:39px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>",
				confirmButtonText: "M",
				cancelButtonText: "F",
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
				customClass: {
					actions: 'action-gender',
					confirmButton: 'action-btn-gender',
					cancelButton:  'action-btn-gender'
				}
			}).then((data) => {
				userInfo.gender = "F";
				let gender = "<i class='fas fa-venus' style='line-height: 0;font-size:25px;color:#ce3bc2;text-shadow: 1px 2px 1px #ad3030; vertical-align: sub;'></i>";
				if(data.value){
					userInfo.gender = "M";
					gender = "<i class='fas fa-mars' style='line-height: 0;font-size:26px;color:#7a3bce;text-shadow: 1px 2px 1px #00a1ff; vertical-align: sub;'></i>";
				}
				$("#gender-ico").empty().append(gender);
				$("#edit-name-input").blur();
			});
		}, 100);
	});

	$("#general-input-pic-reset-icon-edit-prof").click(function(){
		setTimeout(function(){
			Swal.fire({
				title: 'DELETAR',
				html: "Você deseja retirar essa imagem do seu albúm?",
				padding: "8px",
				confirmButtonText: 'SIM',
				cancelButtonText: 'NÃO',
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
			}).then((data) => {
				if(data.value){
					let newSecPics = [];
					let secPicsLength = userInfo.pics_url.sec_pics.length;
					for(let i = 0; i < secPicsLength; ++i){
						if(userInfo.pics_url.sec_pics[i] != userInfo.pics_url.sec_pics[picOrder-1]){
							newSecPics.push(userInfo.pics_url.sec_pics[i]);
						}
					}
					userInfo.pics_url.sec_pics = newSecPics;
					if(picOrder < qtPicsTotal-1) picOrder--;
					$("#btn-change-pic").click();
					qtPicsTotal--;
					$("#qt-pics").text(qtPicsTotal);
					if(qtPicsTotal == 1){
						$("#qt-pics-p").css("display", "none");
					}else{
						$("#qt-pics-p").css("display", "block");
					}
				}
			});
		}, 100);
	});

	$("#btn-prof-add-pic").click(function(){
		if(qtPicsTotal >= picsLimit) return;
		$('#pic-input-add').click(); 
	});

	$('#pic-input').on("change", function() {
		uploadImage(this);
	});

	$('#pic-input-add').on("change", function() {
		let thisInput = this;
		$('#main-pic-div-c').animate({
			opacity: 0.2
		}, 1000, function(){
			qtPicsTotal++;
			userInfo.pics_url.sec_pics.push("");
			picOrder = qtPicsTotal-2;
			uploadImage(thisInput);
			picOrder = qtPicsTotal-1;
			if(qtPicsTotal >= picsLimit){ 
				$("#btn-prof-add-pic").animate({"opacity":"0.3"});
			}else{
				$("#btn-prof-add-pic").animate({"opacity":"1"});
			}
			$("#btn-change-pic").click();
			if(qtPicsTotal > 1) $("#qt-pics-p").css("display", "block");
			$("#qt-pics").text(qtPicsTotal);
			$("#act-pic").text(qtPicsTotal);

		});
	});

	function uploadImage(elmnt){
		var $files = $(elmnt).get(0).files;

		if ($files.length) {

			if ($files[0].size > $(elmnt).data("max-size") * 1024) {
				alert("Arquivo muito pesado.");
				return false;
			}
			$('#main-pic-div-c').animate({
				opacity: 0.1
			}, 1000, function(){
				$('#main-pic-div-c').addClass("loading-img");
			});
			$.ajax(uploadImgur($files[0])).done(function(response) {
				var res = JSON.parse(response);
				var link = res.data.link.replace(/^http:\/\//i, 'https://');
				if(picOrder <= 0){
					userInfo.pics_url.main_pic = link;
				}else{
					userInfo.pics_url.sec_pics[picOrder-1] = link;
				}
				$('#main-pic-div-c').animate({
					opacity: 0
				}, 1000, function(){
					$('#main-pic-div-c').css("background-image", "url("+link+")");
					$('#main-pic-div-c').animate({
						opacity: 1
					}, 1000, function(){
						$('#main-pic-div-c').removeClass("loading-img");
					});
				});
			});
		}
	}

	setInterval(() => {
		userDescriptionUpdateDiv();
		let nameSplit = $("#edit-name-input").val().split(" ");
		let firstName = "";
		let lastName = "";
		if(nameCachedHere == nameSplit){
			firstName = nameAndLastNameCachedHere[0];
			lastName = nameAndLastNameCachedHere[1];
		}else{
			nameCachedHere = nameSplit;
			nameSplit = nameSplit.filter(function(string){return string != "";});
			firstName = nameSplit.shift();
			lastName = nameSplit.join(" ");
		}
		if(userBeforeModified.name == firstName && userBeforeModified.lastname == lastName && userBeforeModified.work == $("#edit-work-input").val() && userBeforeModified.about == $("#edit-about-input").val()
			&& userBeforeModified.fix_local == $("#edit-city-input").val() && userBeforeModified.gender == userInfo.gender && userBeforeModified.pics_url.main_pic == userInfo.pics_url.main_pic
			&& userBeforeModified.pics_url.sec_pics == userInfo.pics_url.sec_pics){
				if($("#btn-prof-save").prop('disabled')) return;
				$("#btn-prof-save").prop('disabled', true);
				$("#btn-prof-save").animate({"opacity": "0.6"}, 200);
		}else{
			if(!$("#btn-prof-save").prop('disabled')) return;
			$("#btn-prof-save").prop('disabled', false);
			$("#btn-prof-save").animate({"opacity": "1"}, 200);
		}
	}, 100);
	
	$("#btn-prof-save").click(function(){
		var nomePerfil = $("#edit-name-input").val();
		if (nomePerfil.length < 3) return alerts.emptyNome(); 

		setTimeout(function(){
			Swal.fire({
				title: 'SALVAR',
				html: "Alterações em seu perfil foram feitas.<br> Tem certeza que deseja salvá-las?",
				padding: "8px",
				confirmButtonText: 'SIM',
				cancelButtonText: 'NÃO',
				allowOutsideClick: false,
				width: "80%",
				showCancelButton: true,
			}).then((data) => {
				if(data.value){
					let newInfos = {
						_id: 		userInfo._id,
						name:		$("#edit-name-input").val(),
						dt_nasc:	$("#edit-age-input").val(),
						work:		$("#edit-work-input").val(),
						about:		$("#edit-about-input").val(),
						fix_local:	$("#edit-city-input").val(),
						gender:		userInfo.gender,
						main_pic:	userInfo.pics_url.main_pic,
						sec_pics:	userInfo.pics_url.sec_pics
					};

					$.get(nodeHost+"upd-user", {info_user: newInfos}).done(function (data) {
						if (isNullOrUndefined(data)) {
							console.log("Deu merda");
						}else {
							setUserCache(data);
							alerts.saveMensagem();
						}
					});
				}
			});
		}, 100);
	});





