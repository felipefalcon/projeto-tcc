
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 64;
	$("#users-div").css("min-height", confHeight + "px");
	$("#users-div").css("max-height", confHeight + "px");


	$("#btn-menu-back").click(function(){
		window.location.replace("./admin-page.html");
	});

	let allUsersBlocked = [];

	function getAllUsersInfo(){
		$.get(nodeHost+"get-users-inactivate", {_id: userInfo._id}).done(function (data) {
			if (!(isNullOrUndefined(data))  && data.length > 0) {
				allUsersBlocked = data;
				makeUsersObjects();
				setTimeout(function(){
					closeLoadingCircle("#users-div");
					$("#users-div").animate({"opacity": "1"}, 500);
				}, 500);
			}else{
				$("#users-div").animate({"opacity": "1"}, 500);
				closeLoadingCircle("#users-div");
				$("#users-div").empty().load("empty-users.html", function(){
					$("#empty-users").animate({opacity: 1}, 300);
				});
			}
		});
	}

	function getUserClicked(id){
		return allUsersBlocked.find(function(item){return item._id === id;});
	}

	function makeUsersObjects(){
		let divsCreated = []; 
		allUsersBlocked.forEach(function(data){
				divsCreated.push("<div class='users-t' name='"+data._id+"'><div id='profile-img-div' name='"+data._id+
				"' style='background-image: url("+data.pics_url.main_pic+");' ></div><div class='profile-info-div'><label class='user-d-u-label chat-user-label'>"+data.name+
				" "+data.lastname+"</label><label class='user-d-u-label chat-msg-label' style='height: 28px;'>"+data.age+" anos - "+data.gender+
				"</label><label class='user-d-u-label' style='text-shadow: none; color: #897ea2;'>"+data.email+"</label></div></div>");
		});

		$("#users-div").empty().append(divsCreated);

		$(".users-t").click(function(){
			var elmt = $(".users-t[name='"+$(this).attr('name')+"']");
			var userClicked = getUserClicked($(this).attr('name'));
			var selected = $(this).attr('name');
			var bgColorPrev = elmt.css("background-color");
			elmt.css("background-color", "rgb(244, 241, 241)");

			setTimeout(function(){
				Swal.fire({
					title: 'REATIVAR CONTA',
					html: "Você tem certeza que deseja ativar o usuário de email:<br>" + userClicked.email + "<br><br>Isso resetará os registros de denúncias contra o usuário também.",
					padding: "8px",
					confirmButtonText: 'SIM',
					cancelButtonText: 'NÃO',
					allowOutsideClick: false,
					width: "80%",
					showCancelButton: true,
					focusCancel: true,
				}).then(function(data){
					if(data.value){
						$.get(nodeHost+"admin-active-user", { _id: selected})
						.done(function( data ) {
							if(isNullOrUndefined(data)){
								alerts.errorServer();
							}else{
								alerts.recoverAccountSuccess();
								setTimeout(function(){getAllUsersInfo();}, 2000);
							}
						});
					}
				});
				elmt.css("background-color", bgColorPrev);
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

	$("#users-div").css({"opacity": "0.3"});
	showLoadingCircle("#users-div");

	getAllUsersInfo();