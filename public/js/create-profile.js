	
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
		});
	}
	
	
	function getMainImg(){
		$.post("./get-user-pics", {
			email: window.localStorage.getItem('email')
		})
		.done(function( data ) {
			console.log(data.pics_ids);
			  if(data.pics_ids.main_pic == ""){
					return $("#main-pic-div").animate({ opacity: 1 }, "slow");
			  }else{
					//console.log(data.main_pic);
					$.get("./get-img", { _id: data.pics_ids.main_pic })
					.done(function( data ) {
						  if(data == null || data == "undefined"){
							  //$("#fullname-div").append("<b>Nada encontrada</b>.");
							  $("#main-pic-div").css("background-image", "url(/css/user-profile.png)");
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
		//console.log(window.localStorage.getItem('email'));
		$.post("./upd-user-main-pic", {
			email: window.localStorage.getItem('email'),
			pic_id: img_id
			})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					console.log("Deu merda");
			  }else{
					//console.log(data);
					getMainImg(); 
			  }
		});
	}
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	getMainImg();
	
	
	
	
	
