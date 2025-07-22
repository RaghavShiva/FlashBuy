const axios = require('axios');
const bcrypt = require('bcrypt');
const Seller = require('../models/sellerSchema.js');
const { createNewToken } = require('../utils/token.js');
const oauth2Client = require('../utils/googleClient.js')
const { google } = require('googleapis');


// ✅ Updated Google Login for Seller with sub as password
const googleLoginSeller = async (req, res) => {
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
        let user = await Seller.findOne({ email }); // ✅ Fix model reference

        // If new seller, create with null shopName
        if (!user) {
            const hashedPassword = await bcrypt.hash(id, 10);

            const newUser = new Seller({
                name,
                email,
                password: hashedPassword,
                image: picture,
                role,
                shopName: null, // ✅ add explicitly
            });

            user = await newUser.save();
        }

        const token = createNewToken(user._id);
        user.password = undefined;

        res.send({
            ...user._doc,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Google login failed', error: err.message });
    }
};

const sellerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const seller = new Seller({
            ...req.body,
            password: hashedPass
        });

        const existingSellerByEmail = await Seller.findOne({ email: req.body.email });
        const existingShop = await Seller.findOne({ shopName: req.body.shopName });

        if (existingSellerByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingShop) {
            res.send({ message: 'Shop name already exists' });
        }
        else {
            let result = await seller.save();
            result.password = undefined;

            const token = createNewToken(result._id);

            result = {
                ...result._doc,
                token: token
            };

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const sellerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let seller = await Seller.findOne({ email: req.body.email });
        if (seller) {
            const validated = await bcrypt.compare(req.body.password, seller.password);
            if (validated) {
                seller.password = undefined;

                const token = createNewToken(seller._id);

                seller = {
                    ...seller._doc,
                    token: token
                };

                res.send(seller);
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

const updateSellerProfile = async (req, res) => {
    try {
        const { email, shopName } = req.body;

        const updatedSeller = await Seller.findOneAndUpdate(
            { email },
            { shopName },
            { new: true }
        );

        if (!updatedSeller) {
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }

        res.status(200).json({ success: true, seller: updatedSeller });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { sellerRegister, sellerLogIn, googleLoginSeller, updateSellerProfile };
