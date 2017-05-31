/**
 * Created by Ole on 30.05.2017.
 */
"use strict";

/**
 * Class Movie ##############################################################
 */

class Movie {
    /**
     * constructor for a movie object
     *
     * @throws ConstraintViolation error via setters
     */
    constructor( slots ) {


        if (arguments.length === 0) {
            // first, assign default values
            this.movieId = 0; // [1], PositiveInteger {id}
            this.title = "n.a."; // [1], NonEmptyString
            this.releaseDate = "1990-06-27";
            this.director = new Person("1");
            this.actors = {};
        } else {
            // if arguments were passed, set properties accordingly
            this.movieId = slots.movieId;
            this.title = slots._title ? slots._title : slots.title;
            this.releaseDate = slots.releaseDate;
            this.director = slots._director ? slots._director : slots.director;
            this.actors = {};

            // [1..*] map, always contains capital
            if (slots.actors || slots._actors) {
                this.actors = slots._actors ? slots._actors : slots.actors;
            }
        }
    }


    /**
     * creates a new movie object and adds it to the instances collection
     * @param slots
     */
    static add( slots ) {
        let movie;
        try {
            movie = new Movie( slots );
        } catch (e) {
            console.log( e.constructor.title + ": " + e.message );
            movie = null;
        }

        if (movie) {
            Movie.instances[movie.movieId] = movie;
            console.log( "The movie " + movie.title + " has been added." );
        } else {
            console.log( "Error when adding movie." );
        }
    }


    /**
     * retrieves all the movies saved in the LocalStorage and converts them
     * back to objects
     */
    static retrieveAllData() {
        console.log( "Movie data retrieval entered." );

        let allMoviesString = "{}", allMovies, keys, i, slots;
        try {
            allMoviesString = localStorage.getItem( "movies" );
        } catch (e) {
            console.log( "Error when retrieving movie data from " +
                "LocalStorage:\n" + e );
        }

        allMovies = JSON.parse( allMoviesString );
        if (allMovies) {
            keys = Object.keys( allMovies );

            // creates new movie objects according to the data and adds them to
            // the instances collection
            for (i = 0; i < keys.length; i += 1) {
                slots = Movie.convertRecToSlots( allMovies[keys[i]] );
                Movie.add( slots );
            }
        } else {
            console.log( "No movies in storage." );
        }
    }

    /**
     * replaces the references in a movie record with referenced objects
     * @param movieRec
     * @returns {Object}
     */
    static convertRecToSlots( movieRec ) {
        let movieSlots = {};

        movieSlots.movieId = movieRec.movieId;
        movieSlots.title = movieRec._title ? movieRec._title : movieRec.title;
        movieSlots.releaseDate = movieRec.releaseDate;

        // replace director actor reference with object
        movieSlots.director = Person.instances[movieRec.directorRef];

        // convert the actors map from references to objects
        if (movieRec.actorRefs) {
            let tempActors = {};
            for (let i = 0; i < movieRec.actorRefs.length; i += 1) {
                tempActors[movieRec.actorRefs[i]] =
                    Person.instances[movieRec.actorRefs[i]];
            }
            movieSlots.actors = tempActors;
        }

        return movieSlots;
    }

    /**
     * the information for a movie is updated according to the passed values
     */
    update( slots ) {
        let oldMovie = util.cloneObject( Movie.instances[this.movieId] );
        let newMovie;

        // to avoid UniquenessConstraintViolation
        this.destroy( slots.movieId );

        try {
            newMovie = new Movie( slots );
        } catch (e) {
            console.log( e.constructor.title + ": " + e.message );
        }

        // assures that a new movie was successfully created and that we update
        // an existing movie
        if (newMovie) {

            Movie.instances[newMovie.movieId] = newMovie;
            console.log( "Movie " + newMovie.title + " updated. New data:\n" +
                newMovie.toString() );
        } else {
            Movie.instances[oldMovie.movieId] = oldMovie;
            console.log( "The movie " + slots.title + " could not be created." );
        }
    }


    /**
     * deletes the movie from the instances collection
     */
    destroy() {
        let movieTitle = this.title;
        let movieId = this.movieId;

        delete Movie.instances[movieId];

        console.log( "Movie " + movieTitle + " deleted." );

    }


    /**
     * writes all data from Movie.instances to the LocalStorage
     */
    static saveAllData() {
        let allMoviesString, error = false, allMovies = {}, keys, i;

        keys = Object.keys( Movie.instances );

        for (i = 0; i < keys.length; i += 1) {

            allMovies[keys[i]] = Movie.instances[keys[i]].convertObjToRec();
        }


        try {
            allMoviesString = JSON.stringify( allMovies );
            localStorage.setItem( "movies", allMoviesString );
        }
        catch
            (e) {
            alert( "Movie data could not be saved!\n" + e );
            error = true;
        }

        if (error) {
            console.log( "Error when saving movie data!" );
        } else {
            console.log( "Data saved: " + localStorage.getItem( "movies" ) );
        }
    }

