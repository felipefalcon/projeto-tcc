
	function createUser(){
		$.post("./create-user", { 
			nome: $("#inputName").val(), 
			login: $("#inputEmail").val(), 
			senha: $("#inputPassword").val() 
		}).done(function(){
			alert("Cadastro realizado!");
			window.location.replace('/');
		});
	}