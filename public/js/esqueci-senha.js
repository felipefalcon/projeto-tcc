var h = $(window).height()/10;
$("body").innerHeight(h*10);
$("#logo-div").innerHeight(h*5.2);
    $("#esqueci-senha").innerHeight(h*4.8);
   
function sendEmailRecover(){
	event.preventDefault();
    $.post("./send-email-recover", { email: $("#email-input").val()})
      .done(function( data ) {
          if(data == null || data == "undefined"){
              alert("Algum erro");
          }else{
              alert("Deu certo!");
          }
    });
    event.preventDefault();
}
