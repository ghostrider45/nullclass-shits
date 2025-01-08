import users from "../Models/Auth.js"; // Import the user model
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email } = req.body; // Extract email from the request body

    try {
        // Check if the user already exists
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            // Create a new user if not found
            const newUser = await users.create({ email });

            // Generate a JWT token for the new user
            const token = jwt.sign(
                { email: newUser.email, id: newUser._id },
                process.env.JWT_SECERT,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: newUser, token });
        } else {
            // User exists: Generate token and send existing user data including points
            const token = jwt.sign(
                { email: existingUser.email, id: existingUser._id },
                process.env.JWT_SECERT,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: existingUser, token });
        }
    } catch (error) {
        res.status(500).json({ mess: error.message });
    }
};
