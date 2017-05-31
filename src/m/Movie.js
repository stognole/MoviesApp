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
        } else {
            // if arguments were passed, set properties accordingly
            this.movieId = slots.movieId;
            this.title = slots._title ? slots._title : slots.title;
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
        console.log( "test" );

        return movieRow;
    }

    /**
     * adds some movies to the app so functionality can be tested
     */
    static createTestData() {
        // errors don't need to be caught here, they are handled in the add method
        let temp = {
            movieId: 1,
            _title: "Germany"
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

}

Movie.instances = {};