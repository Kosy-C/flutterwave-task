"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/create-account', userController_1.createBankAcc);
router.get('/account/:accountNumber', userController_1.getSingleAccount);
router.get('/accounts', userController_1.allAccounts);
exports.default = router;
