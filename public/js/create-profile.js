	
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
		if(userInfo.pics_ids.main_pic == ""){
			return $("#main-pic-div").animate({ opacity: 1 }, "slow");
		}else{
			$.get("./get-img", { _id: userInfo.pics_ids.main_pic })
			.done(function( data ) {
				if(data == null || data == "undefined"){
					$("#main-pic-div").animate({ opacity: 1 }, "slow");
				}else{
					$("#main-pic-div").animate({ opacity: 0.1 }, "slow");
					$("#main-pic-div").css("background-image", "url(image/"+data.filename+")");
					$("#main-pic-div").animate({ opacity: 1 }, "slow");
				}
			});
		}
	}
	
	function addImgInUser(img_id){
		$.get("./upd-user-main-pic", {
			email: userInfo.email,
			pic_id: img_id
		})
		.done(function( data ) {
			if(data == null || data == "undefined"){
				console.log("Deu merda");
			}else{
				$.get("./get-user", {
					email: userInfo.email
				})
				.done(function( data ) {
					if(data == null || data == "undefined"){
						console.log("Deu merda");
					}else{
						setUserCache(data);
						getMainImg();
					}
				});
			}
		});
	}
	
	function updateProfile(){
		event.preventDefault();
		$.get("./upd-user-profile", {
			email: 	userInfo.email,
			about: 	$("#about-input").val(),
			work:	$("#work-input").val(),
			age:	$("#age-input").val(),
			gender:	$("#gender-select option:selected").val()
		}).done(function( data ) {
			if(data == null || data == "undefined"){
				console.log("Deu merda");
			}else{
				alert("Atualizou");
				$.get("./get-user", {
					email: userInfo.email
				}).done(function( data ) {
					if(data == null || data == "undefined"){
						console.log("Deu merda");
					}else{
						setUserCache(data);
						getProfile();
					}
				});
			}
		});
	}
	
	function getProfile(){
		$("#about-input").val(userInfo.about);
		$("#work-input").val(userInfo.work);
		$("#age-input").val(userInfo.age);
		$("#gender-select  option[value='"+userInfo.gender+"']").prop("selected", true);
	}
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	getProfile();
	setTimeout(function(){getMainImg()}, 300);
	
	
	
	
	
