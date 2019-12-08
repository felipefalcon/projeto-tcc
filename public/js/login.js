
	var h = $(window).height()/10;
	$("body").innerHeight($(window).height());
	$("#logo-div").innerHeight(h*4.2);
	$("#login-div").innerHeight(h*5.8);

	var optionClicked = "btn-social";
	var fadeDelay = 300;

	function loginUser(){
		loading();
		$.post(nodeHost+"con-user", { email: $("#email-input").val(), password: $("#password-input").val() })
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
		$("#btn-social").fadeTo( fadeDelay , 1);
		$("#btn-lero").fadeTo( fadeDelay , 0.3);
		$("#socials-div").css( "display" , "block");
		$("#socials-div").fadeTo( fadeDelay , 1);
		$("#login-form-sub").fadeTo( fadeDelay , 0);
		$("#login-form-sub").css( "display" , "none");
	});

	$("#btn-lero").click(function(){
		if(optionClicked != "btn-social"){
			return;
		}
		optionClicked = "btn-lero";
		$("#btn-lero").fadeTo( fadeDelay , 1);
		$("#btn-social").fadeTo( fadeDelay , 0.3);
		$("#login-form-sub").css( "display" , "block");
		$("#login-form-sub").fadeTo( fadeDelay , 1);
		$("#socials-div").fadeTo( fadeDelay , 0);
		$("#socials-div").css( "display" , "none");
	});

	$("#email-input").focusout(function(){
		if($("#email-input").val().length > 0){
			$("#email-input").css("font-size", "16px");
		}
	});

	$("#password-input").focusout(function(){
		if($("#password-input").val().length > 0){
			$("#password-input").css("font-size", "16px");
		}
	});

	$("#btn-lero").click();
	
	resetUserCache();