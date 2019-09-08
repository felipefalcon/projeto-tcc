
	$("body").innerHeight($(window).height());
	$("#create-account-div").innerHeight($(window).height());

	function verifyAccountExists(){
		event.preventDefault();
		if($("#password-input").val() != $("#password-c-input").val()){
			return alert("Senha e Confirmação de Senha não conferem");;
		}
		$.post("./user-exists", {email: $("#email-input").val()})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  createUser();
			  }else{
				  alert("E-mail já cadastrado. Tente outro e-mail.");
			  }
		});
	}

	function createUser(){
		$.post("./create-user", { 
			name: $("#name-input").val(), 
			email: $("#email-input").val(),		
			password: $("#password-input").val()		
		}).done(function(){
			alert("Cadastro realizado!");
			window.location.replace('/');
		});
	}