
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(58);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#menu-top-div").innerHeight(h*1);
	$("#logo-div img").innerHeight(h/1.5);
	$("#main-pic-div-c").innerHeight(h*6.5);
	
	function getAllUsersInfo(){
		loading();
		$.get("./get-users").done(function( data ) {
			if(data == null || data == "undefined"){
				  
			}else{
				$("#events-div").append("</br>");
				data.forEach(
					function(data){
						$("#events-div").append("<div class='users-t'>"+
						"<div class='profile-img-div'></div>"+
						"<div class='profile-info-div'>"+
						data.email +"</div></div>");				
					}
				);
				$("#events-div").append("</br></br></br>");
				$(".users-t").fadeIn("slow");
			}
			$("html").innerHeight("auto");
			$("body").innerHeight($(window).height()-60);
			loading('hide');
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
	
	