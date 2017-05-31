/**
 * Created by Ole on 30.05.2017.
 */
pl.v.deleteMovie = {
    /**
     * prepare UI for usage
     */
    setupUserInterface: function () {
        let selMovie, deleteBtn;

        selMovie = document.getElementById( "selectMovie" );
        deleteBtn = document.getElementById( "deleteBtn" );

        pl.c.app.retrieveAllData();
        util.fillSelectWithOptions( Movie.instances, selMovie, "movieId", "title" );

        deleteBtn.addEventListener( "click",
            pl.v.deleteMovie.handleDeleteBtnClickEvent );

    },

    /**
     * handle click on delete button
     */
    handleDeleteBtnClickEvent: function () {
        let select, valuesChecked;

        select = document.getElementById( "selectMovie" );

        // confirm delete with user
        valuesChecked = confirm( Movie.instances[select.value].toString() +
            "\nDo you wish to delete this entry?" );
        if (valuesChecked) {
            Movie.instances[select.value].destroy();
            select.remove( select.selectedIndex );
        }
        pl.c.app.saveAllData();
    }
};