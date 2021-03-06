    
    // Loading Circle

    function showLoadingCircle(objectId){
        $(objectId).before("<div id='loading-div' style='position: absolute; z-index: 99999;'></div>");
        $(objectId).children().animate({opacity: 0.3}, 300, function(){});
        setTimeout(function(){
            $("#loading-div").load("loading-data.html", function(){
                $("#loading-data").css("height", $(objectId).height());
                $("#loading-data").css("width", $(objectId).width());
                $("#loading-data").animate({opacity: 1}, 200);
            });
        }, 200);
    }

    function showLoadingCircleOver(){
        $("body").before("<div id='loading-div' style='position: fixed; z-index: 99999;'></div>");
        $("body").css({"overflow":"hidden"});
        $("body").children().animate({opacity: 0.3}, 300, function(){});
        setTimeout(function(){
            $("#loading-div").load("loading-data.html", function(){
                $("#loading-data").css("height", $(window).height());
                $("#loading-data").css("width", $(window).width());
                $("#loading-data").animate({opacity: 1}, 200);
            });
        }, 200);
    }

    function closeLoadingCircleOver(){
        $("#loading-div").animate({opacity: 0}, 300);
        $("body").css({"overflow":""});
        $("body").children().animate({opacity: 1}, 400);
        setTimeout(function(){
            $("#loading-div").remove();
        }, 400);
    }

    function closeLoadingCircle(objectId){
        $("#loading-div").animate({opacity: 0}, 300);
        $(objectId).children().animate({opacity: 1}, 400);
        setTimeout(function(){
            $("#loading-div").remove();
        }, 400);
    }

    function closeLoadingCircleClear(){
        $("#loading-div").animate({opacity: 0}, 100, function(){
            $("#loading-div").remove();
        });
    }

