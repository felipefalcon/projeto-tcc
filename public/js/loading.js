// Loading Circle
    let cachedContentBeforeEmpty = "";
    
    function showLoadingCircle(objectId){
        cachedContentBeforeEmpty = $(objectId).contents().clone();
        $(objectId).fadeOut(200, function(){
            $(objectId).empty().load("loading-data.html", function(){
                $(objectId).fadeIn();
                $("#loading-data").animate({opacity: 1}, 200);
            });
        });
    }

    function closeLoadingCircle(objectId){
        $(objectId).fadeOut(function(){
            $(objectId).empty().append(cachedContentBeforeEmpty);
            $(objectId).fadeIn(200);
            cachedContentBeforeEmpty = "";
        });
    }
