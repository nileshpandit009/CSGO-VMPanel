/* VMP-by-Summer-Soldier
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of VMP-by-Summer-Soldier
*
* VMP-by-Summer-Soldier is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* VMP-by-Summer-Soldier is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* VMP-by-Summer-Soldier. If not, see http://www.gnu.org/licenses/.
*/

"use strict";
const userModel = require("../models/userModel.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) { throw "Unauthorized Access, You are not a Super Admin" }
    req.body.secKey = req.session.sec_key
    let result = await addPanelAdminFunc(req.body, req.session.username);
    res.json({
      success: true,
      data: { "res": result, "message": req.body.submit == "insert" ? "New Admin added Successfully" : "Admin Updated Successfully", "notifType": "success" }
    });
  } catch (error) {
    console.log("error in addPanelAdmin->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const addPanelAdminFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {

          //validations
          if (!reqBody.username) return reject("Operation Fail!, Username Missing");
          if (!reqBody.password) return reject("Operation Fail!, Password Missing");

          let insertRes = await userModel.insertNewUser(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        } else if (reqBody.submit === "update") {

          //validations
          if (!reqBody.username) return reject("Operation Fail!, Username Missing");
          if (!reqBody.newpassword) return reject("Operation Fail!, Password Missing");

          let updateRes = await userModel.updateUserpassword({
            "id": reqBody.username.split(':')[0],
            "username": reqBody.username.split(':')[1],
            "password": reqBody.newpassword
          })
          if (updateRes) {
            resolve(updateRes)
          }
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      console.log("error in addPanelAdminFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

exports.addPanelAdminFunc = addPanelAdminFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelAdminsList = async (req, res) => {
  try {
    if (req.session.user_type === 0) { throw "Unauthorized Access, You are not a Super Admin" }
    req.body.secKey = req.session.sec_key
    let result = await getPanelAdminsListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Admin List Fetched" }
    });
  } catch (error) {
    console.log("error in getPanelAdminsList->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelAdminsListFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getListOfAdmins()
      if (userData) {
        resolve(userData)
      }
    } catch (error) {
      console.log("error in getPanelAdminsListFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

exports.getPanelAdminsListFunc = getPanelAdminsListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) { throw "Unauthorized Access, You are not a Super Admin" }
    req.body.secKey = req.session.sec_key
    let result = await deletePanelAdminFunc(req.body, req.session.username);
    res.json({
      success: true,
      data: { "res": result, "message": "Admin Deleted Successfully", "notifType": "success" }
    });
  } catch (error) {
    console.log("error in deletePanelAdmin->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deletePanelAdminFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (reqBody.username.split(':')[1] == username) {
        reject("Did u really tried to delete yourself ?");
      } else {

        //validations
        if (!reqBody.username) return reject("Operation Fail!, Username Missing");

        let userData = await userModel.getuserDataByUsername(username)

        if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
          if (reqBody.submit === "delete") {
            let insertRes = await userModel.deleteUser({
              "id": reqBody.username.split(':')[0],
              "username": reqBody.username.split(':')[1],
            })
            if (insertRes) {
              resolve(insertRes)
            }
          }
        } else {
          reject("Unauthorized Access, Key Missing")
        }
      }
    } catch (error) {
      console.log("error in deletePanelAdminFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

exports.deletePanelAdminFunc = deletePanelAdminFunc;