import { Router } from "express";
import { addUser,getAllUsers,login } from "../controllers/user.controller.js";


const router = Router();




router.route('/add').post(addUser);
router.route('/allusers').get(getAllUsers);
router.route('/login').post(login)



export default router;