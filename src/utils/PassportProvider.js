const passport = require("passport");
const Users = require("../model/users.model");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const googleProvider = () => {
    passport.use(new GoogleStrategy({
        clientID: "569940044172-2166umtsb8m4nbn30ojh8e2amee4o1t9.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/api/v1/users/google/callback",
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
        console.log("Serialized User:", user.id);
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log("Deserializing user with ID:", id);

        await Users.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


module.exports = googleProvider
