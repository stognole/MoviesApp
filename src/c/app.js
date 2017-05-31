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
    Person.saveAllData();
    Movie.saveAllData();
  },

  retrieveAllData: function () {
    Person.retrieveAllData();
    Movie.retrieveAllData();
  },

  clearData: function () {
    try {
      Person.clearAllData();
      Movie.clearAllData();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }
  }
};