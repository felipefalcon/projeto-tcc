
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
	
	