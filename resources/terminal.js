var terminal = {
    setup: function() {
        terminal.container_div = jsh.select("#terminal_container");
        terminal.input_prefix_div = jsh.select("#terminal_input_prefix");
        terminal.history_div = jsh.select("#terminal_history");
        terminal.scroll_div = jsh.select("#terminal_scroll");

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

                if ((init_window_width - dx) > 200) {
                    terminal_window.style.left = init_window_x - (dx / 2) + "px";
                    terminal_window.style.width = (init_window_width - dx) + "px";
                }

                if ((init_window_height - dy) > 100) {
                    terminal_window.style.top = init_window_y - (dy / 2) + "px";
                    terminal_window.style.height = (init_window_height - dy) + "px";
                }
            };

            window.addEventListener("mousemove", listener);

            var clear_listeners = function() {
                window.removeEventListener("mousemove", listener);
                window.removeEventListener("mouseup", clear_listeners);
            };

            window.addEventListener("mouseup", clear_listeners);
        });

        jsh.select("#terminal_absolute").js.addEventListener("click", function() {
            jsh.select("#terminal_input_field").js.select();
        });

        jsh.select("#terminal_input_field").js.addEventListener("keypress", function(e) {
            if (e.keyCode == 13) {
                terminal.parse_input(e.target.value);
                e.target.value = "";
            }
        });

        jsh.select("#terminal_exit").js.addEventListener("click", terminal.close);

        if ("onhashchange" in window) {
            window.addEventListener("hashchange", on_hash_change);
        }
    },

    open: function() {
        terminal.container_div.remove_class("display_none");
        terminal.container_div.remove_class("transparent");
    },

    close: function() {
        terminal.container_div.add_class("transparent");
        setTimeout(function() {
            terminal.container_div.add_class("display_none");
        }, 500);
    },

    parse_input: function(input) {
        if (input == "ls") {
            terminal.output(input, "some_file.txt");
        }
    },

    output: function(input, output) {
        var history = terminal.history_div.js;

        output = terminal.input_prefix_div.js.innerText + " " + input + "\n" + output;
        output = "<br>" + output.split("\n").join("<br>");

        history.innerHTML = history.innerHTML + output;
        terminal.scroll_div.js.scrollTop = 99999999;
    },

    update_input_prefix: function(terminal_input_prefix) {
        terminal.input_prefix_div.js.innerText = terminal_input_prefix;
        terminal.input_prefix_div.js.style.width = ((terminal_input_prefix.length + 1) * 7.5) + "px";
    }
};
