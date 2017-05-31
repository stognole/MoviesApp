/**
 * Created by Ole on 30.05.2017.
 */
"use strict";
pl.v.updatePerson = {
    setupUserInterface: function () {
        const formObj = document.forms["personUpdate"],
            selPerson = document.getElementById( "selName" );

        pl.c.app.retrieveAllData();

        util.fillSelectWithOptions( Person.instances, selPerson,
            "personId", "name" );


        // check fields on input
        formObj["pName"].addEventListener( "input", function () {
            formObj["pName"].setCustomValidity(
                Person.checkName( formObj["pName"].value ).message );
        } );

        // neutralize the submit event
        formObj.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // after every new change of selection, form needs to change
        // -> listener needed
        selPerson.addEventListener( "change",
            pl.v.updatePerson.handlePersonSelectEvent );

        // save new person data
        document.getElementById( "saveBtn" ).addEventListener( "click",
            pl.v.updatePerson.handleSaveBtnClickEvent );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Person.saveAllData );
    },


    /**
     * updates the values in the input/output fields
     */
    handlePersonSelectEvent: function () {
        const formObj = document.forms["personUpdate"];
        const selectedPerson = document.getElementById( "selName" ).value;
        const person = Person.instances[selectedPerson];

        formObj.reset();

        if (person) {
            document.getElementById( "pID" ).value = person.personId;
            document.getElementById( "pName" ).value = person.name;

            ["pName"].forEach(
                function ( p ) {
                    // delete custom validation error message which may have
                    // been set before
                    formObj[p].setCustomValidity( "" );
                } );
        } else {
            formObj.reset();
        }
    },

    /**
     * saves the possibly altered values
     *
     * no validation here, see comment at end of method
     */
    handleSaveBtnClickEvent: function () {
        const slots = {};
        let userConfirmed;
        const formObj = document.forms["personUpdate"];

        slots.personId = document.getElementById( "pID" ).value;
        slots.name = document.getElementById( "pName" ).value;


        // confirm update with user
        let outputStr = "New values:\n\tName: " + slots.name;

        userConfirmed = confirm( outputStr + "\nPlease confirm." );

        // formObj.checkValidity() cannot be used: Unique values throw errors
        // since they are already in the database during input. However, the
        // values are still tested in the update method,
        // so validity is still granted.
        if (userConfirmed) {
            Person.instances[slots.personId].update( slots );
            formObj.reset();
        } else {
            console.log( "Update failed" );
        }

    }

};