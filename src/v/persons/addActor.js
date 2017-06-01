/**
 * Created by Ole on 01.06.2017.
 */

pl.v.addActor = {
    /**
     * necessary tasks for preparing the UI
     */
    setupUserInterface: function () {
        const inputForm = document.forms["personInput"],
            selectAgent = inputForm["aAgent"];

        Actor.retrieveAllData();

        // check field on input
        inputForm["pName"].addEventListener( "input", function () {
            inputForm["pName"].setCustomValidity(
                Actor.checkName( inputForm["pName"].value ).message );
        } );

        util.fillSelectWithOptions( Person.instances, selectAgent,
            "personId", "name" );


        inputForm["saveBtn"].addEventListener( "click", function () {
            pl.v.addActor.handleSaveBtnClickEvent();
        } );

        // neutralize the submit event
        inputForm.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Actor.saveAllData );
    },

    /**
     * handles click on save button
     */
    handleSaveBtnClickEvent: function () {
        const inputForm = document.forms["personInput"];

        const slots = {
            personId: inputForm["pID"].value,
            name: inputForm["pName"].value,
            agent: inputForm["aAgent"].value
        };

        inputForm["pName"].setCustomValidity(
            Actor.checkName( slots.name ).message );

        if (inputForm.checkValidity()) {
            Actor.add( slots );
            alert( "New actor added:\n" +
                Actor.instances[slots.personId].toString() );
            inputForm.reset();
        }
    }
};