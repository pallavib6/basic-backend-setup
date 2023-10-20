const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
})

//SIGNUP USER
router.post("/register", async (req, res) => {
    //CONDITION TO CHECK IF USER EMAIL IS ALREADY EXISTS
    const emailExist = await User.findOne({ email: req.body.email });

    //IF EMAIL EXIST THEN RETURN
    if (emailExist) {
        res.status(400).send("Email already exists");
        return;
    }

    //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        //PERFORMING VALIDATION OF USER INPUTS

        const { error } = await registerSchema.validateAsync(req.body);

        //WE CAN JUST GET THE ERROR(IF EXISTS) WITH OBJECT DECONSTRUCTION

        //IF ERROR EXISTS THEN SEND BACK THE ERROR

        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            //NEW USER IS ADDED

            const saveUser = await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            const response = {
                status: 200,
                message: "Success : User Created",
                accessToken: token
            }
            res.status(200).send(response);
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;