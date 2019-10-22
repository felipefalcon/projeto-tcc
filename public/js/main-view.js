
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#main-div").css("margin-top", $("#logo-div").innerHeight()+"px");
	$("#events-div").css("min-height", $(window).height()-64-58+"px");
	$("#next-u-div").css("min-height", $(window).height()-64-58+"px");
	$("#menu-top-div").innerHeight(h*1);
	$("#logo-div img").innerHeight(h/1.6);
	$("#main-pic-div-c").innerHeight(h*6.5);
	$("html").innerHeight("auto");
	$("body").innerHeight($(window).height()-60);

	$("#btn-menu-1").attr("disabled", true);
	
	function getAllUsersInfo(){
		$("#profile-div").LoadingOverlay("show", {background: "rgba(63, 51, 74, 0.8)",imageColor: "rgba(193, 55, 120, 0.82)",});
		$("#events-div").LoadingOverlay("show", {background: "rgba(63, 51, 74, 0.8)",imageColor: "rgba(193, 55, 120, 0.82)",});
		$("#next-u-div").LoadingOverlay("show", {background: "rgba(63, 51, 74, 0.8)",imageColor: "rgba(193, 55, 120, 0.82)",});
		$.get("./get-users").done(function( data ) {
			if(data == null || data == "undefined"){
				  
			}else{
				setAllUsersCache(data);
				makeEventsObjects();
				makeUsersNextObjects();
			}
			$("#profile-div").LoadingOverlay('hide');
			$("#events-div").LoadingOverlay('hide');
			$("#next-u-div").LoadingOverlay('hide');
			$("#btn-menu-1").attr("disabled", false);
		});
	}

	function makeEventsObjects(){
		allUsersInfo.forEach(function(data, i){
			if(i % 2 == 0){
				$("#events-div").append("<div class='users-t' style='background-color: rgba(255, 255, 255, 0.24);' name='"+data._id+"'>"+
				"<div id='profile-img-div' name='"+data._id+"'></div>"+
				"<div class='profile-info-div'>"+
				"<label class='user-d-u-label'>"+data.name+"</label>"+
				"<label class='user-d-u-label'>"+data.age+" anos - "+data.gender+"</label>"+
				"<label class='user-d-u-label'>"+data.email+"</label>"+
				"</div></div>");
				$("#profile-img-div[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");	
			}else{
				$("#events-div").append("<div class='users-t' name='"+data._id+"'>"+
				"<div id='profile-img-div' name='"+data._id+"'></div>"+
				"<div class='profile-info-div'>"+
				"<label class='user-d-u-label'>"+data.name+"</label>"+
				"<label class='user-d-u-label'>"+data.age+" anos - "+data.gender+"</label>"+
				"<label class='user-d-u-label'>"+data.email+"</label>"+
				"</div></div>");
				$("#profile-img-div[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");	
			}			
		});
		$(".users-t").fadeIn("slow");
	}

	function makeUsersNextObjects(){
			allUsersInfo.forEach(function(data){
				if(data.location){
					$("#next-u-users").append("<div class='user-n-u-div mx-auto'>"
					+"<label class='user-n-u-label'>"+data.name+"</label>"
					+"<div id='user-n-u-div-content' name='"+data._id+"'>"
					+"<div class='send-msg-button' name='"+JSON.stringify(data)+"'><i class='fas fa-comment-dots' style='font-size:28px; color:white; transform: translateY(-6px); float: right;text-shadow: 2px 2px 2px black'></i></div></div>"
					+"<label id='city-district-n-u-label'>"+data.location.city_district+"</label></div>");
				}else{
					$("#next-u-users").append("<div class='user-n-u-div mx-auto'>"
					+"<label class='user-n-u-label'>"+data.name+"</label>"
					+"<div id='user-n-u-div-content'></div>"
					+"<label id='city-district-n-u-label'>???</label></div>");
				}
				$("#user-n-u-div-content[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");
			}
		);

		$(".send-msg-button").click(function(){
			setToUser($(this).attr('name'));
			window.location.href = "./user-conversation.html"
		});

	}
	
	function getMainImg(){
		$('#main-pic-div-c').css("background-image", "url("+userInfo.pics_url.main_pic+")");
	}
	
	function getProfile(){
		$("#label-user-name").text(userInfo.name);
		$("#label-user-age").text(userInfo.age + " anos");
		$("#label-user-location").text("São Paulo - SP");
	}
	
	$("#btn-menu-1").click(function(){
		$("#menu-1").slideToggle(300);
	});
	
	$("body").click(function(){
		if(parseInt($("#menu-1").css('height')) < 50){
			return;
		}
		$("#menu-1").slideUp(300);
	});
	
	function deleteAccount(){
		if(window.confirm("Tem certeza que deseja deletar sua conta?\nEsta ação é irreversível!")){
			$.get("./del-user", { email: userInfo.email})
			.done(function( data ) {
				if(data == null || data == "undefined"){
					alert("Algum erro");
				}else{
					alert("Sua conta foi deletada!");
					resetUserCache();
					window.location.replace("/");
				}
			});
		}
	}

	function verifyAdminPermission(){
		if(!userInfo.is_admin){
			return false;
		}
		$("#menu-1").prepend("<a href='./admin-page.html'>Administrador</a>");
	}
	
	getAllUsersInfo();
	getProfile();
	getMainImg();
	verifyAdminPermission();