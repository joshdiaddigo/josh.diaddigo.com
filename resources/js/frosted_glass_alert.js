var frosted_alert = {
    alert_window: null,
    setup: function() {
        jsh.select("#jsh_alert_container").js.setAttribute("data-html2canvas-ignore", "true");
        jsh.select("#nav").js.setAttribute("data-html2canvas-ignore", "true");
        frosted_alert.alert_window = jsh.select("#jsh_alert_window").js;

        jsh.select("#jsh_alert_window").js.addEventListener("mousedown", function(e) {
            var init_mouse_x = e.pageX;
            var init_mouse_y = e.pageY;
            var init_window_x = frosted_alert.alert_window.style.left == "" ?
                0 : parseInt(frosted_alert.alert_window.style.left);
            var init_window_y = frosted_alert.alert_window.style.top == "" ?
                0 : parseInt(frosted_alert.alert_window.style.top);

            var left_bound = ((window.innerWidth - jsh.select("#jsh_alert_window").js.clientWidth) / 2);
            var upper_bound = ((window.innerHeight - jsh.select("#jsh_alert_window").js.clientHeight) / 2);

            var listener = function(e) {
                var dx = init_mouse_x - e.pageX;
                var dy = init_mouse_y - e.pageY;

                frosted_alert.alert_window.style.left =
                    Math.min(Math.max(-left_bound, (init_window_x - dx)), left_bound) + "px";
                frosted_alert.alert_window.style.top =
                    Math.min(Math.max(-upper_bound + 40, (init_window_y - dy)), upper_bound) + "px";

                frosted_alert.update_pos();
            };

            window.addEventListener("mousemove", listener);

            var clear_listeners = function() {
                window.removeEventListener("mousemove", listener);
                window.removeEventListener("mouseup", clear_listeners);
            };

            window.addEventListener("mouseup", clear_listeners);
        });

        var scroll_alert_window_bounds = frosted_alert.alert_window.getBoundingClientRect();
        var update_scroll_alert_window_bounds = true;
        window.addEventListener("scroll", function() {
            if (update_scroll_alert_window_bounds) {
                scroll_alert_window_bounds = frosted_alert.alert_window.getBoundingClientRect();
                update_scroll_alert_window_bounds = false;
                setTimeout(function() {
                    update_scroll_alert_window_bounds = true;
                }, 500);
            }

            frosted_alert.update_pos(scroll_alert_window_bounds);
        });

        var refresh_render_timeout;
        window.addEventListener("resize", function() {
            frosted_alert.update_pos();
            clearTimeout(refresh_render_timeout);
            refresh_render_timeout = setTimeout(function() {
                frosted_alert.update_bg();
            }, 500);
        });
    },

    open: function(message, title, args) {
        args = args == undefined ? {} : args;

        args.button_callback = (args.button_callback == undefined) ? function() {close_alert();} : args.button_callback;
        args.cancel_callback = (args.cancel_callback == undefined) ? function() {close_alert();} : args.cancel_callback;

        jsh.alert.open(message, title, args);

        frosted_alert.update_bg();
    },

    close: function() {
        setTimeout(function() {
            frosted_alert.alert_window.style.left = frosted_alert.alert_window.style.top = "0px";
        }, 500);

        jsh.alert.close();
    },

    update_bg: function() {
        html2canvas(document.body, {async: true}).then(function(canvas) {
            stackBoxBlurCanvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 10, 2);
            frosted_alert.alert_window.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
            frosted_alert.update_pos();
        });
    },

    update_pos: function(bounds) {
        bounds = bounds == undefined ? frosted_alert.alert_window.getBoundingClientRect() : bounds;
        frosted_alert.alert_window.style.backgroundPosition =
            (-bounds.left - window.scrollX) + "px " + (-bounds.top - window.scrollY) + "px";
    }
};

function alert(message, title, args) {
    frosted_alert.open(message, title, args);
}

function close_alert() {
    frosted_alert.close();
}
