const passport = require("passport");
const Users = require("../model/users.model");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const googleProvider = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECREAT,
        callbackURL: "https://2pm-backend.vercel.app/api/v1/users/google/callback",
        passReqToCallback: true
    },
        async function (request, accessToken, refreshToken, profile, done) {
            let user = await Users.findOne({ googleId: profile.id });

            console.log(profile);

            if (!user) {
                try {
                    user = await Users.create({
                        name: profile.displayName,
                        googleId: profile.id,
                        email: profile.email,
                        role: 'user',
                    })
                } catch (error) {
                    console.log(error);
                }
            }

            return done(null, user);
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log("Serialized User:", user);
        done(null, user);
    });

    passport.deserializeUser(async function (data, done) {
        console.log("Deserializing user with ID:", data);

        try {
            done(null, data);
        } catch (err) {
            done(err, null);
        }
        

        

        // await Users.findById(id, function (err, user) {
        //     done(err, user);
        // });
    });
}


module.exports = googleProvider
