/**
 * Created by Ole on 30.05.2017.
 */

"use strict";

pl.v.retrieveAndListMovies = {
    setupUserInterface: function () {
        let table = document.getElementById("movieOutput");
        let keys, key, i, j, row, actorsCell, actorsStr, keyActors;

        pl.c.app.retrieveAllData();
        keys = Object.keys(Movie.instances);

        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];

            row = table.insertRow(-1); // -1 adds row at the end of the table
            row.insertCell(-1).innerHTML = Movie.instances[key].movieId + "";
            row.insertCell(-1).innerHTML = Movie.instances[key].title;
            row.insertCell(-1).innerHTML = Movie.instances[key].releaseDate;
            row.insertCell(-1).innerHTML = Movie.instances[key].director + "";
            
            // add all actors
            actorsCell = row.insertCell( -1 );
            keyActors = Object.keys( Movie.instances[key].actors );
            actorsStr = "";
            for (j = 0; j < keyActors.length; j += 1) {
                actorsStr += keyActors[j];
                if (j !== keyActors.length - 1) {
                    actorsStr += ", ";
                }
            }
            actorsCell.innerHTML = actorsStr;
        }
    }
};