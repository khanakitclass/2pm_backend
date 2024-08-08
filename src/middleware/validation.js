const Joi = require("joi");
const pick = require("../helper/pick");

const validation = (schema) => (req, res, next) => {
    try {
        console.log("bodyyyyyyyyyyyy", req.body);

        const objs = pick(req, Object.keys(schema));

        

        const { error, value } = Joi.compile(schema)
            .prefs({
                abortEarly: false
            })
            .validate(objs);
        
        if (error) {
            let errMsg = error.details.map((v) => v.message).join(", ");

            return next(new Error("Validation error: " + errMsg))
        }

        console.log(value);
        
        Object.assign(req, value);

        next();
    } catch (error) {
        console.log(error);
        
    }

}

module.exports = validation