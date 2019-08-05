
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(h*4);
	$("#form-login").innerHeight(h*6);

	function loginUser(){
		$.post("./connect-user", { login: $("#inputEmail").val(), senha: $("#inputPassword").val() })
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  alert("Usuário não encontrado");
			  }else{
				  window.localStorage.setItem('username', data.login);
				  window.location.href = "./main-view.html";
			  }
		});
	}