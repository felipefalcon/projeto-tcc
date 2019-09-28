$("document").ready(function() {

	$('#main-pic-input').on("change", function() {
		uploadImage(this, $("#main-pic-div"), "./upd-user-main-pic");
	});
	
	$('#sec-pic-input-1').on("change", function() {
		uploadImage(this, $("#sec-pic-div-1"), "./upd-user-sec-pic-1");
	});
	
	$('#sec-pic-input-2').on("change", function() {
		uploadImage(this, $("#sec-pic-div-2"), "./upd-user-sec-pic-2");
	});
	
	$('#sec-pic-input-3').on("change", function() {
		uploadImage(this, $("#sec-pic-div-3"), "./upd-user-sec-pic-3");
	});
  
	function uploadImage(elmnt, divImg, urlUpd){
		var $files = $(elmnt).get(0).files;

		if ($files.length) {

			if ($files[0].size > $(elmnt).data("max-size") * 1024) {
				alert("Arquivo muito pesado.");
				return false;
			}

			var apiUrl = 'https://api.imgur.com/3/image';
			var apiKey = '4409588f10776f7';

			var settings = {
				async: true,
				crossDomain: true,
				processData: false,
				contentType: false,
				type: 'POST',
				url: apiUrl,
				headers: {
					Authorization: 'Client-ID ' + apiKey,
					Accept: 'application/json'
				},
				mimeType: 'multipart/form-data'
			};

			var formData = new FormData();
			formData.append("image", $files[0]);
			settings.data = formData;
		  
			loading();
			
			$.ajax(settings).done(function(response) {
				var res = JSON.parse(response);
				var link = res.data.link.replace(/^http:\/\//i, 'https://');
				divImg.css("background-image", "url("+link+")");
				addImgInUser(urlUpd, link, divImg);
			});
		}
	}
  
	function addImgInUser(url, img_url, divImg){
		$.get(url, {
			email: userInfo.email,
			pic_url: img_url
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
					}
					loading('hide');
				});
			}
		});
	}
	
	getProfile();
	getImgs();
  
});

	function updateProfile(){
		event.preventDefault();
		loading();
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
					loading('hide');
				});
			}
		});
	}
	
	function getImgs(){
		$('#main-pic-div').css("background-image", "url("+userInfo.pics_url.main_pic+")");
		$('#sec-pic-div-1').css("background-image", "url("+userInfo.pics_url.sec_pic1+")");
		$('#sec-pic-div-2').css("background-image", "url("+userInfo.pics_url.sec_pic2+")");
		$('#sec-pic-div-3').css("background-image", "url("+userInfo.pics_url.sec_pic3+")");
	}
	
	function getProfile(){
		$("#about-input").val(userInfo.about);
		$("#work-input").val(userInfo.work);
		$("#age-input").val(userInfo.age);
		$("#gender-select  option[value='"+userInfo.gender+"']").prop("selected", true);
	}
