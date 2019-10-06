
	var h = $(window).height()/10;
	$("#logo-div").innerHeight(48);
	$("#logo-div").css("background-color", "rgb(57,35,80)");
	$("#logo-div img").innerHeight(h/1.6);
	$("body").innerHeight($(window).height());

	$("#btn-menu-back").click(function(){
		window.location.replace("./main-view.html");
	});

	$("#btn-menu-del-users").click(function(){
		window.location.href = "./admin-page-del-users.html"
	});
	