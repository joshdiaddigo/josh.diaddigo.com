var alert_window;

function alert_setup() {
    jsh.select("#jsh_alert_container").js.setAttribute("data-html2canvas-ignore", "true");
    alert_window = jsh.select("#jsh_alert_window").js;

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
        stackBoxBlurCanvasRGBA(canvas, 10, 10, canvas.width, canvas.height, 10, 2);
        alert_window.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
        update_alert_pos();
    });
}

function update_alert_pos() {
    var bounds = alert_window.getBoundingClientRect();
    alert_window.style.backgroundPosition = (-bounds.left - 11) + "px " + (-bounds.top - 11) + "px";
}
