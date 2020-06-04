
	$("#logo-div").innerHeight(60);
	var confHeight = $(window).innerHeight() - 64 - 64;
	$("#users-div").css("min-height", confHeight + "px");
	$("#users-div").css("max-height", confHeight + "px");


	$("#btn-menu-back").click(function(){
		window.location.replace("./admin-page.html");
	});

	let allUsersReported = [];

	function getAllUsersInfo(){
		$.get("./get-users-reported", {_id: userInfo._id}).done(function (data) {
			if (!(isNullOrUndefined(data))) {
				allUsersReported = data;
				makeUsersObjects();
			}
		});
	}

	function getUserClickedReports(id){
		return allUsersReported.find(function(item){return item._id === id;}).reports;
	}

	function makeUsersObjects(){
		let divsCreated = []; 
		allUsersReported.forEach(function(data){
				divsCreated.push("<div class='users-t' name='"+data._id+"'><div id='profile-img-div' name='"+data._id+
				"' style='background-image: url("+data.pics_url.main_pic+");' ></div><div class='profile-info-div'><label class='user-d-u-label chat-user-label'>"+data.name+
				" "+data.lastname+"</label><label class='user-d-u-label chat-msg-label' style='height: 28px;'>"+data.age+" anos - "+data.gender+
				"</label><label class='user-d-u-label' style='text-shadow: none; color: #897ea2;'>"+data.email+"</label></div></div>");
		});

		$("#users-div").empty().append(divsCreated);

		$(".users-t").click(function(){
			var elmt = $(".users-t[name='"+$(this).attr('name')+"']");
			var userClickedReports = getUserClickedReports($(this).attr('name'));
			var selected = $(this).attr('name');
			var bgColorPrev = elmt.css("background-color");
			elmt.css("background-color", "rgb(255, 255, 200)");

			let DOMElementReports = [];

			userClickedReports.forEach(function(report){
				DOMElementReports.push("<div class='report-div-unit'><label class='user-d-u-label chat-user-label'>"+(new Date(report.dt_report)).toLocaleDateString()+
				"</label><label class='user-d-u-label chat-msg-label'>"+report.reason+"</labe></div>");
			});

			setTimeout(function(){
				// if(window.confirm("Você tem certeza que deseja deletar a conta selecionada?\nEsta ação é irreversível!")){
				// 	$.get("./admin-del-user", { _id: selected})
				// 	.done(function( data ) {
				// 		if(data == null || data == "undefined"){
				// 			alert("Algum erro");
				// 		}else{
				// 			alert("A conta foi deletada!");
				// 			$("#users-div").empty();
				// 			getAllUsersInfo();
				// 		}
				// 	});
				// }else{
				// 	elmt.css("background-color", bgColorPrev);
				// }
				console.log(userClickedReports);
				elmt.css("background-color", bgColorPrev);
				Swal.fire({
					title: 'Denúncias',
					html: DOMElementReports.join(""),
					padding: "8px",
					confirmButtonText: 'BLOQUEAR',
					cancelButtonText: 'VOLTAR',
					allowOutsideClick: false,
					width: "80%",
					showCancelButton: true,
					focusCancel: true,
				});
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