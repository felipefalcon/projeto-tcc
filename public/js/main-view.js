
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(58);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#menu-top-div").innerHeight(h*1);
	//$("#events-div").innerHeight(h*6.6);
	$("#logo-div img").innerHeight(h/1.5);
	$("#main-pic-div-c").innerHeight(h*6.5);
	
	function getAllUsersInfo(){
		$.post("./get-all-users")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  //$("#fullname-div").append("<b>Nada encontrada</b>.");
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
		});
	}
	
	
	
	function getMainImg(){
		$.post("./get-user-profile", {
			email: window.localStorage.getItem('email')
		})
		.done(function( data ) {
			  if(data.pics_ids.main_pic == ""){
					return;
			  }else{
					//console.log(data.main_pic);
					$.get("./get-img", { _id: data.pics_ids.main_pic })
					.done(function( data ) {
						  if(data == null || data == "undefined"){
							  //$("#fullname-div").append("<b>Nada encontrada</b>.");
							  //$("#main-pic-div").css("background-image", "url(/css/user-profile.png)");
							  return;
						  }else{
								//console.log(data);
								$("#main-pic-div-c").animate({ opacity: 0.9 }, "slow");
								$("#main-pic-div-c").css("background-image", "url(image/"+data.filename+")");
								$("#main-pic-div-c").animate({ opacity: 1 }, "slow");
						  }
					});
			  }
		});
	}
	
	function getProfile(){
		$.post("./get-user-profile", {
			email: 	window.localStorage.getItem('email'),
		})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					console.log("Deu merda");
			  }else{
					//console.log(data);
					$("#label-user-name").text(data.name);
					$("#label-user-age").text(data.age + " anos");
					$("#label-user-location").text("São Paulo - SP");
			  }
		});
	}
	
	
	$("#btn-menu-1").click(function(){
		$("#menu-1").slideToggle(300);
	});
	
	getAllUsersInfo();
	getMainImg();
	getProfile();
	
	function deleteAccount(){
		if(window.confirm("Tem certeza que deseja deletar sua conta?\nEsta ação é irreversível!")){
			$.post("./del-user", { email: window.localStorage.getItem('email')})
			  .done(function( data ) {
				  if(data == null || data == "undefined"){
					  alert("Algum erro");
				  }else{
					  alert("Sua conta foi deletada!");
					  window.localStorage.setItem('email', '');
					  window.location.href = "/";
				  }
			});
		}
	}
	
	