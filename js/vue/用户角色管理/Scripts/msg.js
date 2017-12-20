function TipBox(msg, type) {
    //type1,成功，2警告，3错误，4进行中
    if (msg != "") {
        var msgleng = msg.length;
        msgleng = msgleng * 13 + 40;
        var msgposition = ($(window).width() - msgleng) / 2;
        if (document.getElementById("divTipBox") != null) {
            $('#divTipBox').html("<span id='TipBoximg'></span>" + msg);
        }
        else {
            var html = "<div id='divTipBox' style='position:fixed;top:6px;z-index: 999999999;' class='TipBoxdiv'><span id='TipBoximg'></span>" + msg + "</div>";
            $(document.body).append(html);
        }
        if (type == 1) {
            $('#divTipBox').css('background', "#64d695");
            $("#TipBoximg").addClass("TipBoximgok");
        }
        else if (type == 2) {
            $('#divTipBox').css('background', "#f8a32a");
            $("#TipBoximg").addClass("TipBoximgWarning");
        }
        else if (type == 3) {
            $('#divTipBox').css('background', "#ff0000");
            $("#TipBoximg").addClass("TipBoximgerror");
        } else {
            $('#divTipBox').css('background', "#64d695");
            $("#TipBoximg").addClass("TipBoximgIn");
        }

        $('#divTipBox').css({ 'width': msgleng, 'right': msgposition });
        $("#divTipBox").hide().fadeIn(100);
        setTimeout(function () {
            $("#divTipBox").fadeOut(2000, function () {
                $("#divTipBox").css("z-index", 99999999);
            });
        }, 2000);
    }
}