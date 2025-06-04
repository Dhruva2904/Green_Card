import express from "express";

import authUser from "../middlewares/authUser.js";
import { updateCard } from "../controllers/cardController.js";


const cardRouter = express.Router();

cardRouter.post('/update', authUser, updateCard)

export default cardRouter