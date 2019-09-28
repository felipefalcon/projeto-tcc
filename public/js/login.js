
	var h = $(window).height()/10;
	$("body").innerHeight(h*10);
	// O tamanho com o socials-div é 3.6 para logo e 6.4 para o login-div
	$("#logo-div").innerHeight(h*5.2);
	$("#login-div").innerHeight(h*4.8);

	function loginUser(){
		loading();
		$.post("./con-user", { email: $("#email-input").val(), password: $("#password-input").val() })
		.done(function( data ) {
			if(data == null || data == "undefined"){
				alert("Usuário não encontrado");
			}else{
				setUserCache(data);
				window.location.replace("./main-view.html");
			}
			loading('hide');
		});
		event.preventDefault();
	}
	
	resetUserCache();