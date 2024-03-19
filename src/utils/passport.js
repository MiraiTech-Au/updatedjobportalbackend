import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import User from '../models/userModal.js';

passport.use(
  new OAuth2Strategy({
      clientID:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async(accessToken,refreshToken,profile,done)=>{
    try {
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const email = profile.emails[0].value;
      const googleId = profile.id;

      let user = await User.findOne({ googleId: googleId });

      // If the user does not exist, create a new one
      if (!user) {
          const profileImageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + ' ' + lastName)}`;

          user = new User({
              googleId: googleId,
              email: email,
              personalInfo: {
                  firstName,
                  lastName
              },
              profileImage: profileImageUrl, 
          });

          await user.save();
      }
       
    const payload = {
      id: user._id,
      email: user.email,
      // Add other necessary fields from employee details
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h' // Adjust the duration as per your requirement
    });
    


          return done(null,{ user: user, token: token })
      } catch (error) {
          return done(error,null)
      }
  }
  )
)

// // LinkedIn OAuth2 strategy
// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_CLIENT_ID,
//   clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//   callbackURL: "/auth/linkedin/callback",
//   scope: ['r_emailaddress', 'r_liteprofile'],
//   state: true
// },
// async (accessToken, refreshToken, profile, done) => {
//   console.log("LinkedIn profile ", profile);
//   try {
//     let user = await linkedindb.findOne({ linkedinId: profile.id });

//     if (!user) {
//       user = new linkedindb({
//         linkedinId: profile.id,
//         displayName: profile.displayName,
//         email: profile.emails[0].value, // LinkedIn strategy might not directly provide email, adjust accordingly
//         image: profile.photos[0].value // Adjust if LinkedIn provides a different structure
//       });

//       await user.save();
//     }

//     return done(null, user);
//   } catch (error) {
//     return done(error, null);
//   }
// }
// ));


passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});

export default passport;