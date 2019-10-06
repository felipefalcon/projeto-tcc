
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("body").innerHeight($(window).height());
	$("#users-div").innerHeight($(window).height()-$("#logo-div").innerHeight()-$("#search-div").innerHeight());

	$("#btn-menu-back").click(function(){
		window.location.replace("./admin-page.html");
	});

	function getAllUsersInfo(){
		$("#admin-page-users-div").LoadingOverlay("show", {background: "rgba(63, 51, 74, 0.8)",imageColor: "rgba(193, 55, 120, 0.82)",});
		$.get("./get-users").done(function( data ) {
			if(data == null || data == "undefined"){
				  
			}else{
				var excludeSelf = data.filter(function (em){
					return userInfo.email != em.email
				});
				setAllUsersCache(excludeSelf);
				makeEventsObjects();
			}
			$("#admin-page-users-div").LoadingOverlay('hide');
		});
	}

	function makeEventsObjects(){
			allUsersInfo.forEach(function(data, i){
				if(i % 2 == 0){
					$("#users-div").append("<div class='users-t' style='background-color: rgba(255, 255, 255, 0.24);' name='"+data._id+"'>"+
					"<div id='profile-img-div' name='"+data._id+"'></div>"+
					"<div class='profile-info-div'>"+
					"<label class='user-d-u-label'>"+data.name+"</label>"+
					"<label class='user-d-u-label'>"+data.age+" anos - "+data.gender+"</label>"+
					"<label class='user-d-u-label'>"+data.email+"</label>"+
					"</div></div>");
					$("#profile-img-div[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");	
				}else{
					$("#users-div").append("<div class='users-t' name='"+data._id+"'>"+
					"<div id='profile-img-div' name='"+data._id+"'></div>"+
					"<div class='profile-info-div'>"+
					"<label class='user-d-u-label'>"+data.name+"</label>"+
					"<label class='user-d-u-label'>"+data.age+" anos - "+data.gender+"</label>"+
					"<label class='user-d-u-label'>"+data.email+"</label>"+
					"</div></div>");
					$("#profile-img-div[name='"+data._id+"']").css("background-image", "url("+data.pics_url.main_pic+"");	
				}			
			}
		);
		$(".users-t").fadeIn("slow");

		$(".users-t").click(function(){
			var elmt = $(".users-t[name='"+$(this).attr('name')+"']");
			var selected = $(this).attr('name');
			var bgColorPrev = elmt.css("background-color");
			elmt.css("background-color", "rgba(234, 67, 67, 0.69)");
			setTimeout(function(){
				if(window.confirm("Você tem certeza que deseja deletar a conta selecionada?\nEsta ação é irreversível!")){
					$.get("./admin-del-user", { _id: selected})
					.done(function( data ) {
						if(data == null || data == "undefined"){
							alert("Algum erro");
						}else{
							alert("A conta foi deletada!");
							$("#users-div").empty();
							getAllUsersInfo();
						}
					});
				}else{
					elmt.css("background-color", bgColorPrev);
				}
			}, 200);
		});
	}

	$(document).ready(function(){
		$("#search-input").on("keyup", function() {
		  var value = $(this).val().toLowerCase();
		  $(".profile-info-div *").filter(function() {
			  $(this).parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		  });
		});
	  });

	getAllUsersInfo();