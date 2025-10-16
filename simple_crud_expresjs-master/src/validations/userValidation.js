const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(100).required(),
    bod: Joi.date().required()
});

module.exports = {
    userSchema,
};
