	
	function uploadMainPic(){
		//event.preventDefault();
		var fd = new FormData($("#send-main-pic")[0]);
		$.ajax({
			url:'/upload',
			data: fd,
			type:'POST',
			contentType: false,
			processData: false
		}).done(function(e){getImgs(); console.log(e);});
	}
	
	function getImgs(){
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
	
	
	$("#main-pic-input").change(function (){
		uploadMainPic();
	});
	
	
	
	
	
	
