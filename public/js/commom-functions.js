	// Variável do host onde estão os serviços node (Mudando aqui, muda de todos os arquivos)
	const nodeHost = "https://tcc-lero.herokuapp.com/";

	// Função para pegar hora do servidor - Dispositivos as vezes tem horário diferente
	let todayDate = new Date();
	function getServerDate(){
		$.get({url: nodeHost + "get-time-server"})
		.done(function (data) {
			todayDate = new Date(data);
		});
	}

	let apiImgur = "";
	let picsLimit = 5;
	function setImgurParams(){
		if(apiImgur.length > 0) return apiImgur;
		$.get({url: nodeHost+"get-imgur-params", async: false})
		.done(function(data){
			return apiImgur = {
				async: true,
				crossDomain: true,
				processData: false,
				contentType: false,
				type: 'POST',
				url: data[0],
				headers: {
					Authorization: 'Client-ID ' + data[1],
					Accept: 'application/json'
				},
				mimeType: 'multipart/form-data'
			};
		});
	}

	function uploadImgur(file){
		let formData = new FormData();
		formData.append("image", file);
		setImgurParams();
		apiImgur.data = formData;
		return apiImgur;
	}

	// Function de Tela de Loading
	// Chamar: loading();            => Chama a Tela de Loading
	// Chamar: loading('hide')       => Desaparece com a Tela de Loading que foi chamada em algum local
	function loading(status) {
		if (status == 'hide') {
			$.LoadingOverlay("hide");
		} else {
			$.LoadingOverlay("show", {
				background: "rgba(59, 29, 78, 0.8)",
				imageColor: "rgba(193, 55, 120, 0.82)",
			});
		}
	}

	// Objeto alerts, com Functions de diversos tipos de alerta
	// Chamar: alerts.errorServer	=> Exemplo de chamada
	var alerts = {
		errorServer: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Erro!',
					text: 'Ocorreu uma falha na conexão com o servidor. Tente novamente.',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		aboutAlert: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'LeRo',
					text: 'Versão 1.0.0',
					icon: 'info',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 300);
		},
		notEqualsPasswords: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Senha divergente',
					text: 'Os campos de senha e confirmação de senha não estão iguais. Tente novamente.',
					icon: 'warning',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		userNotFound: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Usuário não encontrado!',
					text: 'Verifique se o e-mail ou a senha estão corretos. Tente novamente.',
					icon: 'warning',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		userAlredyExists: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Usuário já cadastrado!',
					text: 'E-mail informado já possui cadastro, use outro e-mail.',
					icon: 'info',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		registerSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Conta cadastrada!',
					text: 'A conta foi cadastrada com sucesso, aguarde para ser redirecionado.',
					icon: 'success',
					padding: "8px",
					timer: 8000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		emailSent: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'E-mail enviado!',
					text: 'Um e-mail com as informações da conta foi enviado para o e-mail informado.',
					icon: 'success',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		emailNotFound: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'E-mail não encontrado!',
					text: 'O e-mail informado não coincide com nenhum cadastrado. Tente novamente.',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		emptyInputs: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Falta de informações!',
					html: 'É necessário preencher a maioria dos campos para criar um evento.<br>(Tags/Imagem não obrigatório)',
					icon: 'warning',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 100);
		},
		registerEventSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Evento criado!',
					html: 'Cadastrado com sucesso, agora todos podem ver seu evento.<br>Acesse a aba "MEUS EVENTOS" para mais informações.',
					icon: 'success',
					padding: "8px",
					timer: 8000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		updateEventSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Evento atualizado!',
					html: 'Editado com sucesso.<br>As novas informações já estão disponíveis a todos os usuários.',
					icon: 'success',
					padding: "8px",
					timer: 7000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		passwordChanged: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Senha alterada!',
					text: 'A sua senha foi alterada com sucesso.',
					icon: 'success',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		passwordError: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Senha incorreta!',
					text: 'A senha informada não confere com a senha atual. Tente novamente.',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},	
		accountDeactivate: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Conta desativada!',
					text: 'A conta foi desativada, você será desconectado.',
					icon: 'success',
					padding: "8px",
					timer: 7000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		accountBlock: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Conta desativada!',
					html: 'A conta referida se encontra em estado desativado.<br>Contate um administrador para mais informações.',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		updatePassSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Senha redefinida!',
					html: 'A sua senha foi alterada com sucesso.<br>Agora você já pode acessar sua conta com suas novas credenciais.',
					icon: 'success',
					padding: "8px",
					timer: 9000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		errorBirth: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Opa',
					text: 'Você precisa ter mais de 16 anos para usar este aplicativo',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		emptyNome: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Preenchimento obrigatório',
					html: 'O campo nome é obrigatório, preencha ao menos 3 caracteres.',
					icon: 'warning',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 100);
		},
		saveMensagem: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Alterações salvas!',
					html: 'Suas modificações foram salvas com sucesso.',
					icon: 'success',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		blockedAccountSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Conta bloqueada!',
					html: 'A conta selecionada foi bloqueada com sucesso.',
					icon: 'success',
					padding: "8px",
					timer: 7000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		recoverAccountSuccess: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Conta reativada!',
					html: 'A conta selecionada foi reativada com sucesso.',
					icon: 'success',
					padding: "8px",
					timer: 7000,
					showConfirmButton: false,
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
		errorEventTags: function alertError(){
			setTimeout(function(){
				Swal.fire({
					title: 'Atenção',
					text: 'Adicione ao menos um tipo de evento',
					icon: 'error',
					padding: "8px",
					confirmButtonText: 'OK',
					allowOutsideClick: false,
					width: "80%"
				});
			}, 600);
		},
	}

	// Function para verificação de respostas nulas, indefinidas, whatever
	function isNullOrUndefined(data){
		return data == null || data === "undefined" || data === null || typeof data === "undefined";
	}

	// Variável responsável por cachear algumas informações dos usuários.
	userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

	// Variável responsável por cachear todos os usuários
	allUsersInfo = JSON.parse(window.localStorage.getItem('allUsersInfo'));

	// Variável responsável por guardar o usuário que você enviará a msg
	toUser = JSON.parse(window.localStorage.getItem('toUser'));

	// Variável responsável por cachear todos os eventos
	allEvents = JSON.parse(window.localStorage.getItem('allEvents'));

	// Variável responsável por cachear informações de configurações, páginas etc.
	configParams = JSON.parse(window.sessionStorage.getItem('configParams')) || {};

	// Variável responsável por cachear informações de das criações de eventos.
	cachedEvent = JSON.parse(window.sessionStorage.getItem('cachedEvent')) || {};

	// Getters e Setters das Variáveis de Cache declaradas acima ^
	function setUserCache(user) {
		window.localStorage.setItem('userInfo', JSON.stringify(user));
		userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
	}

	function resetUserCache() {
		window.localStorage.setItem('userInfo', '{}');
		userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
	}

	function setAllUsersCache(users) {
		window.localStorage.setItem('allUsersInfo', JSON.stringify(users));
		allUsersInfo = JSON.parse(window.localStorage.getItem('allUsersInfo'));
	}

	function resetAllUsersCache() {
		window.localStorage.setItem('allUsersInfo', '{}');
		allUsersInfo = JSON.parse(window.localStorage.getItem('AllUsersInfo'));
	}

	function setToUser(user) {
		window.localStorage.setItem('toUser', user);
		toUser = JSON.parse(window.localStorage.getItem('toUser'));
	}

	function resetToUser() {
		window.localStorage.setItem('toUser', '{}');
		toUser = JSON.parse(window.localStorage.getItem('toUser'));
	}

	function setAllEvents(events) {
		window.localStorage.setItem('allEvents', JSON.stringify(events));
		allEvents = JSON.parse(window.localStorage.getItem('allEvents'));
	}

	function resetAllEvents() {
		window.localStorage.setItem('allEvents', '[]');
		allEvents = JSON.parse(window.localStorage.getItem('allEvents'));
	}

	function setConfigParams(params) {
		window.sessionStorage.setItem('configParams', JSON.stringify(params));
		configParams = JSON.parse(window.sessionStorage.getItem('configParams'));
	}

	function resetConfigParams() {
		window.sessionStorage.setItem('configParams', '{}');
		configParams = JSON.parse(window.sessionStorage.getItem('configParams'));
	}

	function setCachedEvent(params) {
		window.sessionStorage.setItem('cachedEvent', JSON.stringify(params));
		cachedEvent = JSON.parse(window.sessionStorage.getItem('cachedEvent'));
	}

	