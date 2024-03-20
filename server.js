import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { router } from './src/routes/employeeRoute.js';
import authRoute from './src/routes/authRoute.js';
import passport from './src/utils/passport.js';
import keySkillsRoutes from './src/routes/keySkillsRoutes.js';
import authenticateToken from './src/middleware/tokenValidator.js';
import { connectToDatabase } from './db.config.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

connectToDatabase();

app.use(cors());

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
    })
);

app.use(authenticateToken);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// for passing header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Type,Authorization'
    );
    next();
});

// routes
app.use(authRoute);
// app.use("/api/v1", employeeRoute);
app.use('/api/employee/v1', router);
app.use('/api/employee/v1/keyskills', keySkillsRoutes);

app.get('/', (req, res) => res.send('Welcome to Miraitech'));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