    /**
     * replaces all the objects in a movie object with reference values and
     * returns the resulting object
     *
     * @returns {Object}
     */
    convertObjToRec() {
        let movieRow = util.cloneObject( this ), keys, i;

        movieRow.directorRef = this._director.personId;

        if (this._actors) {
            movieRow.actorRefs = [];
            keys = Object.keys( this._actors );

            for (i = 0; i < keys.length; i += 1) {
                movieRow.actorRefs.push( keys[i] );
            }
        }

        delete movieRow.director;
        delete movieRow._director;
        delete movieRow.actors;
        delete movieRow._actors;

        return movieRow;
    }

    /**
     * adds some movies to the app so functionality can be tested
     */
    static createTestData() {
        // errors don't need to be caught here, they are handled in the add method
        let temp = {
            movieId: 1,
            _title: "Germany",
            releaseDate: "1990-02-12",
            director: Person.instances[1],
            actors: {
                "1": Person.instances["1"],
                "2": Person.instances["2"]
            }
        };
        Movie.add( temp );

        Movie.saveAllData();
    }


    /**
     * clears all movie data in the localStorage and instead sets an empty
     * object string
     */
    static clearAllData() {
        let i, keys;
        if (confirm( "Do you want to clear all movie data?" )) {
            keys = Object.keys( Movie.instances );
            for (i = 0; i < keys.length; i += 1) {
                // use destroy method to properly handle all references
                Movie.instances[keys[i]].destroy();
            }

            // hard reset instances
            Movie.instances = {};
            localStorage.setItem( "movies", "{}" );
            console.log( "Database cleared." );
        }
    }


    toString() {
        let str = "Movie: " + this.title;
        let i, keys;

        return str;
    }


    /**
     * #########################################################################
     * CONSTRAINT CHECKS & SETTERS
     * #########################################################################
     */

    static checkMovieIdAsId( movieId ) {
        let constraintViolation = Movie.checkMovieId( movieId );

        // continue testing only if previous test successful
        if (constraintViolation instanceof NoConstraintViolation) {
            if (!movieId) {
                constraintViolation = new MandatoryValueConstraintViolation(
                    "A movie" + " always needs to have an id.", movieId );
            } else if (Movie.instances[movieId]) {
                constraintViolation = new UniquenessConstraintViolation(
                    "A movie's id has to be unique.", movieId );
            }
        }
        return constraintViolation;
    }

    static checkTitle( myTitle ) {
        if (myTitle) {
            if (!util.isNonEmptyString( myTitle )) {
                return new RangeConstraintViolation( "A movie's title must be" +
                    " a non-empty string.", myTitle );
            }
        }
        return new NoConstraintViolation( myTitle );

    }

    set title( newTitle ) {
        const validationResult = Movie.checkTitle( newTitle );

        if (validationResult instanceof NoConstraintViolation) {
            this._title = newTitle; // only valid values should enter the database
        } else {
            alert( validationResult.message );
            throw validationResult;
        }
    }

    get title() {
        return this._title;
    }


    static checkDirector( myDirector ) {
        let i, keys, values,
            constraintViolation = new NoConstraintViolation( myDirector );

        // mandatory
        if (!myDirector) {
            console.log( myDirector );
            constraintViolation = new MandatoryValueConstraintViolation(
                "A movie always needs to have a director. ", myDirector );
        } else {
        }
        return constraintViolation;
    }
    
    set director( newDirector ) {
        const validationResult = Movie.checkDirector( newDirector );

        // only valid values should enter the database
        if (validationResult instanceof NoConstraintViolation) {
            this._director = newDirector;
        } else {
            console.log( this );
            alert( validationResult.message );
            throw validationResult;
        }
    }

    get director() {
        return this._director;
    }

    set actors( newActors ) {
        const validationResult = Movie.checkActors( newActors );
        // only valid values should enter the database
        if (validationResult instanceof NoConstraintViolation) {
            this._actors = newActors;

        } else {
            alert( validationResult.message );
            throw validationResult;
        }
    }

    get actors() {
        return this._actors;
    }

    /**
     * adds a actor to this movie's actors map
     * @param actor - can be id (name) oder object
     */
    addActor( actor ) {
        let actorName;
        if (actor instanceof Object) {
            actorName = actor.name;
        } else {
            actorName = actor;
        }
        this.actors[actorName] = Person.instances[actorName];
    }

    /**
     *
     * @param {Object} myActors - map of actors
     * @returns {*}
     */
    static checkActors( myActors ) {
        let i, keysActors;
        let constraintViolation = new NoConstraintViolation( myActors );
        if (myActors) {

            // known actors only
            //keysActors = Object.keys( myActors );

            //for (i = 0; i < keysActors; i += 1) {
            //    constraintViolation =
            //        Person.checkPersonIdAsRefId( keysActors[i] );
            //}
        }
        return constraintViolation;
    }

}

Movie.instances = {};