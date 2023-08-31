import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { GenerateAccountNumber, UserSchema, option } from "../utils/utility";
import { UserBankAccountAttributes } from "../model/userModel";

import fs from "fs";
import path from "path";

let bankDetails: UserBankAccountAttributes[] = [];

const dataFile = path.join(__dirname, '../config/db.json');

// read the data from the data.json file and parse it as JSON
async function ReadBankAccounts() {
    try {
        const data = fs.readFileSync(dataFile, 'utf-8');
        bankDetails = JSON.parse(data);
    } catch (err) {
        console.error(`Error reading data file: ${err}`);
    }
};
ReadBankAccounts();

export const createBankAcc = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {
            accountHolderName,
            accountHolderDOB,
            accountType,
            initialBalance 
        } = req.body;
        const uuidUser = uuidv4();
        
        const validateResult = UserSchema.validate(req.body, option);
        if(validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        };
        const accountNumber = GenerateAccountNumber();
        // const accountNumber = 1926539391;

        //check if accountNumber already exists
        const existingAccountNumber = bankDetails.find(bankDetail => bankDetail.accountNumber === accountNumber )
        if(existingAccountNumber) {
            return res.status(400).json({
                error: "User with the given accountNumber already exists",
            });
        } else {
        const newUserAccount:UserBankAccountAttributes  = {
            id: uuidUser,
            accountHolderName,
            accountHolderDOB,
            accountType,
            initialBalance,
            accountNumber
        }
        bankDetails.push(newUserAccount);
        // save the updated data array to the file
        fs.writeFileSync(dataFile, JSON.stringify(bankDetails, null, 2));
        

        return res.status(201).json({
            accountNumber,
            message: `Account has been created for ${accountHolderName} with account type: ${accountType} and initial balance: ${initialBalance}.`
        });
        }
    } catch(err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/create-account"
        });
    }
};

export const getSingleAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountNumber } = req.params;

        const account = bankDetails.find(bankDetail => bankDetail.accountNumber.toString() === accountNumber);

        if (account) {
            return res.status(200).json({
                message: "Account retrieved successfully",
                bankDetails: account
            });
        } else {
            return res.status(404).json({
                Error: "Account not found!"
            });
        }
    }catch(err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/account/:accountNumber"
        });
    }
};

export const allAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try{
        return res.status(200).json({
            message: "All accounts retrieved successfully",
            bankDetails
        })
    }catch(err){
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/accounts"
        });
    }
};