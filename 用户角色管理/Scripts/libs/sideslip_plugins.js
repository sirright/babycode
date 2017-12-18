var sideslipContainer = {
    ids: [],
    hide_ids: [],
    hide_parentid: [],
    hide_classNames: [],
    show_ids:[],
    show_classNames:[],
    load_sideslip: function (options) {
        for (var i = 0; i < sideslipContainer.ids.length; i++) {
            if (sideslipContainer.ids[i] == options.id) {
                return false;
            }
        }
        sideslipContainer.ids.push(options.id);

        //加载在哪个元素中可传元素ID或者Class类名
        this.objId = (typeof options.objId).toLowerCase() === 'string' ? options.objId : '';
        //是否是加载在某个元素ID下，或者Class下
        this.isId = (typeof options.isId).toLowerCase() === 'boolean' ? options.isId : true;

        //需要隐藏的元素ID或类名 多个以,英文逗号隔开
        this.hide_ids = (typeof options.hide_ids).toLowerCase() === 'string' ? options.hide_ids : '';
        this.hide_classNames = (typeof options.hide_classNames).toLowerCase() === 'string' ? options.hide_classNames : '';
        this.hide_chide_nameslassNames = (typeof options.hide_names).toLowerCase() === 'string' ? options.hide_names : '';
        this.hide_parentid = (typeof options.hide_parentid).toLowerCase() === 'string' ? options.hide_parentid : '';
        ////需要显示的元素ID或类名 多个以,英文逗号隔开
        //this.show_ids =((typeof options.show_ids).toLowerCase() === 'string' ? options.show_ids : '';
        //this.show_classNames = (typeof options.show_classNames).toLowerCase() === 'string' ? options.show_classNames : '';

        //需要加载的页面 Url地址
        this.isIframe = (typeof options.isIframe).toLowerCase() === 'boolean' ? options.isIframe : true;
        //详情页中的title文字
        this.title = (typeof options.title).toLowerCase() === 'string' ? options.title : '';
        //是否显示title标题
        this.istitle = (typeof options.istitle).toLowerCase() === 'boolean' ? options.istitle : false;
        //Iframe的高度
        this.iframeHeight = (typeof options.iframeHeight).toLowerCase() === 'string' ? options.iframeHeight : '';

        //侧滑弹出高度
        this.height = (typeof options.height).toLowerCase() === 'string' ? options.height : '95%';

        //侧滑弹出宽度
        this.width = (typeof options.width).toLowerCase() === 'string' ? options.width : '800px';
        this.isscroll = (typeof options.isscroll).toLowerCase() === 'boolean' ? options.isscroll : false;
        this.default_parentIds = [];
        this.default_hide_ids = ['sideslip-container', options.id, 'sideslip_title', 'sideslip_close', 'sideslip-clear', 'sideslip-content'];
        this.default_hide_classNames = ['sideslip-header', 'sideslip-content'];
        this.default_hide_names = [];
        this.hide_obj = [];
        if (this.hide_parentid) {
            var ids = this.hide_parentid.split(',');
            for (var i = 0; i < ids.length; i++) {
                this.default_parentIds.push(ids[i]);
            }
        }
        if (this.hide_ids) {
            var ids = this.hide_ids.split(',');
            for (var i = 0; i < ids.length; i++) {
                this.default_hide_ids.push(ids[i]);
            }
        }
        if (this.hide_classNames) {
            var classNames = this.hide_classNames.split(',');
            for (var i = 0; i < classNames.length; i++) {
                this.default_hide_classNames.push(classNames[i]);
            }
        }
        if (this.hide_names) {
            var names = this.hide_names.split(',');
            for (var i = 0; i < names.length; i++) {
                this.default_hide_names.push(names[i]);
            }
        }

        //侧滑弹出Html代码
        this.html = $("<div>").attr("id", options.id)
                            .addClass("sideslip-container")
                            .css({ "height": this.height, "width": this.width })
                            .append($("<div>").attr("id", "sideslip_close").html("×").click(function () {
                                sideslipContainer.hide();
                            }));
        if (this.istitle) {
            this.html.append($("<div class='com_title'>").html(this.title));
        }
        if (this.isId) {
            $("#" + this.objId).append(this.html);
        }
        else {
            $("." + this.objId).append(this.html);
        }
        if (this.isscroll)
            $("#" + options.id).css("overflow-y", "auto");
        else
            $("#" + options.id).css("overflow-y", "hidden");

        //如果URL地址不为空
        if (this.isIframe) {
            $("#" + options.id).append($("<iframe>")
                                            .attr("id", options.id + "-iframe")
                                            .attr("frameborder", "no")
                                            .attr("border", "0")
                                            .addClass("sideslip-iframe"));
            $("#" + options.id + "-iframe").css("height", ($("#" + options.id).height() - 10));
        }
        sideslipContainer.hide_parentid = this.default_parentIds;
        sideslipContainer.hide_ids = this.default_hide_ids;
        sideslipContainer.hide_classNames = this.default_hide_classNames;
    },
    show: function (options) {
        if ($("#" + options.id + "-iframe").length > 0) {
            $("#" + options.id + "-iframe").attr("src", "");
        }
        //需要加载的页面--当前页面的元素
        this.iframe_url = typeof options.iframe_url === 'string' ? options.iframe_url : '';
        this.elementObj = typeof options.elementObj === 'object' ? options.elementObj : '';
        $(".sideslip-container").each(function () {
            if ($(this).attr("id") != options.id) {
                setTimeout(function () {
                    $('.sideslip-container').toggleClass('is-visible', false);
                }, 20);
            }
        });

        if (this.iframe_url) {
            $("#" + options.id + "-iframe").attr("src", this.iframe_url);
        }
        else if (this.elementObj) {
            this.elementObj.show();
            $("#" + options.id).append(this.elementObj);
        }
        setTimeout(function () {
            $('#' + options.id).toggleClass('is-visible', true);
        }, 20);

    },
    hide: function () {
        console.log(this.hide_ids);
        //if (true) {

        //}
        $('.sideslip-container').toggleClass('is-visible', false);
        $('.sideslip-container').remove('InforBar_wrap');
        console.log('隐藏');
        //特定写的
        if (typeof (resourceView) !== "undefined")
            resourceView.hideSideslipContainer();
        if ($('.sideslip-container').find("iframe").length > 0) {
            $('.sideslip-container').find("iframe").attr("src", "");
        }
    },
    getElementHeight: function (id) {
        return $("#" + id).height();
    },
    setIframeHeight: function (id, elementID, h) {
        try {
            document.getElementById(id + "-iframe").contentWindow.document.getElementById(elementID).style.height = h;
        } catch (e) {
            $("#" + id + "-iframe").load(function () {
                if (h != undefined)
                    document.getElementById(id + "-iframe").contentWindow.document.getElementById(elementID).style.height = h;
            });
        }
    },
    getIframeHeight: function (id) {
        return $("#" + id + "-iframe").height();
    },
    resizeIframeHeight: function (id) {
        if ($("#" + id + "-iframe").length > 0) {
            $("#" + id + "-iframe").css("height", ($("#" + id).height() - 10));
            document.getElementById(id + "-iframe").contentWindow.document.getElementsByClassName("DetailCon")[0].style.height = ($("#" + id).height() - 40)+"px";
        }
    }
}
$(function () {
    $("body").on('click', function (event) {
        //event.preventDefault();
    if (event.target.type != "checkbox" && event.target.type != "button") {
        for (var i = 0; i < sideslipContainer.hide_parentid.length; i++) {
            if (event.target.offsetParent!=null && event.target.offsetParent.id == sideslipContainer.hide_parentid[i]) {
                return false;
            }
        }
        if (event.target.parentElement != null && event.target.parentElement.className == "content") {
            return false;
        }
        for (var i = 0; i < sideslipContainer.hide_ids.length; i++) {
            if (event.target.id == sideslipContainer.hide_ids[i]) {
                return false;
            }
        }
        for (var i = 0; i < sideslipContainer.hide_classNames.length; i++) {
            if (event.target.className.indexOf(sideslipContainer.hide_classNames[i])>-1) {
                return false;
            }
        }
        if ($('.sideslip-container').hasClass("is-visible")) {
            sideslipContainer.hide();
        }
    }
    });
    $("body").on("click", ".sideslip_close", function () {

        sideslipContainer.hide();
    });
    $("body").keydown(function () {
        var event = arguments.callee.caller.arguments[0] || window.event; //消除浏览器差异
        if (event.keyCode == 27) {
            sideslipContainer.hide();
        }
    });
});
