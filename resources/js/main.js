var current_page;

window.onload = function() {
    jsh.cm.setup();
    terminal.setup();
    frosted_alert.setup();
    setup();

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-91788947-1', 'auto');
    ga('send', 'pageview');
};

function setup() {
    jsh.select("#content").remove_class("transparent");

    var nav_items = jsh.select(".nav_item");
    for (var i in nav_items) {
        if (!nav_items.hasOwnProperty(i)) continue;
        nav_items[i].js.addEventListener("click", function(e) {
            if (e.target.parentNode.tagName.toLowerCase() != "a") {
                open_page(e.target.innerHTML + "_page");
            }
            move_mobile_tray(true);
        });
    }

    var project_images = jsh.select(".projects_page_image");
    for (i in project_images) {
        if (!project_images.hasOwnProperty(i)) continue;
        project_images[i].js.addEventListener("click", function(e) {
            var height = e.target.clientHeight;
            var width = e.target.clientWidth;
            var ratio = e.target.naturalWidth / e.target.naturalHeight;

            e.target.style.height = (height == 250) ? (width / ratio) + "px" : "250px";
        });
    }

    jsh.select("#mobile_nav_button").js.addEventListener("click", function() {
        move_mobile_tray();
    });

    jsh.select("#mobile_nav_button").js.addEventListener("touchstart", function(e) {
        var moved = false;

        var nav = jsh.select("#nav");
        var content = jsh.select("#content");

        var move_listener = function(e) {
            var displacement = Math.max((e.pageX - window.innerWidth), -200);
            nav.js.style.transform = "translateX(" + displacement + "px)";
            content.js.style.transform = "translateX(" + displacement + "px)";

            moved = true;
            e.preventDefault();
        };

        var end_listener = function(e) {
            e.target.removeEventListener("touchmove", move_listener);
            e.target.removeEventListener("touchend", end_listener);
            nav.js.style.transform = "";
            nav.js.style.transition = "";
            content.js.style.transform = "";
            content.js.style.transition = "";
            if (moved) {
                move_mobile_tray();
            }
        };

        e.target.addEventListener("touchmove", move_listener);
        e.target.addEventListener("touchend", end_listener);
        nav.js.style.transition = "none";
        content.js.style.transition = "none";
    });

    if ("onhashchange" in window) {
        window.addEventListener("hashchange", on_hash_change);
    }
    on_hash_change();
}

function open_page(page_div_id) {
    if (page_div_id.length > 2 && page_div_id[1] == "/") {
        open_page(page_div_id.slice(2));
        return;
    }

    if (page_div_id == "terminal_page") {
        terminal.open();
        return
    }

    if (page_div_id == "404_page") {
        setTimeout(function() {
            alert("I have no idea where that page went, so I'm taking you back home. Sorry about that.", "Oops!", {button_text: "no worries, dude"});
        }, 1000);
        return open_page("home_page");
    } else if (page_div_id == "403_page") {
        setTimeout(function() {
            alert("You don't have permission to view this page. " +
                "If you're looking for a way to hack me, " +
                "I would recommend browsing through the " +
                "<a href=\"https://github.com/dotjoshua/joshua.diaddigo.com\">source code</a> " +
                "of this website for a vulnerability.",
                "Hm...", {button_text: "cool, thanks"});
        }, 1000);
        return open_page("home_page");
    }

    if (jsh.select("#" + page_div_id) == undefined) {
        alert("Page does not exist.", "Oops!");
        return;
    }

    if (current_page == page_div_id) {
        return;
    }

    current_page = page_div_id;

    var pages = jsh.select(".page");
    for (var i in pages) {
        if (!pages.hasOwnProperty(i)) continue;
        pages[i].add_class("transparent");
        pages[i].remove_class(pages[i].js.id + "_loading");
    }

    setTimeout(function() {
        var pages = jsh.select(".page");
        for (var i in pages) {
            if (!pages.hasOwnProperty(i)) continue;
            pages[i].add_class("display_none");
        }

        jsh.select("#" + page_div_id).remove_class("display_none");
        jsh.select("#" + page_div_id).add_class(page_div_id + "_loading");
        setTimeout(function() {
            jsh.select("#" + page_div_id).remove_class("transparent");
        }, 10);

        setTimeout(function() {
            window.dispatchEvent(new Event('page_opened'));
        }, 500);
    }, 500);

    window.location.hash = page_div_id.substring(0, page_div_id.length - 5);
}

function on_hash_change() {
    if (location.href.indexOf('#') != -1) {
        open_page(location.href.substring(location.href.indexOf("#") + 1) + "_page");
    } else {
        open_page("home_page");
    }
}

function move_mobile_tray(close) {
    var nav = jsh.select("#nav");
    if (nav.js.classList.contains("show_nav")) {
        nav.remove_class("show_nav");
    } else if (!close) {
        nav.add_class("show_nav");
    }
}

