/**
 * Created by Ole on 01.06.2017.
 */

pl.v.addDirector = {
    /**
     * necessary tasks for preparing the UI
     */
    setupUserInterface: function () {
        const inputForm = document.forms["personInput"];

        Director.retrieveAllData();

        // check field on input
        inputForm["pName"].addEventListener( "input", function () {
            inputForm["pName"].setCustomValidity(
                Director.checkName( inputForm["pName"].value ).message );
        } );

        inputForm["saveBtn"].addEventListener( "click", function () {
            pl.v.addDirector.handleSaveBtnClickEvent();
        } );

        // neutralize the submit event
        inputForm.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Director.saveAllData );
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
            Director.checkName( slots.name ).message );

        if (inputForm.checkValidity()) {
            Director.add( slots );
            alert( "New director added:\n" +
                Director.instances[slots.personId].toString() );
            inputForm.reset();
        }
    }
};