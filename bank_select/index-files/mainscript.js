$(function() {
    function t() {
        $("html").addClass("over-flow-hidden"), f.show(), r.hide(), p.show()
    }

    function o() {
        $("html").removeClass("over-flow-hidden"), f.hide(), r.show(), p.hide()
    }

    function n() {
        $("body").addClass("over-flow-hidden"), $(".search-modal").addClass("pre-open"), window.setTimeout(function() {
            $(".search-modal").addClass("open"), window.setTimeout(function() {
                $("#txtSearch").is(":visible") && $("#txtSearch").focus()
            }, 100)
        }, 5)
    }

    function i() {
        $("body").removeClass("over-flow-hidden"), $(".search-modal").removeClass("open"), window.setTimeout(function() {
            $(".search-modal").removeClass("pre-open")
        }, 350)
    }
    var a = "ar" == $("html").attr("lang");
    $("span.scroll-to-top").click(function() {
        $("body,html").stop().animate({
            scrollTop: 0
        }, "500")
    }), $(window).on("scroll", function() {
        $(window).scrollTop() > 100 ? $("span.scroll-to-top").fadeIn(300) : $("span.scroll-to-top").fadeOut(300)
    }), $(".toggle").each(function() {
        var t = $(this).find("[data-toggler-btn]"),
            o = $(this).find(".toggle-item");
        t.click(function(t) {
            t.preventDefault(), o.each(function() {
                var t = $(this);
                t.hasClass("hidden") ? t.removeClass("hidden") : t.addClass("hidden")
            })
        })
    }), $().slick && (window._slickArr = [], window._slickConfig = function(t) {
        return {
            dots: !0,
            infinite: !0,
            slidesToShow: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 991 ? 3 : 1,
            slidesToScroll: 1,
            rtl: a,
            prevArrow: t.find("[data-js-social-left]"),
            nextArrow: t.find("[data-js-social-right]")
        }
    }, $("[data-js-social-cards-wrapper]").each(function() {
        var t = $(this),
            o = t.find("[data-js-social-cards]"),
            n = o.slick(window._slickConfig(o.parents("[data-js-social-cards-wrapper]")));
        window._slickArr.push(n)
    }), window.refreshAllSliders = function() {
        window._slickArr.map(function(t) {
            var o = t[0];
            $(o).find("*").removeAttr("style")
        }), window._slickArr.map(function(t) {
            var o = t[0];
            $(o).slick("slickGoTo", 0)
        })
    }), $(".toggle-read-more").each(function() {
        var t = $(this).find(".moreBtn"),
            o = $(this).find(".lessBtn"),
            n = $(this);
        t.click(function(t) {
            t.preventDefault(), n.addClass("open")
        }), o.click(function(t) {
            t.preventDefault(), n.removeClass("open")
        })
    }), $(".form-group.flying-label").each(function() {
        var t = $(this),
            o = $(this).find("input,textarea");
        $(this).find("label");
        t.click(function() {
            o.focus()
        }), o.on("focus", function() {
            t.addClass("focus")
        }), o.on("blur", function() {
            $(this).val() && $(this).val().length > 0 || t.removeClass("focus")
        }), o.val() && o.val().length > 0 && t.addClass("focus")
    }), window.floatingLine = function() {
        $("ul.floating-line").each(function(t, o) {
            var n = $(o).find("li"),
                i = $(o).find("li.floating-line");
            i.width("1px" | $(o).find("li.active").outerWidth()), a && i.css("right", "auto"), i.stop().animate({
                left: "1px" | $(o).find("li.active").position().left
            }, "quick"), n.click(function() {
                var t = $(this);
                i.width(t.outerWidth() + "px"), a && i.css("right", "auto"), i.stop().animate({
                    left: "1px" | t.position().left
                }, "quick")
            })
        })
    }, window.floatingLine(), $(".data-ja-add-table table").addClass("table"), window.initStickyTabs = function() {
        function t(t) {
            a.css({
                top: 20,
                height: t - 40 + "px",
                position: "fixed",
                width: e + "px"
            })
        }

        function o() {
            a.css({
                top: "auto",
                height: "auto",
                position: "relative",
                width: "auto"
            })
        }

        function n(t) {
            a.css({
                top: -t + 20 + "px"
            })
        }
        $("body").scrollspy({
            target: "#my-nav"
        });
        var i = $("[data-scroll-spy-container]");
        if (i.length > 0) {
            var a = $("[data-scroll-spy-nav]"),
                e = 0 | a.width(),
                s = 0 | a.find("ul").height(),
                l = ($("footer.footer"), 0 | i.offset().top),
                c = 0 | $(window).scrollTop(),
                d = 0 | $(window).height(),
                r = 0 | i.height(),
                f = l + r - 40 - (s - d) | 0,
                p = $('<select class="form-control">');
            a.find("li").map(function() {
                var t = $(this).find("a"),
                    o = t.attr("href"),
                    n = t.html();
                p.append($("<option>").attr("value", o).text(n))
            }), p.click(function() {
                $("html, body").scrollTop(c)
            }), p.on("change", function(t) {
                t.preventDefault(), $("html, body").stop().animate({
                    scrollTop: $(this.value).offset().top - 124
                }, 500)
            });
            var h = $('<div class="hidden-md hidden-lg custom-scroll-spy-mobile">');
            h.append($('<div class="container">').append($('<div class="form-control-select">').append(p).append($('<div class="form-control">&nbsp;</div>')))), $("body").append(h), $(window).scroll(function() {
                l = 0 | i.offset().top, c = 0 | $(window).scrollTop(), d = 0 | $(window).height(), r = 0 | i.height(), f = l + r - 40 - (s - d) | 0, r > d && (l < c + 20 ? (t(d), h.fadeIn()) : (o(), h.fadeOut()), c + d > f && n(c + d - f))
            }), a.find("a").click(function(t) {
                t.preventDefault();
                var o = $(this).attr("href").replace("#", "");
                $("html, body").stop().animate({
                    scrollTop: $("#" + o).offset().top
                }, 500)
            })
        }
    }, $("body").on("click", "[data-js-scroll-id]", function(t) {
        t.preventDefault(), $("html, body").stop().animate({
            scrollTop: $($(this).attr("href")).offset().top - 20
        }, 500)
    });
    var e = $("[data-js-password-sneak-peek]"),
        s = e.find("button"),
        l = e.find("input");
    s.mouseup(function() {
        l.attr("type", "password")
    }).mousedown(function() {
        l.attr("type", "text")
    });
    var c = $("[data-js-change-lang]"),
        d = $("[data-js-change-lang-wrapper]");
    c.click(function() {
        $(this).toggleClass("open"), d.toggle()
    }), $(document).on("keyup", function(t) {
        switch (t.keyCode) {
            case 27:
                i(), o()
        }
    }), $("body").on("click", "[data-js-close-search]", function() {
        i()
    }), $("body").on("click", "[data-js-open-search]", function() {
        o(), n()
    });
    var r = $("[data-js-open-side-nav]"),
        f = $("[data-js-close-side-nav]"),
        p = $("[data-js-side-nav-wrapper]");
    r.click(function(o) {
        o.preventDefault(), t()
    }), f.click(function(t) {
        t.preventDefault(), o()
    }), $(".content-table").find("table").each(function() {
        $(this).addClass("table table-bordered")
    }), $(".nano").nanoScroller(), initStickyTabs()
    //$.simpleWeather({
    //    location: "Dubai, UAE",
    //    woeid: "",
    //    unit: "c",
    //    success: function(t) {
    //        $("[data-js-wather-widget-number]").html(t.temp + "&deg; " + t.units.temp), $("[data-js-wather-widget-icon]").addClass("icon- icon-" + t.code)
    //    },
    //    error: function(t) {
    //        $("#weather").html("<p>" + t + "</p>")
    //    }
    //}),
        
});