
	var h = $(window).height()/10;
	$("#form-main").innerHeight(h*9);
	$("#logo-div").innerHeight(h);
	$("#menu-top-div").innerHeight(h);
	$("#events-div").innerHeight(h*7);
	$("#menu-bottom-div").innerHeight(h);
	$("#logo-div img").innerHeight(h/1.5);
	
	function getAllUsersInfo(){
		$.post("./get-all-users")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  //$("#fullname-div").append("<b>Nada encontrada</b>.");
			  }else{
				    console.log(data);
					data.forEach(function(data){$("#events-div").append("<p class='users-t'> Usuario: "+ data.login 
																		+ ",     Senha:"+ data.senha +"</p>");});
					//$("#fullname-div").append("<p id='text-view'>"+data.nome +"</p>");
			  }
		});
	}
	
	getAllUsersInfo();
	
	