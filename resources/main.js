var alert_window;
var refresh_render_timeout;
var current_page;

window.onload = function() {
    jsh.cm.setup();
    setup();
};

function setup() {
    jsh.select("#jsh_alert_container").js.setAttribute("data-html2canvas-ignore", "true");
    alert_window = jsh.select("#jsh_alert_window").js;

    jsh.select("#content").remove_class("transparent");

    jsh.select("#jsh_alert_window").js.addEventListener("mousedown", function(e) {
        var init_mouse_x = e.pageX;
        var init_mouse_y = e.pageY;
        var init_window_x = alert_window.style.left == "" ? 0 : parseInt(alert_window.style.left);
        var init_window_y = alert_window.style.top == "" ? 0 : parseInt(alert_window.style.top);

        var listener = function(e) {
            var dx = init_mouse_x - e.pageX;
            var dy = init_mouse_y - e.pageY;

            alert_window.style.left = (init_window_x - dx) + "px";
            alert_window.style.top = (init_window_y - dy) + "px";

            update_alert_pos();
        };

        window.addEventListener("mousemove", listener);

        var clear_listeners = function() {
            window.removeEventListener("mousemove", listener);
            window.removeEventListener("mouseup", clear_listeners);
        };

        window.addEventListener("mouseup", clear_listeners);
    });

    jsh.select("#terminal_title").js.addEventListener("mousedown", function(e) {
        var terminal_window = jsh.select("#terminal_window").js;

        var init_mouse_x = e.pageX;
        var init_mouse_y = e.pageY;
        var init_window_x = terminal_window.style.left == "" ? 0 : parseInt(terminal_window.style.left);
        var init_window_y = terminal_window.style.top == "" ? 0 : parseInt(terminal_window.style.top);

        var listener = function(e) {
            var dx = init_mouse_x - e.pageX;
            var dy = init_mouse_y - e.pageY;

            terminal_window.style.left = (init_window_x - dx) + "px";
            terminal_window.style.top = (init_window_y - dy) + "px";
        };

        window.addEventListener("mousemove", listener);

        var clear_listeners = function() {
            window.removeEventListener("mousemove", listener);
            window.removeEventListener("mouseup", clear_listeners);
        };

        window.addEventListener("mouseup", clear_listeners);
    });

    jsh.select("#terminal_resize_bottom_right").js.addEventListener("mousedown", function(e) {
        var terminal_window = jsh.select("#terminal_window").js;

        var init_mouse_x = e.pageX;
        var init_mouse_y = e.pageY;
        var init_window_x = terminal_window.style.left == "" ? 0 : parseInt(terminal_window.style.left);
        var init_window_y = terminal_window.style.top == "" ? 0 : parseInt(terminal_window.style.top);
        var init_window_width = terminal_window.style.width == "" ? 500 : parseInt(terminal_window.style.width);
        var init_window_height = terminal_window.style.height == "" ? 300 : parseInt(terminal_window.style.height);

        var listener = function(e) {
            var dx = init_mouse_x - e.pageX;
            var dy = init_mouse_y - e.pageY;

            terminal_window.style.left = init_window_x - (dx / 2) + "px";
            terminal_window.style.top = init_window_y - (dy / 2) + "px";
            terminal_window.style.width = (init_window_width - dx) + "px";
            terminal_window.style.height = (init_window_height - dy) + "px";
        };

        window.addEventListener("mousemove", listener);

        var clear_listeners = function() {
            window.removeEventListener("mousemove", listener);
            window.removeEventListener("mouseup", clear_listeners);
        };

        window.addEventListener("mouseup", clear_listeners);
    });

    jsh.select("#terminal_exit").js.addEventListener("click", close_terminal);

    if ("onhashchange" in window) {
        window.addEventListener("hashchange", on_hash_change);
    }

    var nav_items = jsh.select(".nav_item");
    for (var i in nav_items) {
        nav_items[i].js.addEventListener("click", function(e) {
            open_page(e.target.innerHTML + "_page");
        });
    }

    open_page("home_page");
    open_terminal();
}

function open_page(page_div_id) {
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
        pages[i].add_class("transparent");
    }

    setTimeout(function() {
        var pages = jsh.select(".page");
        for (var i in pages) {
            pages[i].add_class("display_none");
        }

        jsh.select("#" + page_div_id).remove_class("display_none");
        setTimeout(function() {
            jsh.select("#" + page_div_id).remove_class("transparent");
        }, 10);
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

function alert(message, title, args) {
    setTimeout(update_alert_bg, 100);

    args = args == undefined ? {} : args;

    args.button_callback = (args.button_callback == undefined) ? function() {close_alert();} : args.button_callback;
    args.cancel_callback = (args.cancel_callback == undefined) ? function() {close_alert();} : args.cancel_callback;

    jsh.alert.open(message, title, args);
}

function close_alert() {
    setTimeout(function() {
        alert_window.style.left = alert_window.style.top = "0px";
        update_alert_bg();
    }, 500);

    jsh.alert.close();
}

window.addEventListener("resize", function() {
    update_alert_pos();
    clearTimeout(refresh_render_timeout);
    refresh_render_timeout = setTimeout(update_alert_bg, 500);
});

function update_alert_bg() {
    html2canvas(document.body, {async: true}).then(function(canvas) {
        stackBoxBlurCanvasRGBA(canvas, 10, 10, canvas.width, canvas.height, 50, 2);
        alert_window.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
        update_alert_pos();
    });
}

function update_alert_pos() {
    var bounds = alert_window.getBoundingClientRect();
    alert_window.style.backgroundPosition = (-bounds.left - 11) + "px " + (-bounds.top - 11) + "px";
}

function open_terminal() {
    jsh.select("#terminal_container").remove_class("display_none");
    jsh.select("#terminal_container").remove_class("transparent");
}

function close_terminal() {
    jsh.select("#terminal_container").add_class("transparent");
    setTimeout(function() {
        jsh.select("#terminal_container").add_class("display_none");
    }, 500);
}
