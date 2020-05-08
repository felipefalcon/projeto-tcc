
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
		if (checkBirth() == true) {
			alerts.errorBirth();
			return; 
		}
		if ($("#password-input").val() != $("#password-c-input").val()) {
			alerts.notEqualsPasswords();
			$("#password-c-input").focus();
			return;
		}
		$("#create-account-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$.get(nodeHost + "get-user-exist", { email: $("#email-input").val() })
		.done(function (data) {
			if (isNullOrUndefined(data)) return createUser();
			$("#create-account-div").LoadingOverlay("hide");
			alerts.userAlredyExists();
		}).fail(function () {
			$("#create-account-div").LoadingOverlay("hide");
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
			$("#create-account-div").LoadingOverlay("hide");
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
		if (anoAutorizado < 16) {
			return true; 
		}
		 return false; 
	}

	// Function para logar o usuário
	function loginUser() {
		$("#create-account-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		$.post(nodeHost + "con-user", { email: $("#email-input").val(), password: hex_md5($("#password-input").val()) })
		.done(function (data) {
			if (isNullOrUndefined(data)) {
				$("#create-account-div").LoadingOverlay("hide");
				alerts.userNotFound();
			} else {
				setUserCache(data);
				window.location.replace("./main-view.html");
			}
		}).fail(function () {
			$("#create-account-div").LoadingOverlay("hide");
			alerts.errorServer();
		});
		event.preventDefault();
	}
