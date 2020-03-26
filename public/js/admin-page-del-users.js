
	$("#btn-menu-back").click(function(){
		window.location.replace("./admin-page.html");
	});

	function getAllUsersInfo(){
		$.get("./get-users", {_id: userInfo._id}).done(function (data) {
			if (!(isNullOrUndefined(data))) {
				setAllUsersCache(data);
				makeUsersObjects();
			}
		});
	}

	function makeUsersObjects(){
		let divsCreated = []; 
			allUsersInfo.forEach(function(data){
				divsCreated.push("<div class='users-t' name='"+data._id+"'><div id='profile-img-div' name='"+data._id+
				"' style='background-image: url("+data.pics_url.main_pic+");' ></div><div class='profile-info-div'><label class='user-d-u-label chat-user-label'>"+data.name+
				" "+data.lastname+"</label><label class='user-d-u-label chat-msg-label' style='height: 28px;'>"+data.age+" anos - "+data.gender+
				"</label><label class='user-d-u-label' style='text-shadow: none; color: #897ea2;'>"+data.email+"</label></div></div>");
			});

		$("#users-div").empty().append(divsCreated);

		$(".users-t").click(function(){
			var elmt = $(".users-t[name='"+$(this).attr('name')+"']");
			var selected = $(this).attr('name');
			var bgColorPrev = elmt.css("background-color");
			elmt.css("background-color", "rgb(255, 118, 118)");
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