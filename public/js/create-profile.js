	
	function uploadMainPic(){
		$("#main-pic-div").animate({ opacity: 0.4 }, "slow");
		var fd = new FormData($("#send-main-pic")[0]);
		$.ajax({
			url:'/upload',
			data: fd,
			type:'POST',
			contentType: false,
			processData: false
		})
		.done(function(data){
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
						  }else{
								//console.log(data);
								$("#main-pic-div").animate({ opacity: 0.1 }, "slow");
								$("#main-pic-div").css("background-image", "url(image/"+data.filename+")");
						  }
						  $("#main-pic-div").animate({ opacity: 1 }, "slow");
					});
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
					//console.log(data);
			  }
		});
	}
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	getMainImg();
	
	
	
	
	
