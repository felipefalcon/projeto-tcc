var h = $(window).height()/10;
$("body").innerHeight(h*10);
// O tamanho com o socials-div é 3.6 para logo e 6.4 para o login-div
$("#logo-div").innerHeight(h*5.2);
    $("#login-div").innerHeight(h*4.8);
   
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
