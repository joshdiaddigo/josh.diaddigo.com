var americano_map = {
    setup: function() {
        jsh.req.send({
            url: "./resources/util/query_americanos.php",
            parse_json: true,
            data: {action: "receive"},
            callback: function(response) {
                var table = document.createElement("table");
                table.id = "americano_visits";

                for (var i = 0; i < response.length; i++) {
                    var row = document.createElement("tr");

                    var rating_column = document.createElement("td");
                    var date_column = document.createElement("td");
                    var name_column = document.createElement("td");
                    var comments_column = document.createElement("td");
                    var location_column = document.createElement("td");

                    rating_column.innerText = response[i]["rating"] + "/10";
                    rating_column.classList.add("americano_visits_rating");

                    var date = response[i]["date"].split(/[- :]/);
                    date_column.innerText =  (date[1] - 1) + "/" + date[2] + "/" + date[0];
                    date_column.classList.add("americano_visits_date");

                    name_column.innerText = response[i]["name"];
                    name_column.classList.add("americano_visits_name");

                    comments_column.innerText = response[i]["comments"];
                    comments_column.classList.add("americano_visits_comments");

                    americano_map.create_map(location_column, parseInt(response[i]["longitude"]), parseInt(response[i]["latitude"]));
                    location_column.classList.add("americano_visits_location");

                    row.appendChild(rating_column);
                    row.appendChild(date_column);
                    row.appendChild(name_column);
                    row.appendChild(comments_column);
                    row.appendChild(location_column);

                    table.appendChild(row);
                }

                jsh.select("#americano_visits_container").js.appendChild(table);
            }
        });
    },

    create_map: function(div, longitude, latitude) {
        return new google.maps.Map(div, {
            center: {
                lng: longitude,
                lat: latitude
            },
            scrollwheel: false,
            zoom: 10
        });
    }
};