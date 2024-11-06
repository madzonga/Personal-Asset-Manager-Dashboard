import * as Joi from 'joi';

// Define a schema to validate the login request body
const LoginSchema = Joi.object({
  privyToken: Joi.string().required(), // privyToken must be a non-empty string
  email: Joi.string().email().required(), // email must be a valid email address
});

export { LoginSchema };