const bcrypt = require('bcrypt');
const axios = require('axios');
const Customer = require('../models/customerSchema.js');
const { createNewToken } = require('../utils/token.js');
const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient.js')
const jwt = require('jsonwebtoken');



const googleLoginCustomer = async (req, res) => {
    const { code, role } = req.body;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const userInfoResponse = await oauth2.userinfo.get();
        const { name, email, picture, id } = userInfoResponse.data;

        let user = await Customer.findOne({ email });

        // If new user, create one
        if (!user) {
            const hashedPassword = await bcrypt.hash(id, 10);

            const newUser = new Customer({
                name,
                email,
                password: hashedPassword,
                image: picture,
                role: role || 'Customer',
            });

            user = await newUser.save();
        }

        // Generate token
        const token = createNewToken(user._id);

        let result = await Customer.findOne({ email });
        // Remove password from returned data
        result.password = undefined;

        result = {
            ...result._doc,
            token: token
        }

        res.send(result);
    } catch (err) {
        console.error('Google login error:', err.message);
        res.status(500).json({ message: 'Google login failed' });
    }
};




// ------------------------------
// ✅ Register - Traditional Signup
// ------------------------------
const customerRegister = async (req, res) => {
    try {
        const existingcustomerByEmail = await Customer.findOne({ email: req.body.email });

        if (existingcustomerByEmail) {
            return res.send({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const customer = new Customer({
            ...req.body,
            password: hashedPass
        });

        let result = await customer.save();
        result.password = undefined;

        const token = createNewToken(result._id);

        result = {
            ...result._doc,
            token: token
        };

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ------------------------------
// ✅ Login - Traditional Login
// ------------------------------
const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });

        if (customer) {
            const validated = await bcrypt.compare(req.body.password, customer.password);

            if (validated) {
                customer.password = undefined;

                const token = createNewToken(customer._id);

                customer = {
                    ...customer._doc,
                    token: token
                };

                res.send(customer);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

// ------------------------------
// ✅ Cart - Get Cart Details
// ------------------------------
const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id);
        if (customer) {
            res.send(customer.cartDetails);
        } else {
            res.send({ message: "No customer found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// ------------------------------
// ✅ Cart - Update Cart
// ------------------------------
const cartUpdate = async (req, res) => {
    try {
        let customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.send(customer.cartDetails);
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
    googleLoginCustomer
};
