
    (function () {
        // Botão de voltar a tela anterior e dar foco no input por código mesmo (não usei autofocus)
        $("#btn-menu-back").click(function () {
            window.location.replace("/");
        });

        $("#email-input").focus();

    })();
    
    // Function que envia um email para o email informado no campo
    function sendEmailRecover(){
        event.preventDefault();
        loading();
        $.get(nodeHost + "send-email-recover", { email: $("#email-input").val()})
        .done(function( data ) {
            if(isNullOrUndefined(data)){
                loading('hide');
                alerts.errorServer();
            }else{
                loading('hide');
                alerts.emailSent();
            }
        });
        event.preventDefault();
    }

    // $("#logo-div-login").css("height", confSize.windowH()*4);
    // $("#esqueci-senha").css("height", confSize.windowH()*6);