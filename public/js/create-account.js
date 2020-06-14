
	(function () {
		// Arrumando tamanho da div e adicionando botão de retorno
		$("#create-account-div").css("height", $(window).innerHeight() - 60 + "px");

		$("#btn-menu-back").click(function () {
			window.location.replace("/");
		});

	})();

	// Function para verificar se o e-mail já possui cadastro, antes de cadastrar um novo com o mesmo
	function verifyAccountExists() {
		event.preventDefault();
		if (checkBirth()) {
			alerts.errorBirth();
			return; 
		}
		if ($("#password-input").val() != $("#password-c-input").val()) {
			alerts.notEqualsPasswords();
			$("#password-c-input").focus();
			return;
		}
		showLoadingCircle("#create-account-div");
		$.get(nodeHost + "get-user-exist", { email: $("#email-input").val() })
		.done(function (data) {
			if (isNullOrUndefined(data)) return createUser();
			closeLoadingCircle("#create-account-div");
			alerts.userAlredyExists();
		}).fail(function () {
			closeLoadingCircle("#create-account-div");
			alerts.errorServer();
		});
	}

	// Function para cadastrar o usuário
	function createUser() {
		let genderType = $("#gender1-input").is(':checked') ? "M" : "F";
		$.post(nodeHost + "crt-user", {
			email: $("#email-input").val(),
			name: $("#name-input").val(),
			lastname: $("#lastname-input").val(),
			dt_nasc: $("#dt-nasc-input").val(),
			gender: genderType,
			password: hex_md5($("#password-input").val())
		}).done(function () {
			closeLoadingCircle("#create-account-div");
			alerts.registerSuccess();
			setTimeout(function () {
				loginUser();
			}, 8000);
		});
	}

	// Function para validar dt nascimento
	function checkBirth() {
		var data_Nascimento = new Date($("#dt-nasc-input").val()); 
		var data_Hoje = new Date(); 
		var anoAutorizado = data_Hoje.getFullYear() - data_Nascimento.getFullYear(); 
		return anoAutorizado < 16 ? true : false;
	}

	// Function para logar o usuário
	function loginUser() {
		showLoadingCircle("#create-account-div");
		$.post(nodeHost + "con-user", { email: $("#email-input").val(), password: hex_md5($("#password-input").val()) })
		.done(function (data) {
			if (isNullOrUndefined(data)) {
				closeLoadingCircle("#create-account-div");
				alerts.userNotFound();
			} else {
				setUserCache(data);
				closeLoadingCircleClear();
				$("#logo-div").fadeOut(200);
				$("#create-account-div").fadeOut(200, function(){
					window.location.replace("./main-view.html");
				});
			}
		}).fail(function () {
			closeLoadingCircle("#create-account-div");
			alerts.errorServer();
		});
		event.preventDefault();
	}
