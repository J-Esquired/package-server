(function($){

    $.fn.autoGrowInput = function(o) {

        o = $.extend({
            maxWidth: 1000,
            minWidth: 0,
            comfortZone: 70
        }, o);

        this.filter('input:text').each(function(){

            var minWidth = o.minWidth || $(this).width(),
                val = '',
                input = $(this),
                testSubject = $('<tester/>').css({
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    width: 'auto',
                    fontSize: input.css('fontSize'),
                    fontFamily: input.css('fontFamily'),
                    fontWeight: input.css('fontWeight'),
                    letterSpacing: input.css('letterSpacing'),
                    whiteSpace: 'nowrap'
                }),
                check = function() {

                    if (val === (val = input.val())) {return;}

                    // Enter new content into testSubject
                    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    testSubject.html(escaped);

                    // Calculate new width + whether to change
                    var testerWidth = testSubject.width(),
                        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                        currentWidth = input.width(),
                        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                             || (newWidth > minWidth && newWidth < o.maxWidth);

                    // Animate width
                    if (isValidWidthChange) {
                        input.width(newWidth);
                    }

                };

            testSubject.insertAfter(input);

            $(this).bind('keyup keydown blur update', check);

        });

        return this;

    };

})(jQuery);
$(function(){
    $("input.autogrow").autoGrowInput({minWidth:30,comfortZone:30});
});

function downloadTemplate() {
    var element = document.createElement('a');
    element.setAttribute('href', 'http://localhost:8080/downloadTemplate');
    //  element.setAttribute('href', 'http://localhost:8080/res/image.png');
    element.setAttribute('download', "template.png");


    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function download(jars, packageClass, params) {
    "use strict";

    var LaunchJava = "appMacOSDir=$(cd \"$(dirname \"$0\")\"; pwd)\necho $appMacOSDir\ncd $appMacOSDir\njava -cp "
    for(var i = 0; i < jars.files.length; i++){
        LaunchJava += 'lib/' + jars.files[i].name;
        if(i < jars.files.length - 1) LaunchJava += ':'
    }
    LaunchJava += ' ' + packageClass.trim() + ' ' + params.trim();
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(LaunchJava));
    element.setAttribute('download', 'LaunchJava');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}