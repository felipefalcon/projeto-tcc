    (function(){

        // Variável para pegar path das páginas no Apache Cordova
	    const cordovaPath = "/android_asset/www/";

        // Variável responsável por cachear algumas informações dos usuários.
        userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

        function setUserCache(user) {
            window.localStorage.setItem('userInfo', JSON.stringify(user));
            userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        }
    
        // Function para verificação de respostas nulas, indefinidas, whatever
        function isNullOrUndefined(data){
            return data == null || data === "undefined" || data === null || typeof data === "undefined";
        }

        // Verifica se tem usuário em cache, se não tiver, retorna ao Login e limpa as variáveis de cache
        if(isNullOrUndefined(userInfo) && window.location.pathname != "index.html" && window.location.pathname != ""){
            resetUserCache();
            resetAllUsersCache();
            resetToUser();
            resetAllEvents();
            window.location.replace("index.html");
        }

        //Auto-login, verifica se há cache do Usuário se houve automaticamente Muda para Tela Principal
        if ((window.location.pathname == "index.html" || window.location.pathname == "/") && userInfo._id != undefined) {
            window.location.replace("main-view.html");
            $.get(nodeHost + "get-user-logged", { _id: userInfo._id })
            .done(function (data) {
                if (isNullOrUndefined(data)) {
                    resetUserCache();
                    resetAllUsersCache();
                    resetToUser();
                    resetAllEvents();
                    window.location.replace("index.html");
                }
                else setUserCache(data);
            });
        }

        // APACHE CORDOVA -- Verifica se tem usuário em cache, se não tiver, retorna ao Login e limpa as variáveis de cache
        if(isNullOrUndefined(userInfo) && window.location.pathname != cordovaPath+"index.html" && window.location.pathname != cordovaPath){
            resetUserCache();
            resetAllUsersCache();
            resetToUser();
            resetAllEvents();
            window.location.replace("index.html");
        }

        // APACHE CORDOVA -- Auto-login, verifica se há cache do Usuário se houve automaticamente Muda para Tela Principal
        if ((window.location.pathname == cordovaPath+"index.html" || window.location.pathname == cordovaPath) && userInfo._id != undefined) {
            window.location.replace("main-view.html");
            $.get(nodeHost + "get-user-logged", { _id: userInfo._id })
            .done(function (data) {
                if (isNullOrUndefined(data)) {
                    resetUserCache();
                    resetAllUsersCache();
                    resetToUser();
                    resetAllEvents();
                    window.location.replace("index.html");
                }
                else setUserCache(data);
            });
        }

        function resetUserCache() {
            window.localStorage.setItem('userInfo', '{}');
            userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        }
    
        function resetAllUsersCache() {
            window.localStorage.setItem('allUsersInfo', '{}');
            allUsersInfo = JSON.parse(window.localStorage.getItem('AllUsersInfo'));
        }
    
        function resetToUser() {
            window.localStorage.setItem('toUser', '{}');
            toUser = JSON.parse(window.localStorage.getItem('toUser'));
        }
    
        function resetAllEvents() {
            window.localStorage.setItem('allEvents', '[]');
            allEvents = JSON.parse(window.localStorage.getItem('allEvents'));
        }

    })();
    