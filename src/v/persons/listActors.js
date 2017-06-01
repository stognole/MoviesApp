/**
 * Created by Ole on 01.06.2017.
 */

"use strict";

pl.v.retrieveAndListActors = {
    setupUserInterface: function () {
        let table = document.getElementById("actorOutput");
        let keys, key, i, row;

        pl.c.app.retrieveAllData();
        keys = Object.keys(Actor.instances);

        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];

            row = table.insertRow(-1); // -1 adds row at the end of the table
            row.insertCell(-1).innerHTML = Actor.instances[key].personId + "";
            row.insertCell(-1).innerHTML = Actor.instances[key].name;
            row.insertCell(-1).innerHTML = Actor.instances[key]._agent._name;
            row.insertCell(-1).innerHTML = "";
        }
    }
};