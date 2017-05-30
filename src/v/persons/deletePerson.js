/**
 * Created by Ole on 30.05.2017.
 */
pl.v.deletePerson = {
    /**
     * prepare UI for usage
     */
    setupUserInterface: function () {
        let selPerson, deleteBtn;

        selPerson = document.getElementById( "selectPerson" );
        deleteBtn = document.getElementById( "deleteBtn" );

        pl.c.app.retrieveAllData();
        util.fillSelectWithOptions( Person.instances, selPerson, "personId", "name" );

        deleteBtn.addEventListener( "click",
            pl.v.deletePerson.handleDeleteBtnClickEvent );

    },

    /**
     * handle click on delete button
     */
    handleDeleteBtnClickEvent: function () {
        let select, valuesChecked;

        select = document.getElementById( "selectPerson" );

        // confirm delete with user
        valuesChecked = confirm( Person.instances[select.value].toString() +
            "\nDo you wish to delete this entry?" );
        if (valuesChecked) {
            Person.instances[select.value].destroy();
            select.remove( select.selectedIndex );
        }
        pl.c.app.saveAllData();
    }
};