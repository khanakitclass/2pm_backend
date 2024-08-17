const passport = require('passport');
const Users = require('../model/users.model');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleLoginProvider = async () => {
    try {
        await passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECREAT,
            callbackURL: "https://2pm-backend.vercel.app/api/v1/users/google/callback",
        },
            async function (accessToken, refreshToken, profile, cb) {
                console.log(profile);

                try {
                    let user = await Users.findOne({ googleId: profile.id });

                    if (!user) {
                        try {
                            user = await Users.create({
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                googleId: profile.id,
                                role: 'user'
                            })
                        } catch (error) {
                            console.log("err1", error);
                        }
                    }



                    return cb(null, user);

                } catch (error) {
                    console.log("err", error);
                    return cb(error, null);
                }
            }
        ));

        passport.serializeUser(function (user, done) {
            console.log("serialized....", user);
            done(null, user.id);
        });

        passport.deserializeUser(async function (id, done) {
            console.log("Deserializing user with ID:", id);

            try {
                const user = await Users.findById(id);

                if (!user) {
                    console.log("User not found in database");
                    return done(null, false);
                }

                console.log("Deserialized User:", user);
                done(null, user);
            } catch (error) {
                console.error("Deserialize Error:", error);
                done(error, null);
            }

            // try {
            //     const user = await Users.findById(id);

            //     if (!user) {
            //         return cb(error, null);
            //     }

            //     return cb(null, user);
            // } catch (error) {
            //     return cb(error, null);
            // }


        });
    } catch (error) {
        console.log("aaaaaaaaa", error);
    }
}

module.exports = googleLoginProvider;