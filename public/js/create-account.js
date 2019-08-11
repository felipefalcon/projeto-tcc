
	$("body").innerHeight($(window).height());

	function createUser(){
		$.post("./create-user", { 
			name: $("#name-input").val(), 
			email: $("#email-input").val(),
			login: $("#login-input").val(), 			
			password: $("#password-input").val() 
		}).done(function(){
			alert("Cadastro realizado!");
			window.location.replace('/');
		});
	}