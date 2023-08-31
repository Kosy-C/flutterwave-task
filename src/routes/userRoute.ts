import express from "express";
import { allAccounts, createBankAcc, getSingleAccount } from "../controller/userController";

const router = express.Router();

router.post('/create-account', createBankAcc);
router.get('/account/:accountNumber', getSingleAccount);
router.get('/accounts', allAccounts);

export default router;