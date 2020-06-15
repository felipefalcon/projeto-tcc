
	(function () {

		$("#btn-menu-back").click(function () {
			window.location.replace("/main-view.html");
		});

		$("#block-acc").click(function(){
			setTimeout(function(){
				Swal.fire({
					title: 'DESATIVAÇÃO',
					html: "Esta opção desativará sua conta.<br>Você tem certeza que deseja realizar esta ação?<br> Se desejar prosseguir digite sua senha.",
					padding: "8px",
					confirmButtonText: 'SIM',
					cancelButtonText: 'NÃO',
					allowOutsideClick: false,
					width: "80%",
					input: 'password',
					showCancelButton: true,
					inputValidator: (value) => {
						if (!value) {
						  return 'Você não digitou nada no campo de senha'
						}else if(value.length < 8){
							return "A senha deve conter 8 digítos no mínimo";
						}
					}
				}).then((result) => {
					const resultFinal = result.value;
					if(resultFinal){
						showLoadingCircle("body");
						$.get(nodeHost+"upd-status-acc", {_id: userInfo._id, password: hex_md5(resultFinal)}).done(function (data) {
							if (isNullOrUndefined(data)) {
								console.log("Deu merda");
							}else if(data.oh_no == "oh_no"){
								closeLoadingCircle("body");
								alerts.passwordError();
							}else{
								closeLoadingCircle("body");
								alerts.accountDeactivate();
								setTimeout(function () {
									resetAllUsersCache();
									resetToUser();
									resetAllEvents();
									resetConfigParams();
									resetUserCache();
									setTimeout(function(){
										window.location.replace("/");
									}, 500);
								}, 3000);
							}
						});
					}
				});
			}, 100);
		});

		$("#redef-pass").click(function(){
			setTimeout(function(){
				Swal.mixin({
					confirmButtonText: 'PRÓX.',
					cancelButtonText: 'NÃO',
					showCancelButton: true,
					focusCancel: true,
					progressSteps: ['1', '2', '3'],
					width: "80%"
				}).queue([
					{
					title: 'Redefinição de senha',
					html: 'Digite sua senha atual<br><br>',
					input: 'password',
					inputValidator: (value) => {
						if (!value) {
						  return 'Você não digitou nada no campo de senha'
						}else if(value.length < 8){
							return "A senha deve conter 8 digítos no mínimo";
						}
					  }
					},
					{
					title: 'Redefinição de senha',
					html: 'Digite sua nova senha<br><br>',
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
					html: 'Confirme sua nova senha<br><br>',
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
					if(resultFinal[1] == resultFinal[2]){
						showLoadingCircle("body");
						$.get(nodeHost+"upd-passw", {_id: userInfo._id, password: hex_md5(resultFinal[0]), new_pass: hex_md5(resultFinal[1]) }).done(function (data) {
							if (isNullOrUndefined(data)) {
								console.log("Deu merda");
							}else if(data.oh_no == "oh_no"){
								closeLoadingCircle("body");
								alerts.passwordError();
							}else{
								// $.get(nodeHost + "get-user", { email: userInfo.email })
								// .done(function (data) {
								// 	if (!isNullOrUndefined(data)) setUserCache(data);
								// });
								closeLoadingCircle("body");
								alerts.passwordChanged();
							}
						});
					}else{
						alerts.notEqualsPasswords();
					}
					}
				});
			}, 600);
		});

	})();

