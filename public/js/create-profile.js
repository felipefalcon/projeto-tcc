	
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
		$.post("./get-user-profile", {
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
							  //$("#main-pic-div").css("background-image", "url(/css/user-profile.png)");
							  $("#main-pic-div").animate({ opacity: 1 }, "slow");
						  }else{
								//console.log(data);
								$("#main-pic-div").animate({ opacity: 0.1 }, "slow");
								$("#main-pic-div").css("background-image", "url(image/"+data.filename+")");
								$("#main-pic-div").animate({ opacity: 1 }, "slow");
						  }
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
	
	function updateProfile(){
		event.preventDefault();
		$.post("./upd-user-profile", {
			email: 	window.localStorage.getItem('email'),
			about: 	$("#about-input").val(),
			work:	$("#work-input").val(),
			age:	$("#age-input").val(),
			gender:	$("#gender-select option:selected").val()
			})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					console.log("Deu merda");
			  }else{
					//console.log(data);
					alert("Atualizou");
					getProfile();
			  }
		});
	}
	
	function getProfile(){
		$.post("./get-user-profile", {
			email: 	window.localStorage.getItem('email'),
		})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
					console.log("Deu merda");
			  }else{
					//console.log(data);
					$("#about-input").val(data.about);
					$("#work-input").val(data.work);
					$("#age-input").val(data.age);
					$("#gender-select  option[value='"+data.gender+"']").prop("selected", true);
			  }
		});
	}
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	getMainImg();
	getProfile();
	
	
	
	
	
