const router = require("express").Router();
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const bcrypt = require("bcryptjs");

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
})

//LOGIN USER

router.post("/login", async (req, res) => {
    //CHECKING IF EMAIL ALREAY EXISTS
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Incorrect Email- ID");

    //CHECKING IF USER PASSWORD MATCHES
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Incorrect Password");

    try {
        // VALIDATION OF USER INPUTS
        const { error } = await loginSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        else {
            // res.send("Success");
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            const response = {
                status: 200,
                message: "Success",
                accessToken: token
            }
            res.header("auth-token", token).send(response);
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router