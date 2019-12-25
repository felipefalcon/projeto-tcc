
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
		$("#create-account-div").LoadingOverlay("show", { background: "rgba(59, 29, 78, 0.8)", imageColor: "rgba(193, 55, 120, 0.82)", });
		if ($("#password-input").val() != $("#password-c-input").val()) {
			return alert("Senha e Confirmação de Senha não conferem");;
		}
		$.get(nodeHost + "get-user", { email: $("#email-input").val() })
			.done(function (data) {
				if (data == null || data == "undefined") {
					createUser();
				} else {
					$("#create-account-div").LoadingOverlay("hide");
					alerts.userAlredyExists();
				}
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
			age: $("#age-input").val(),
			gender: genderType,
			password: hex_md5($("#password-input").val())
		}).done(function () {
			$("#create-account-div").LoadingOverlay("hide");
			alerts.registerSuccess();
			setTimeout(function(){
				loginUser();
			}, 9500);
		});
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
