
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(58);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#menu-top-div").innerHeight(h*1.2);
	$("#events-div").innerHeight(h*6.6);
	$("#logo-div img").innerHeight(h/1.5);
	
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
							"Usuario: "+ data.login +
							",</br>E-mail:"+ data.email +"</div></div>");
						$(".users-t").fadeIn("slow");				
						}
					);
					$("#events-div").append("</br></br></br>");
			  }
		});
	}
	
	$("#btn-menu-1").click(function(){
		$("#menu-1").slideToggle("slow");
	});
	
	getAllUsersInfo();
	
	