
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("body").innerHeight($(window).height());
	$("#users-div").innerHeight($(window).height()-$("#logo-div").innerHeight()-$("#search-div").innerHeight());

	function setInfoToUser(){
		$("#send-to-name-label").text(toUser.name);
		$("#profile-img-div").css("background-image", "url("+toUser.pics_url.main_pic+"");
	}

	$("#btn-menu-back").click(function(){
		window.location.replace("./main-view.html");
	});

	$(document).ready(function(){
		$("#search-input").on("keyup", function() {
		  var value = $(this).val().toLowerCase();
		  $(".profile-info-div *").filter(function() {
			  $(this).parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		  });
		});
	});

	setInfoToUser();
