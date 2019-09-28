
	$("body").innerHeight($(window).height());
	$("#create-account-div").innerHeight($(window).height());

	function verifyAccountExists(){
		event.preventDefault();
		loading();
		if($("#password-input").val() != $("#password-c-input").val()){
			return alert("Senha e Confirmação de Senha não conferem");;
		}
		$.get("./get-user", {email: $("#email-input").val()})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  createUser();
			  }else{
				  loading('hide');
				  alert("E-mail já cadastrado. Tente outro e-mail.");
			  }
		});
	}

	function createUser(){
		$.post("./crt-user", { 
			name: $("#name-input").val(), 
			email: $("#email-input").val(),		
			password: $("#password-input").val()		
		}).done(function(){
			loading('hide');
			alert("Cadastro realizado!");
			window.location.replace('/');
		});
	}