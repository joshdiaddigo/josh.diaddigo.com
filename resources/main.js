var current_page;

window.onload = function() {
    jsh.cm.setup();
    terminal.setup();
    alert_setup();
    setup();
};

function setup() {
    jsh.select("#content").remove_class("transparent");

    var nav_items = jsh.select(".nav_item");
    for (var i in nav_items) {
        if (!nav_items.hasOwnProperty(i)) continue;
        nav_items[i].js.addEventListener("click", function(e) {
            open_page(e.target.innerHTML + "_page");
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

    window.addEventListener("scroll", function() {
        jsh.select("#info_image").js.style.backgroundPositionY = (-(window.scrollY / 15) + 35) + "%";
    });

    if ("onhashchange" in window) {
        window.addEventListener("hashchange", on_hash_change);
    }
    on_hash_change();
}

function open_page(page_div_id) {
    if (page_div_id == "terminal_page") {
        terminal.open();
        return
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