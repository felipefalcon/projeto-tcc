
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(58);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#events-div").css("min-height", $(window).height()-64-58+"px");
	$("#next-u-div").css("min-height", $(window).height()-64-58+"px");
	$("#menu-top-div").innerHeight(h*1);
	$("#logo-div img").innerHeight(h/1.5);
	$("#main-pic-div-c").innerHeight(h*6.5);
	$("html").innerHeight("auto");
	$("body").innerHeight($(window).height()-60);
	
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
		});
	}

	function makeEventsObjects(){
		$("#events-div").append("</br>");
			allUsersInfo.forEach(function(data){
				$("#events-div").append("<div class='users-t'>"+
				"<div class='profile-img-div'></div>"+
				"<div class='profile-info-div'>"+
				data.email +"</div></div>");				
			}
		);
		$("#events-div").append("</br></br></br>");
		$(".users-t").fadeIn("slow");
	}

	function makeUsersNextObjects(){
			allUsersInfo.forEach(function(data){
				console.log(data);
				if(data.location != null){
					$("#next-u-users").append("<div class='user-n-u-div mx-auto'>"
					+"<label class='user-n-u-label'>"+data.name+"</label>"
					+"<div id='user-n-u-div-content' name='"+data._id+"'></div>"
					+"<label class='user-n-u-label' id='city-district-n-u-label'>"+data.location.city_district+"</label></div>");
				}else{
					$("#next-u-users").append("<div class='user-n-u-div mx-auto'>"
					+"<label class='user-n-u-label'>"+data.name+"</label>"
					+"<div id='user-n-u-div-content'></div>"
					+"<label class='user-n-u-label' id='city-district-n-u-label'>???</label></div>");
				}
				$("#user-n-u-div-content[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");
			}
		);
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
	
	getAllUsersInfo();
	getProfile();
	getMainImg();