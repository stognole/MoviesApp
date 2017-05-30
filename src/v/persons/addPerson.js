/**
 * Created by Ole on 30.05.2017.
 */

pl.v.addPerson = {
    /**
     * necessary tasks for preparing the UI
     */
    setupUserInterface: function () {
        const inputForm = document.forms["personInput"];

        Person.retrieveAllData();

        // check field on input
        inputForm["pName"].addEventListener( "input", function () {
            inputForm["pName"].setCustomValidity(
                Person.checkName( inputForm["pName"].value ).message );
        } );

        inputForm["saveBtn"].addEventListener( "click", function () {
            pl.v.addPerson.handleSaveBtnClickEvent();
        } );

        // neutralize the submit event
        inputForm.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Person.saveAllData );
    },

    /**
     * handles click on save button
     */
    handleSaveBtnClickEvent: function () {
        const inputForm = document.forms["personInput"],
            newName = inputForm["pName"].value;

        const slots = {
            personId: inputForm["pID"].value,
            name: inputForm["pName"].value
        };

        inputForm["pName"].setCustomValidity(
            Person.checkName( slots.name ).message );

        if (inputForm.checkValidity()) {
            Person.add( slots );
            alert( "New person added:\n" +
                Person.instances[slots.personId].toString() );
            inputForm.reset();
        }
    }
};
