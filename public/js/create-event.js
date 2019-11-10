$("document").ready(function() {
	
});

$("#btn-criar-evento").click(function(){createEvent();});

function createEvent(){
	loading();

	var evento = {};
		  evento.data = $("#data-input").val();
			evento.local = $("#local-input").val();
			evento.descricao = $("#descricao-input").val();
			evento.horario = $("#horario-input").val();
			console.log(evento)

			$.get("./upd-user-event", {
				email: 	userInfo.email,
				evento: evento
			}).done(function( data ) {
				if(data == null || data == "undefined"){
					console.log("Deu merda");
				}else{
					$.get("./get-user", {
						email: userInfo.email
					}).done(function( data ) {
						if(data == null || data == "undefined"){
							console.log("Deu merda");
						}else{
							setUserCache(data);
						}
					});
				}
				loading('hide');
			});
}
