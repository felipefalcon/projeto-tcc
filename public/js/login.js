
	(function () {
		// Configurações iniciais da Tela de Login - Tamanho das DIVs
		// let h = $(window).height() / 10;
		// $("#login-div").innerHeight(h * 5.8);
		// $("#socials-div").css("height", $("#login-form-sub").css("height"));

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

	let idTempUser = "";

	// Function para logar o usuário
	function loginUser() {
		showLoadingCircle("#login-div");
		$.post(nodeHost + "con-user", { email: $("#email-input").val(), password: hex_md5($("#password-input").val()) })
		.done(function (data) {
			if (isNullOrUndefined(data)) {
				closeLoadingCircle("#login-div");
				alerts.userNotFound();
			} else {
				if("status_account" in data){
					if(data.status_account == false){
						closeLoadingCircle("#login-div");
						alerts.accountBlock();
						return;
					}
				}
				tempUser = data;
				if(!data.pass_redef){
					setUserCache(data);
					closeLoadingCircleClear();
					$("#logo-div-login").fadeOut(200);
					$("#login-div").fadeOut(200, function(){
						window.location.replace("./main-view.html");
					});
				}else{
					closeLoadingCircle("#login-div");
					mandatoryRedef();
				}
			}
		}).fail(function () {
			closeLoadingCircle("#login-div");
			alerts.errorServer();
		});
		event.preventDefault();
	}

	function mandatoryRedef(){
		setTimeout(function(){
			Swal.mixin({
				confirmButtonText: 'PRÓX.',
				progressSteps: ['1', '2'],
				width: "80%",
				allowOutsideClick: false
			}).queue([
				{
				title: 'Redefinição de senha',
				html: 'É necessário redefinir sua senha antes de entrar.<br> Digite sua nova senha<br><br>',
				input: 'password',
				inputValidator: (value) => {
					if (!value) {
					  return 'Você não digitou nada no campo de nova senha';
					}
					else if(value.length < 8){
						return "A senha deve conter 8 digítos no mínimo";
					}
				  }
				},
				{
				title: 'Redefinição de senha',
				html: 'Confirme a sua nova senha<br><br>',
				input: 'password',
				inputValidator: (value) => {
					if (!value) {
					  return 'Você não digitou nada no campo de confirmação de nova senha'
					}else if(value.length < 8){
						return "A senha deve conter 8 digítos no mínimo";
					}
				  }
				}
			]).then((result) => {
				if (result.value) {
				const resultFinal = result.value;
				if(resultFinal[0] == resultFinal[1]){
					$.get(nodeHost+"upd-passw-w-p", {_id: tempUser._id, new_pass: hex_md5(resultFinal[0]) }).done(function (data) {
						if (isNullOrUndefined(data)) {
							console.log("Deu merda");
						}else if(data.oh_no == "oh_no"){
							alerts.passwordError();
						}else{
							alerts.updatePassSuccess();
							setTimeout(function () {
								loading();
								setUserCache(tempUser);
								window.location.replace("./main-view.html");
								closeLoadingCircle("#login-div");
							}, 8000);
						}
					});
				}else{
					alerts.notEqualsPasswords();
				}
				}
			});
		}, 300);
	}

	// Chamada da Function que reseta o cache da conta do usuário (commom-functions.js)
	resetUserCache();