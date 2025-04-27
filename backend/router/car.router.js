import { Router } from "express";
import { addCar,getAllCars} from "../controllers/car.controller.js";



const router = Router();   


router.route('/addCar').post(addCar);
router.route('/allCars').get(getAllCars);


export default router;