var terminal = {
    setup: function() {
        var terminal_container = document.createElement("div");
        terminal_container.innerHTML = terminal.html;
        document.body.insertBefore(terminal_container, document.body.firstChild);

        terminal.container_div = jsh.select("#terminal_container");
        terminal.input_prefix_div = jsh.select("#terminal_input_prefix");
        terminal.history_div = jsh.select("#terminal_history");
        terminal.scroll_div = jsh.select("#terminal_scroll");
        terminal.command_down = false;
        terminal.python_mode = false;
        terminal.cwd_string = "~";
        terminal.file_system = {
            Applications: {},
            Library: {},
            System: {},
            Users: {
                "joshua.diaddigo.com": {
                    Applications: {},
                    Documents: {},
                    Desktop: {},
                    Downloads: {},
                    Music: {},
                    Movies: {},
                    Pictures: {},
                    Public: {}
                },
                Guest: {
                    Applications: {},
                    Documents: {},
                    Desktop: {},
                    Downloads: {},
                    Music: {},
                    Movies: {},
                    Pictures: {},
                    Public: {}
                }
            }
        };
        terminal.cwd = [terminal.file_system, terminal.file_system.Users, terminal.file_system.Users["Guest"]];

        Sk.configure({
            output:terminal.output,
            retainglobals: true}
        );

        jsh.select("#terminal_title").js.addEventListener("mousedown", function(e) {
            var terminal_window = jsh.select("#terminal_window").js;

            var init_mouse_x = e.pageX;
            var init_mouse_y = e.pageY;
            var init_window_x = terminal_window.style.left == "" ? 0 : parseInt(terminal_window.style.left);
            var init_window_y = terminal_window.style.top == "" ? 0 : parseInt(terminal_window.style.top);
            var upper_bound = -(window.innerHeight - jsh.select("#terminal_window").js.clientHeight) / 2;

            document.body.setAttribute("style", "-webkit-user-select: none;");

            var listener = function(e) {
                var dx = init_mouse_x - e.pageX;
                var dy = init_mouse_y - e.pageY;

                terminal_window.style.left = (init_window_x - dx) + "px";
                terminal_window.style.top = Math.max(upper_bound, (init_window_y - dy)) + "px";
            };

            window.addEventListener("mousemove", listener);

            var clear_listeners = function() {
                window.removeEventListener("mousemove", listener);
                window.removeEventListener("mouseup", clear_listeners);
                document.body.setAttribute("style", "");
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
            } else if(e.keyCode == 107 && terminal.command_down){
                terminal.history_div.js.innerHTML = "";
                e.target.value = "";
            }
        });

        jsh.select("#terminal_input_field").js.addEventListener("keydown", function(e) {
            if (e.keyCode == 91|| e.keyCode == 93) {
                terminal.command_down = true;
            } else if (e.keyCode == 9) {
                var partial_item = jsh.select("#terminal_input_field").js.value.split(" ");
                partial_item = partial_item[partial_item.length - 1];
                terminal.tab_complete(partial_item);
                e.preventDefault();
            }
        });

        jsh.select("#terminal_input_field").js.addEventListener("keyup", function(e) {
            if (e.keyCode == 91 || e.keyCode == 93) {
                terminal.command_down = false;
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
        if (terminal.python_mode) {
            terminal.output(terminal.input_prefix_div.js.innerText + " " + input);

            if (input == "exit()") {
                terminal.python_mode = false;
                terminal.set_prefix("joshua.diaddigo.com:" + terminal.cwd_string + " guest$ ");
            } else {
                terminal.output("<br>");
                terminal.interpret_python(input);
            }
        } else {
            terminal.output("<br>" + terminal.input_prefix_div.js.innerText + " " + input);

            input = input.split(" ");
            var command = input[0];
            var args = input.slice(1);

            if (terminal.commands[command] != undefined) {
                terminal.commands[command](args);
            } else {
                terminal.output("\n-bash: " + command + ": command not found");
            }
        }
    },

    commands: {
        cd: function(args) {
            if (args[0] != undefined) {
                terminal.change_directory(args[0]);
            }
        },

        exit: function(args) {
            terminal.close();
        },

        help: function(args) {
            terminal.output("\nThis is a shell I made with no practical use whatsoever. " +
                "Some commands that work to varying degrees include:\n");

            for (var command in terminal.commands) {
                terminal.output("\n" + command);
            }
        },

        ls: function(args) {
            if (args[0] == undefined) {
                var folder = terminal.cwd[terminal.cwd.length - 1];
            } else {
                var directory = terminal.cwd.slice(0);
                var path_items = args[0].split("/");

                for (i in path_items) {
                    if (path_items.hasOwnProperty(i)) {
                        if (path_items[i] == "") {
                            if (i == 0) {
                                directory = [terminal.file_system];
                            }
                        } else if (path_items[i] == "..") {
                            if (directory.length > 1) {
                                directory.pop();
                            }
                        } else if (directory[directory.length - 1][path_items[i]] != undefined) {
                            directory.push(directory[directory.length - 1][path_items[i]]);
                        } else if (path_items[i] == "~") {
                            directory = [terminal.file_system, terminal.file_system.Users, terminal.file_system.Users.Guest];
                        } else if (path_items[i] != ".") {
                            terminal.output("\n-bash: ls: " + path_items[i] + ": No such file or directory");
                            return;
                        }
                    }
                }

                folder = directory[directory.length - 1];
            }

            for (var file in folder) {
                terminal.output("\n" + file);
            }
        },

        open: function(args) {
            if (args[0] == undefined) {
                terminal.output("\nUsage: open page_name");
            } else {
                open_page(args[0] + "_page");
            }
        },

        python: function(args) {
            terminal.output('\nPython 2.7.6 (v2.7.6:3a1db0d2747e, Nov 10 2013, 00:42:54) \n\
                [GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin\n\
                Type "help", "copyright", "credits" or "license" for more information.\n');

            terminal.set_prefix(">>> ");
            terminal.python_mode = true;
        },

        restart: function(args) {
            window.location.reload();
        }
    },

    interpret_python: function(code) {
        Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        }).then(function(mod) {
            terminal.mod = mod;
        }, function(err) {
            terminal.output(err.toString() + "\n");
        });
    },

    output: function(output) {
        var history = terminal.history_div.js;
        output = output.replace(/\n/gm,'<br>');
        history.innerHTML = (history.innerHTML + output).replace(/^\s*<br>+/gm,'');
        terminal.scroll_div.js.scrollTop = 99999999;
    },

    change_directory: function(path) {
        var path_edits = path.split("/");

        for (var i in path_edits) {
            if (path_edits.hasOwnProperty(i)) {
                if (path_edits[i] == "") {
                    if (i == 0) {
                        terminal.cwd = [terminal.file_system];
                    }
                } else if (path_edits[i] == "..") {
                    if (terminal.cwd.length > 1) {
                        terminal.cwd.pop();
                    }
                } else if (terminal.cwd[terminal.cwd.length - 1][path_edits[i]] != undefined) {
                    terminal.cwd.push(terminal.cwd[terminal.cwd.length - 1][path_edits[i]]);
                } else if (path_edits[i] == "~") {
                    terminal.cwd = [terminal.file_system, terminal.file_system.Users,
                        terminal.file_system.Users.Guest];
                } else if (path_edits[i] != ".") {
                    terminal.output("\n-bash: cd: " + path_edits[i] + ": No such file or directory")
                }
            }
        }

        var cwd_string = "/";
        var path_built = terminal.file_system;

        for (i in terminal.cwd) {
            if (i == 0) continue;

            if (terminal.cwd.hasOwnProperty(i)) {
                for (var possible_folder in path_built) {
                    if (path_built.hasOwnProperty(possible_folder)) {
                        if (path_built[possible_folder] === terminal.cwd[i]) {
                            cwd_string += possible_folder + "/";
                            path_built = terminal.cwd[i];
                        }

                        if (cwd_string == "/Users/Guest/") {
                            cwd_string = "~/";
                        }
                    }
                }
            }
        }

        cwd_string = (cwd_string == "~/") ? "~" : cwd_string;
        terminal.cwd_string = cwd_string;
        terminal.set_prefix("joshua.diaddigo.com:" + cwd_string + " guest$ ");
    },

    tab_complete: function(partial_path) {
        var path_items = partial_path.split("/");
        var partial_item = path_items.pop();

        var directory = terminal.cwd.slice(0);

        for (var i in path_items) {
            if (path_items.hasOwnProperty(i)) {
                if (path_items[i] == "") {
                    if (i == 0) {
                        directory = [terminal.file_system];
                    }
                } else if (path_items[i] == "..") {
                    if (directory.length > 1) {
                        directory.pop();
                    }
                } else if (directory[directory.length - 1][path_items[i]] != undefined) {
                    directory.push(directory[directory.length - 1][path_items[i]]);
                } else if (path_items[i] == "~") {
                    directory = [terminal.file_system, terminal.file_system.Users, terminal.file_system.Users.Guest];
                } else if (path_items[i] != ".") {
                    return;
                }
            }
        }

        directory = directory[directory.length - 1];
        var possibilities = [];
        for (var file in directory) {
            if (directory.hasOwnProperty(file)
                && file.length > partial_item.length
                && file.substr(0, partial_item.length) == partial_item) {
                    possibilities.push(file);
            }
        }

        if (possibilities.length == 1) {
            jsh.select("#terminal_input_field").js.value += possibilities[0].substr(partial_item.length);
        }
    },

    set_prefix: function(terminal_input_prefix) {
        terminal.input_prefix_div.js.innerText = terminal_input_prefix;
        terminal.input_prefix_div.js.style.width = ((terminal_input_prefix.length) * 7.25) + "px";
    },

    html: ' <div id="terminal_container" class="transparent display_none">\
                <div id="terminal_window">\
                    <div id="terminal_absolute">\
                        <div id="terminal_ui">\
                            <div id="terminal_title">guest – bash</div>\
                            <div id="terminal_exit" class="terminal_button"></div>\
                            <div id="terminal_minimize" class="terminal_button"></div>\
                            <div id="terminal_fullscreen" class="terminal_button"></div>\
                        </div>\
                        <div id="terminal_scroll">\
                            <div id="terminal_content">\
                                <div id="terminal_history">\
                                    Last login: Tue May 10 19:03:26 on ttys002\
                                </div>\
                                <div id="terminal_input">\
                                    <table id="terminal_input_table">\
                                        <tr>\
                                            <td id="terminal_input_prefix">\
                                                joshua.diaddigo.com:~ guest$ \
                                            </td>\
                                            <td>\
                                                <input id="terminal_input_field" autocomplete="off"/>\
                                            </td>\
                                        </tr>\
                                    </table>\
                                </div>\
                            </div>\
                        </div>\
                        <div id="terminal_resize_bottom_right"></div>\
                    </div>\
                </div>\
            </div>'
};
