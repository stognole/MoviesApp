/**
 * Created by Ole on 30.05.2017.
 */
"use strict";
pl.v.updateMovie = {
    setupUserInterface: function () {
        const formObj = document.forms["movieUpdate"],
            selMovie = document.getElementById( "selTitle" ),
            selectDirector = formObj["mDirector"],
            selectActors = formObj["mActors"];

        pl.c.app.retrieveAllData();

        util.fillSelectWithOptions( Movie.instances, selMovie,
            "movieId", "title" );

        util.fillSelectWithOptions( Person.instances, selectDirector,
            "personId", "name" );

        util.fillSelectWithOptions( Person.instances, selectActors,
            "personId", "name" );


        // check fields on input
        formObj["mTitle"].addEventListener( "input", function () {
            formObj["mTitle"].setCustomValidity(
                Movie.checkTitle( formObj["mTitle"].value ).message );
        } );

        // neutralize the submit event
        formObj.addEventListener( "submit", function ( e ) {
            e.preventDefault();
        } );

        // after every new change of selection, form needs to change
        // -> listener needed
        selMovie.addEventListener( "change",
            pl.v.updateMovie.handleMovieSelectEvent );

        // save new movie data
        document.getElementById( "saveBtn" ).addEventListener( "click",
            pl.v.updateMovie.handleSaveBtnClickEvent );

        // save all data when window/tab is closed
        window.addEventListener( "beforeunload", Movie.saveAllData );
    },


    /**
     * updates the values in the input/output fields
     */
    handleMovieSelectEvent: function () {
        const formObj = document.forms["movieUpdate"];
        const selectedMovie = document.getElementById( "selTitle" ).value;
        const movie = Movie.instances[selectedMovie];

        formObj.reset();

        if (movie) {
            document.getElementById( "mID" ).value = movie.movieId;
            document.getElementById( "mTitle" ).value = movie.title;
            document.getElementById( "mReleaseDate" ).value = movie.releaseDate;
            console.log(movie.director.personId);
            document.getElementById( "mDirector" ).value
                = movie.director.personId;

            ["mID", "mTitle", "mReleaseDate", "mDirector"].forEach(
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
        const formObj = document.forms["movieUpdate"];

        slots.movieId = document.getElementById( "mID" ).value;
        slots.title = document.getElementById( "mTitle" ).value;


        // confirm update with user
        let outputStr = "New values:\n\tTitle: " + slots.title;

        userConfirmed = confirm( outputStr + "\nPlease confirm." );

        // formObj.checkValidity() cannot be used: Unique values throw errors
        // since they are already in the database during input. However, the
        // values are still tested in the update method,
        // so validity is still granted.
        if (userConfirmed) {
            Movie.instances[slots.movieId].update( slots );
            formObj.reset();
        } else {
            console.log( "Update failed" );
        }

    }

};