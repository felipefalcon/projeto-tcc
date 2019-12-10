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

			var userBasic = {};
			userBasic._id = userInfo._id;
			userBasic.name = userInfo.name;
			userBasic.main_pic = userInfo.pics_url.main_pic;

			$.get("./crt-event", {
				user: 	userBasic,
				evento: evento
			}).done(function( data ) {
				if(data == null || data == "undefined"){
					alert("Deu merda");
				}else{
					alert("Evento criado!");
				}
				loading('hide');
			});
}
