
	var h = $(window).height()/10;
	$("body").innerHeight(h*10);
	// O tamanho com o socials-div é 3.6 para logo e 6.4 para o login-div
	$("#logo-div").innerHeight(h*4.2);
	$("#login-div").innerHeight(h*5.8);

	var optionClicked = "btn-social";

	function loginUser(){
		loading();
		$.post("./con-user", { email: $("#email-input").val(), password: $("#password-input").val() })
		.done(function( data ) {
			if(data == null || data == "undefined"){
				alert("Usuário não encontrado");
			}else{
				setUserCache(data);
				window.location.replace("./main-view.html");
			}
			loading('hide');
		});
		event.preventDefault();
	}

	$("#socials-div").css( "height" , $("#login-form-sub").css("height"));

	$("#btn-social").click(function(){
		if(optionClicked != "btn-lero"){
			return;
		}
		optionClicked = "btn-social";
		$("#btn-social").fadeTo( "slow" , 1);
		$("#btn-lero").fadeTo( "slow" , 0.3);
		$("#socials-div").css( "display" , "block");
		$("#socials-div").fadeTo( "slow" , 1);
		$("#login-form-sub").fadeTo( "slow" , 0);
		$("#login-form-sub").css( "display" , "none");
	});

	$("#btn-lero").click(function(){
		if(optionClicked != "btn-social"){
			return;
		}
		optionClicked = "btn-lero";
		$("#btn-lero").fadeTo( "slow" , 1);
		$("#btn-social").fadeTo( "slow" , 0.3);
		$("#login-form-sub").css( "display" , "block");
		$("#login-form-sub").fadeTo( "slow" , 1);
		$("#socials-div").fadeTo( "slow" , 0);
		$("#socials-div").css( "display" , "none");
	});

	$("#btn-lero").click();
	
	resetUserCache();