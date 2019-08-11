
	var h = $(window).height()/10;
	$("body").innerHeight(h*10);
	$("#logo-div").innerHeight(h*3.6);
	$("#form-login").innerHeight(h*6.4);

	function loginUser(){
		$.post("./connect-user", { login: $("#login-input").val(), password: $("#password-input").val() })
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  alert("Usuário não encontrado");
			  }else{
				  window.localStorage.setItem('username', data.login);
				  window.location.href = "./main-view.html";
			  }
		});
	}
	
	$( document ).ready(function() {
		$("body").fadeIn();
	});