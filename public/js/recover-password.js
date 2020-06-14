
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
        showLoadingCircle("#esqueci-senha");
        $.get(nodeHost + "send-email-recover", { email: $("#email-input").val()})
        .done(function( data ) {
            if(isNullOrUndefined(data)){
                closeLoadingCircle("#esqueci-senha");
                alerts.errorServer();
            }else if(data.oh_no){
                closeLoadingCircle("#esqueci-senha");
                alerts.emailNotFound();
            }else{
                closeLoadingCircle("#esqueci-senha");
                alerts.emailSent();
            }
        });
        event.preventDefault();
    }

    // $("#logo-div-login").css("height", confSize.windowH()*4);
    // $("#esqueci-senha").css("height", confSize.windowH()*6);