
	// Variável do host onde estão os serviços node (Mudando aqui, muda de todos os arquivos)
	const nodeHost = "./";

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
		window.localStorage.setItem('allEvents', '{}');
		allEvents = JSON.parse(window.localStorage.getItem('allEvents'));
	}

	//Auto-login, verifica se há cache do Usuário se houve automaticamente Muda para Tela Principal
	if ((window.location.pathname == "index.html" || window.location.pathname == "/") && userInfo.email != undefined) {
		window.location.replace("main-view.html");
	}