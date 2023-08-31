"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAccounts = exports.getSingleAccount = exports.createBankAcc = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let bankDetails = [];
const dataFile = path_1.default.join(__dirname, '../config/db.json');
// read the data from the data.json file and parse it as JSON
async function ReadBankAccounts() {
    try {
        const data = fs_1.default.readFileSync(dataFile, 'utf-8');
        bankDetails = JSON.parse(data);
    }
    catch (err) {
        console.error(`Error reading data file: ${err}`);
    }
}
;
ReadBankAccounts();
const createBankAcc = async (req, res, next) => {
    try {
        const { accountHolderName, accountHolderDOB, accountType, initialBalance } = req.body;
        const uuidUser = (0, uuid_1.v4)();
        const validateResult = utility_1.UserSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        ;
        const accountNumber = (0, utility_1.GenerateAccountNumber)();
        // const accountNumber = 1926539391;
        //check if accountNumber already exists
        const existingAccountNumber = bankDetails.find(bankDetail => bankDetail.accountNumber === accountNumber);
        if (existingAccountNumber) {
            return res.status(400).json({
                error: "User with the given accountNumber already exists",
            });
        }
        else {
            const newUserAccount = {
                id: uuidUser,
                accountHolderName,
                accountHolderDOB,
                accountType,
                initialBalance,
                accountNumber
            };
            bankDetails.push(newUserAccount);
            // save the updated data array to the file
            fs_1.default.writeFileSync(dataFile, JSON.stringify(bankDetails, null, 2));
            return res.status(201).json({
                accountNumber,
                message: `Account has been created for ${accountHolderName} with account type: ${accountType} and initial balance: ${initialBalance}.`
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/create-account"
        });
    }
};
exports.createBankAcc = createBankAcc;
const getSingleAccount = async (req, res, next) => {
    try {
        const { accountNumber } = req.params;
        const account = bankDetails.find(bankDetail => bankDetail.accountNumber.toString() === accountNumber);
        if (account) {
            return res.status(200).json({
                message: "Account retrieved successfully",
                bankDetails: account
            });
        }
        else {
            return res.status(404).json({
                Error: "Account not found!"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/account/:accountNumber"
        });
    }
};
exports.getSingleAccount = getSingleAccount;
const allAccounts = async (req, res, next) => {
    try {
        return res.status(200).json({
            message: "All accounts retrieved successfully",
            bankDetails
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/accounts"
        });
    }
};
exports.allAccounts = allAccounts;
