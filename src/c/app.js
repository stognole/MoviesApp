/**
 * Created by Ole on 30.05.2017.
 */
"use strict";

pl.c.app = {
  createTestData: function () {
    Person.createTestData();
  },

  saveAllData: function () {
    Person.saveAllData();
  },

  retrieveAllData: function () {
    Person.retrieveAllData();
  },

  clearData: function () {
    try {
      Person.clearAllData();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }
  }
};