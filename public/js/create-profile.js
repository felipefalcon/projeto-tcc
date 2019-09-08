	
	function uploadMainPic(){
		var fd = new FormData($("#send-main-pic")[0]);
		$.ajax({
			url:'/upload',
			data: fd,
			type:'POST',
			contentType: false,
			processData: false
		})
		.done(function(data){
			//console.log(data);
			addImgInUser(data);
			getMainImg(); 
		});
	}
	
	
	function getMainImg(){
		
		$.post("./get-user-pics", {
			email: window.localStorage.getItem('email')
			})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					
			  }else{
					console.log(data.main_pic);
					$.post("./get-img", { _id: data.main_pic })
					.done(function( data ) {
						  if(data == null || data == "undefined"){
							  //$("#fullname-div").append("<b>Nada encontrada</b>.");
							  console.log(data);
						  }else{
								console.log(data);
								$("#main-pic-div").css("background-image", "url(image/"+data.filename+")");  
						  }
					});
			  }
		});
	}
	
	
	
	
	
	
	
	function getMainImg2(){
		$.get("./files")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  $("#fullname-div").append("<b>Nada encontrada</b>.");
			  }else{
					console.log(data);
					$("#main-pic-div").css("background-image", "url(image/"+data[data.length-1].filename+")");  
			  }
		});
	}
	
	function addImgInUser(img_id){
		console.log(window.localStorage.getItem('email'));
		$.post("./upd-user-main-pic", {
			email: window.localStorage.getItem('email'),
			pic_id: img_id
			})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					
			  }else{
					console.log(data);
			  }
		});
	}
	
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	
	
	
	
	
