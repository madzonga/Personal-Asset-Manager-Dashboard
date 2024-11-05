import * as Joi from 'joi';

// Define a schema to validate the userId query parameter
const ListAssetsSchema = Joi.object({
  userId: Joi.number().integer().positive().required(), // userId must be a positive integer
});

export { ListAssetsSchema };