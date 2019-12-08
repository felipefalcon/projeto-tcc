
	(function () {
		// Configurações iniciais da Tela de Login - Tamanho das DIVs
		let h = $(window).height() / 10;
		$("body").innerHeight($(window).height());
		$("#login-div").innerHeight(h * 5.8);
		$("#socials-div").css("height", $("#login-form-sub").css("height"));

		// Variáveis de reuso e flag
		let optionClicked = "btn-lero";
		let fadeDelay = 300;

		// Clique do botão "REDE SOCIAL"
		$("#btn-social").click(function () {
			if (optionClicked != "btn-lero") return;
			optionClicked = "btn-social";
			$("#btn-social").fadeTo(fadeDelay, 1);
			$("#btn-lero").fadeTo(fadeDelay, 0.3);
			$("#socials-div").css("display", "block");
			$("#socials-div").fadeTo(fadeDelay, 1);
			$("#login-form-sub").fadeTo(fadeDelay, 0);
			$("#login-form-sub").css("display", "none");
		});

		// Clique do botão "CONTA LeRo"
		$("#btn-lero").click(function () {
			if (optionClicked != "btn-social") return;
			optionClicked = "btn-lero";
			$("#btn-lero").fadeTo(fadeDelay, 1);
			$("#btn-social").fadeTo(fadeDelay, 0.3);
			$("#login-form-sub").css("display", "block");
			$("#login-form-sub").fadeTo(fadeDelay, 1);
			$("#socials-div").fadeTo(fadeDelay, 0);
			$("#socials-div").css("display", "none");
		});

		// Quando o input do email está sem foco e tem texto, a fonte é aumentada
		$("#email-input").focusout(function () {
			if ($("#email-input").val().length > 0) {
				$("#email-input").css("font-size", "16px");
			}
		});

		// Quando o input do senha está sem foco e tem texto, a fonte é aumentada
		$("#password-input").focusout(function () {
			if ($("#password-input").val().length > 0) {
				$("#password-input").css("font-size", "16px");
			}
		});

	})();

	// Function para logar o usuário
	function loginUser() {
		loading();
		$.post(nodeHost + "con-user", { email: $("#email-input").val(), password: $("#password-input").val() })
			.done(function (data) {
				if (data == null || data === "undefined") {
					alert("Usuário não encontrado");
					loading('hide');
				} else {
					setUserCache(data);
					window.location.replace("./main-view.html");
				}
			}).fail(function () {
				alert("Houve uma falha");
				loading('hide');
			});
		event.preventDefault();
	}

	// Chamada da Function que reseta o cache da conta do usuário (commom-functions.js)
	resetUserCache();