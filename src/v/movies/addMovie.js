/**
 * Created by Ole on 30.05.2017.
 */
pl.v.addMovie = {
    /**
     * necessary tasks for preparing the UI
     */
    setupUserInterface: function () {
        const inputForm = document.forms["movieInput"];

        Movie.retrieveAllData();

        // check field on input
        inputForm["mTitle"].addEventListener( "input", function () {
            inputForm["mTitle"].setCustomValidity(
                Movie.checkTitle( inputForm["mTitle"].value ).message );
        } );

        inputForm["saveBtn"].addEventListener( "click", function () {
            pl.v.addMovie.handleSaveBtnClickEvent();
        } );

        // neutralize the submit event
        inputForm.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Movie.saveAllData );
    },

    /**
     * handles click on save button
     */
    handleSaveBtnClickEvent: function () {
        const inputForm = document.forms["movieInput"];

        const slots = {
            movieId: inputForm["mID"].value,
            title: inputForm["mTitle"].value
        };

        inputForm["mTitle"].setCustomValidity(
            Movie.checkTitle( slots.title ).message );

        if (inputForm.checkValidity()) {
            Movie.add( slots );
            alert( "New movie added:\n" +
                Movie.instances[slots.movieId].toString() );
            inputForm.reset();
        }
    }
};
