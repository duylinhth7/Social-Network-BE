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
exports.uploadFields = exports.uploadSingle = void 0;
const uploadToCloud_1 = require("../helpers/uploadToCloud");
const uploadSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req["file"]) {
        const link = yield (0, uploadToCloud_1.uploadToCloud)(req["file"].buffer);
        req.body[req["file"].fieldname] = link;
    }
    else {
    }
    next();
});
exports.uploadSingle = uploadSingle;
const uploadFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    for (const key in req["files"]) {
        const links = [];
        for (const item of req["files"][key]) {
            try {
                const link = yield (0, uploadToCloud_1.uploadToCloud)(item.buffer);
                links.push(link);
            }
            catch (error) {
                console.log(error);
            }
        }
        req.body[key] = links;
    }
    next();
});
exports.uploadFields = uploadFields;
