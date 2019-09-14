
	// Variável responsável por cachear algumas informações do usuário.
	userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
	//console.log(userInfo);
	
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