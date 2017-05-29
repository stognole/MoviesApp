/**
 * Created by Levin-Can on 06.05.2017.
 * Script for global create and delete operations
 */
"use strict";
/*
 var pl = {
 m: {},
 v: { addCountry:{}, deleteCountry: {}, retrieveAndListCountries: {},
 updateCountry: {}, internationalOrganisations: {}},
 c: { initialize: {}}
 };*/

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