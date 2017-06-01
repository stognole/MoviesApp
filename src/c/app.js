/**
 * Created by Ole on 30.05.2017.
 */
"use strict";

pl.c.app = {
  createTestData: function () {
    Person.createTestData();
    Movie.createTestData();
  },

  saveAllData: function () {
    Actor.saveAllData();
    Director.saveAllData();
    Person.saveAllData();
    Movie.saveAllData();
  },

  retrieveAllData: function () {
    Actor.retrieveAllData();
    Director.retrieveAllData();
    Person.retrieveAllData();
    Movie.retrieveAllData();
  },

  clearData: function () {
    try {
      Actor.clearAllData();
      Director.clearAllData();
      Person.clearAllData();
      Movie.clearAllData();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }
  }
};