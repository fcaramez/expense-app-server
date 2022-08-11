import IUserModel from "../custom";
import { Router } from "express";
import { Model } from "mongoose";
const router: Router = require("express").Router();
const User: Model<IUserModel> = require("../models/User.model");



module.exports = router;
