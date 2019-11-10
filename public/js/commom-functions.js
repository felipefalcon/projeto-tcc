
	function loading(status){
		if(status == 'hide'){
			$.LoadingOverlay("hide");
		}else{
			$.LoadingOverlay("show", {
				background: "rgba(63, 51, 74, 0.8)",
				imageColor: "rgba(193, 55, 120, 0.82)",
			});
		}
	}

	// Variável responsável por cachear algumas informações dos usuários.
	userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
	// Variável responsável por cachear todos os usuários
	allUsersInfo = JSON.parse(window.localStorage.getItem('allUsersInfo'));
	// Variável responsável por guardar o usuário que você enviará a msg
	toUser = JSON.parse(window.localStorage.getItem('toUser'));
	console.log(userInfo);
	function setUserCache(user){
		window.localStorage.setItem('userInfo', JSON.stringify(user));
		userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
		//console.log(userInfo);
	}
	
	function resetUserCache(){
		window.localStorage.setItem('userInfo', '{}');
		userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
		//console.log(userInfo);
	}

	function setAllUsersCache(users){
		window.localStorage.setItem('allUsersInfo', JSON.stringify(users));
		allUsersInfo = JSON.parse(window.localStorage.getItem('allUsersInfo'));
		//console.log(userInfo);
	}
	
	function resetAllUsersCache(){
		window.localStorage.setItem('allUsersInfo', '{}');
		allUsersInfo = JSON.parse(window.localStorage.getItem('AllUsersInfo'));
		//console.log(userInfo);
	}

	function setToUser(user){
		window.localStorage.setItem('toUser', user);
		toUser = JSON.parse(window.localStorage.getItem('toUser'));
	}
	
	function resetToUser(){
		window.localStorage.setItem('toUser', '{}');
		toUser = JSON.parse(window.localStorage.getItem('toUser'));
	}
	
	