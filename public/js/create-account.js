
	(function(){
		$("#create-account-div").css("height", $(window).innerHeight() - 60 + "px");

		$("#btn-menu-back").click(function(){
			window.location.replace("/");
		});
		
	})();

	function verifyAccountExists(){
		event.preventDefault();
		$("#create-account-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		if($("#password-input").val() != $("#password-c-input").val()){
			return alert("Senha e Confirmação de Senha não conferem");;
		}
		$.get(nodeHost + "get-user", {email: $("#email-input").val()})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
				  	createUser();
			  }else{
					$("#create-account-div").LoadingOverlay("hide");
				 	alert("E-mail já cadastrado. Tente outro e-mail.");
			  }
		}).fail(function(){
			$("#create-account-div").LoadingOverlay("hide");
			alert("Houve uma falha.");
		});
	}

	function createUser(){
		let genderType = $("#gender1-input").is(':checked') ? "M" : "F";
		$.post(nodeHost + "crt-user", { 
			email: $("#email-input").val(),
			name: $("#name-input").val(),
			age: $("#age-input").val(), 
			gender: genderType,		
			password: hex_md5($("#password-input").val())		
		}).done(function(){
			$("#create-account-div").LoadingOverlay("hide");
			alert("Cadastro realizado!");
			window.location.replace('/');
		});
	}

	