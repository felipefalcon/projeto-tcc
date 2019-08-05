
	var h = $(window).height();
	$("#form-main").innerHeight(h);

	function getUserInfo(){
		$.post("./get-info-user", {login: window.localStorage.getItem('username')})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  $("#fullname-div").append("<b>Nada encontrada</b>.");
			  }else{
					$("#fullname-div").append("<p id='text-view'>"+data.nome +"</p>");
			  }
			  setTimeout(function(){$("#fullname-div").fadeIn();}, 300);
		});
	}
	
	function getImgs(){
		$.get("./files")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  $("#fullname-div").append("<b>Nada encontrada</b>.");
			  }else{
					console.log(data);
					$("#primary-img").css("background-image", "url(image/"+data[data.length-1].filename+")");  
			  }
			  setTimeout(function(){$("#fullname-div").fadeIn();}, 300);
		});
	}
	
	getUserInfo();
	getImgs();
	