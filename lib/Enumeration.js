/**
 * Predefined class for creating enumerations as special JS objects.
 * An enumeration can be specified in two ways: by a list of labels,
 * or by a map of code/label pairs.
 *
 * @copyright Copyright (c) 2014 Gerd Wagner, Chair of Internet Technology,
 *   Brandenburg University of Technology, Germany.
 * @license The MIT License (MIT)
 * @author Gerd Wagner (small adaptions following quality suggestions by Lea
 *                          Weber)
 * @constructor
 * @param enumArg The labels of the new enumeration literals.
 */
"use strict";
function Enumeration( enumArg ) {
  let i, lbl = "", LBL = "";

  if (Array.isArray( enumArg )) {
    // a simple enum defined by a list of labels
    if (!enumArg.every( function ( n ) {
        return (typeof(n) === "string");
      } )) {
      throw new OtherConstraintViolation(
        "A list of enumeration labels must be an array of strings!" );
    }

    this.labels = enumArg;
    this.enumLitNames = enumArg.slice();
    this.codeList = null;

  } else if (typeof(enumArg) === "object" &&
    Object.keys( enumArg ).length > 0) {

    // a code list defined by a map
    if (!Object.keys( enumArg ).every( function ( code ) {
        return (typeof( enumArg[code]) === "string");
      } )) {
      throw new OtherConstraintViolation(
        "All values of a code list map must be strings!" );
    }
    this.codeList = enumArg;

    // use the codes as the names of enumeration literals
    this.enumLitNames = Object.keys( this.codeList );
    this.labels = this.enumLitNames.map( function ( c ) {
      return enumArg[c] + " (" + c + ")";
    } );

  } else {
    throw new OtherConstraintViolation(
      "Invalid Enumeration constructor argument: " + enumArg );
  }
  this.MAX = this.enumLitNames.length;

  // generate the enumeration literals by capitalizing/normalizing the names
  for (i = 0; i < this.enumLitNames.length; i += 1) {
    // replace " " and "-" with "_"
    lbl = this.enumLitNames[i].replace( /( |-)/g, "_" );

    // convert to array of words, capitalize them, and re-convert
    LBL = lbl.split( "_" ).map( function ( lblPart ) {
      return lblPart.toUpperCase();
    } ).join( "_" );

    // assign enumeration index
    this[LBL] = i;
  }

  Object.freeze( this );
}

///*
// * Serialize a list of enumeration literals/indexes as a list of
// * enumeration literal names
// */
//Enumeration.prototype.convertEnumIndexes2Names = function (a) {
//  var listStr = a.map( function (enumInt) {
//    return this.enumLitNames[enumInt-1];}, this).join(", ");
//  return listStr;
//}