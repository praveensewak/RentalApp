(function($){
    $.fn.jExpand = function(){
        var element = this;

        $(element).find("tr:odd").addClass("odd");
        $(element).find("tr:not(.odd)").hide();
        $(element).find("tr:first-child").show();

        $(element).find("tbody").click(function(e) {
            var hasOdd = $(e.target).parent().hasClass('odd');
            console.log(hasOdd)
            if(hasOdd) {
                var hasClass = $(e.target).parent().hasClass('active');
                if (hasClass) {
                    $(e.target).parent().removeClass('active');
                } else {
                    $(e.target).parent().addClass('active');
                }
                $(e.target).parent().next("tr").toggle();
            }
        });
        
    }    
})(jQuery); 