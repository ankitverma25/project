import {User} from '../models/user.model.js'; 
import jwt from 'jsonwebtoken'; 




// Function to add a new user
const addUser = async (req, res) => {
            console.log(req.body);
            try {
                const user = new User(req.body);
                await user.save();
                res.status(200).json(user);
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//function to login a user
const login=(req, res) => {
    User.findOne(req.body).then((result)=>{
        if (result) {
            const {_id, username, email} = result;
            const payload = {
              _id,username,email  
             }

            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err)
                    } else {
                        res.status(200).json({ token, user: payload })
                    }
                }
            );            
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
            
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err)
    })



}




export {addUser,getAllUsers,login}