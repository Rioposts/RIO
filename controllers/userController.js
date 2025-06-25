const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = 'your-secret-key';

// Controller for registering a user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error registering user');
            } else {
                res.status(201).send('User registered successfully');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Controller for logging in a user
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(401).send('Invalid credentials');
        } else {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401).send('Invalid credentials');
            } else {
                const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token });
            }
        }
    });
};

// Controller for fetching all users (example protected route)
const getUsers = (req, res) => {
    const query = 'SELECT id, username, email, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
};

module.exports = { registerUser, loginUser, getUsers };
