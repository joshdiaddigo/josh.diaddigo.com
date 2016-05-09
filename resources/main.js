var alert_window;

window.onload = function() {
    jsh.cm.setup();
    setup();
};

function setup() {

    jsh.select("#jsh_alert_container").js.setAttribute("data-html2canvas-ignore", "true");
    alert_window = jsh.select("#jsh_alert_window").js;
    update_alert_bg();

    jsh.select("#content").remove_class("transparent");

    alert("test")
}

function alert(message, title, args) {
    update_alert_bg();

    jsh.alert.open(message, title, args);
}

var refresh_render_timeout;
window.addEventListener("resize", function() {
    update_alert_pos();
    clearTimeout(refresh_render_timeout);
    refresh_render_timeout = setTimeout(function() {
        update_alert_bg();
    }, 500);
});

function update_alert_bg() {
    html2canvas(document.body).then(function(canvas) {
        boxBlurCanvasRGBA(canvas, 10, 10, canvas.width, canvas.height, 60, 2);
        alert_window.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
        update_alert_pos();
    });
}

function update_alert_pos() {
    var bounds = alert_window.getBoundingClientRect();
    alert_window.style.backgroundPosition = (-bounds.left - 11) + "px " + (-bounds.top - 11) + "px";
}