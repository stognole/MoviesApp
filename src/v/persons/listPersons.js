/**
 * Created by Ole on 30.05.2017.
 */

"use strict";

pl.v.retrieveAndListPersons = {
    setupUserInterface: function () {
        let table = document.getElementById("personOutput");
        let keys, key, i, row;

        pl.c.app.retrieveAllData();
        keys = Object.keys(Person.instances);

        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];

            row = table.insertRow(-1); // -1 adds row at the end of the table
            row.insertCell(-1).innerHTML = Person.instances[key].personId + "";
            row.insertCell(-1).innerHTML = Person.instances[key].name;
            row.insertCell(-1).innerHTML = "";
            row.insertCell(-1).innerHTML = "";
        }
    }
};