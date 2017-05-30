/**
 * Created by Ole Stognief on 29.05.2017.
 */
"use strict";

/**
 * Class Person ##############################################################
 */

class Person {
    /**
     * constructor for a person object
     *
     * @throws ConstraintViolation error via setters
     */
    constructor( slots ) {


        if (arguments.length === 0) {
            // first, assign default values
            this.personId = 0; // [1], PositiveInteger {id}
            this.name = "n.a."; // [1], NonEmptyString
        } else {
            // if arguments were passed, set properties accordingly
            this.personId = slots.personId;
            this.name = slots._name ? slots._name : slots.name;
        }
    }


    /**
     * creates an new person object and adds it to the instances collection
     * @param slots
     */
    static add( slots ) {
        let person;
        try {
            person = new Person( slots );
        } catch (e) {
            console.log( e.constructor.name + ": " + e.message );
            person = null;
        }

        if (person) {
            Person.instances[person.personId] = person;
            console.log( "The person " + person.name + " has been added." );
        } else {
            console.log( "Error when adding person." );
        }
    }


    /**
     * retrieves all the persons saved in the LocalStorage and converts them
     * back to objects
     */
    static retrieveAllData() {
        console.log( "Person data retrieval entered." );

        let allPersonsString = "{}", allPersons, keys, i, slots;
        try {
            allPersonsString = localStorage.getItem( "persons" );
        } catch (e) {
            console.log( "Error when retrieving person data from " +
                "LocalStorage:\n" + e );
        }

        allPersons = JSON.parse( allPersonsString );
        if (allPersons) {
            keys = Object.keys( allPersons );

            // creates new person objects according to the data and adds them to
            // the instances collection
            for (i = 0; i < keys.length; i += 1) {
                slots = Person.convertRecToSlots( allPersons[keys[i]] );
                Person.add( slots );
            }
        } else {
            console.log( "No persons in storage." );
        }
    }

    /**
     * replaces the references in a person record with referenced objects
     * @param personRec
     * @returns {Object}
     */
    static convertRecToSlots( personRec ) {
        let personSlots = {};

        personSlots.personId = personRec.personId;
        personSlots.name = personRec._name ? personRec._name : personRec.name;

        return personSlots;
    }

    /**
     * the information for a person is updated according to the passed values
     */
    update( slots ) {
        let oldPerson = util.cloneObject( Person.instances[this.personId] );
        let newPerson;

        // to avoid UniquenessConstraintViolation
        this.destroy( slots.personId );

        try {
            newPerson = new Person( slots );
        } catch (e) {
            console.log( e.constructor.name + ": " + e.message );
        }

        // assures that a new person was successfully created and that we update
        // an existing person
        if (newPerson) {

            Person.instances[newPerson.personId] = newPerson;
            console.log( "Person " + newPerson.name + " updated. New data:\n" +
                newPerson.toString() );
        } else {
            Person.instances[oldPerson.personId] = oldPerson;
            console.log( "The person " + slots.name + " could not be created." );
        }
    }


    /**
     * deletes the person from the instances collection
     */
    destroy() {
        let personName = this.name;
        let personId = this.personId;

        delete Person.instances[personId];

        console.log( "Person " + personName + " deleted." );

    }


    /**
     * writes all data from Person.instances to the LocalStorage
     */
    static saveAllData() {
        let allPersonsString, error = false, allPersons = {}, keys, i;

        keys = Object.keys( Person.instances );

        for (i = 0; i < keys.length; i += 1) {

            allPersons[keys[i]] = Person.instances[keys[i]].convertObjToRec();
        }


        try {
            allPersonsString = JSON.stringify( allPersons );
            localStorage.setItem( "persons", allPersonsString );
        }
        catch
            (e) {
            alert( "Person data could not be saved!\n" + e );
            error = true;
        }

        if (error) {
            console.log( "Error when saving person data!" );
        } else {
            console.log( "Data saved: " + localStorage.getItem( "persons" ) );
        }
    }

    /**
     * replaces all the objects in a person object with reference values and
     * returns the resulting object
     *
     * @returns {Object}
     */
    convertObjToRec() {
        let personRow = util.cloneObject( this ), keys, i;
        console.log( "test" );

        return personRow;
    }

    /**
     * adds some persons to the app so functionality can be tested
     */
    static createTestData() {
        // errors don't need to be caught here, they are handled in the add method
        let temp = {
            _name: "Germany"
        };
        Person.add( temp );

        Person.saveAllData();
    }


    /**
     * clears all person data in the localStorage and instead sets an empty
     * object string
     */
    static clearAllData() {
        let i, keys;
        if (confirm( "Do you want to clear all person data?" )) {
            keys = Object.keys( Person.instances );
            for (i = 0; i < keys.length; i += 1) {
                // use destroy method to properly handle all references
                Person.instances[keys[i]].destroy();
            }

            // hard reset instances
            Person.instances = {};
            localStorage.setItem( "persons", "{}" );
            console.log( "Database cleared." );
        }
    }


    toString() {
        let str = "Person: " + this.name;
        let i, keys;

        return str;
    }


    /**
     * #########################################################################
     * CONSTRAINT CHECKS & SETTERS
     * #########################################################################
     */

    static checkPersonIdAsId( personId ) {
        let constraintViolation = Person.checkName( personId );

        // continue testing only if previous test successful
        if (constraintViolation instanceof NoConstraintViolation) {
            if (!personId) {
                constraintViolation = new MandatoryValueConstraintViolation(
                    "A person" + " always needs to have an id.", personId );
            } else if (Person.instances[personId]) {
                constraintViolation = new UniquenessConstraintViolation(
                    "A person's id has to be unique.", personId );
            }
        }
        return constraintViolation;
    }

    static checkName( myName ) {
        if (myName) {
            if (!util.isNonEmptyString( myName )) {
                return new RangeConstraintViolation( "A person's name must be" +
                    " a non-empty string.", myName );
            }
        }
        return new NoConstraintViolation( myName );

    }

    set name( newName ) {
        const validationResult = Person.checkName( newName );

        if (validationResult instanceof NoConstraintViolation) {
            this._name = newName; // only valid values should enter the database
        } else {
            alert( validationResult.message );
            throw validationResult;
        }
    }

    get name() {
        return this._name;
    }

}

Person.instances = {};