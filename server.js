const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const database = require('./db/database')
const cookieParser = require('cookie-parser');
const employeeRoute=require('./routes/employeeRoute')
const employeeRoute2=require('./routes/employeeRoute2')
const authRoute=require('./routes/authRoute')
const session = require('express-session');
const passport = require('./utils/passport');
const keySkillsRoutes = require('./routes/keySkillsRoutes');

const tokenValidator = require('./middleware/tokenValidator')

database()
const port =  process.env.PORT || 5000

app.use(cors());

app.use(session({
    resave: false,  
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET 
}));

app.use(tokenValidator)

// setuppassport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())

// //for passing header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type,Authorization');
    next();
  });

app.use(authRoute);
app.use('/api/v1',employeeRoute)
app.use('/api/employee/v1',employeeRoute2)
app.use('/api/employee/v1/keyskills', keySkillsRoutes);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})