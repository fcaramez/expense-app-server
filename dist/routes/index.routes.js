"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
router.get("/", (req, res, next) => {
    res.json("All is good in here");
});
router.post("/upload", fileUploader.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }
    res.json({ fileUrl: req.file.path });
}));
module.exports = router;
