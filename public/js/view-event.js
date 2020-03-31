
	$("#btn-menu-back").click(function () {
		cachedEvent = undefined;
		window.sessionStorage.removeItem('cachedEvent');
		window.location.replace("./main-view.html");
	});

	$("#btn-criar-evento").click(function () { createEvent(); });

	$("#local-input").click(function(){
		window.location.href = "./set-map.html";	
	});

	function loadCachedEvent(){
		if(JSON.stringify(cachedEvent) === JSON.stringify({})) return;
		if(cachedEvent.title) $("#title-input").val(cachedEvent.title);
		if(cachedEvent.data) $("#data-input").val(cachedEvent.data);
		if(cachedEvent.horario) $("#horario-input").val(cachedEvent.horario);
		if(cachedEvent.descricao) $("#descricao-input").val(cachedEvent.descricao);
		if(cachedEvent.address) {
			$("#local-input").css("opacity", "1");
			$("#local-input").val(cachedEvent.address.road);
			$("#map-button").css({"color":"#4dcc80", "border": "2px solid #4dcc80", "opacity": "1"});
		}
		if(cachedEvent.tags) {
			let lengthTagsArray = cachedEvent.tags.length;
			for(var i = 0; i <= lengthTagsArray; ++i){
				$("#tag-"+cachedEvent.tags[i]).prop( "checked", true );
			}
		}
		if(cachedEvent.img) {
			$("#img-event").css("background-image", "url("+cachedEvent.img+")");
		}
	}

	loadCachedEvent();


