// import { db } from "../config";

export interface UserBankAccountAttributes {
    id: string;
    accountHolderName: string;
    accountHolderDOB: string;
    accountType: string;
    initialBalance: number;
    accountNumber: number;
}