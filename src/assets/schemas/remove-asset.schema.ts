import * as Joi from 'joi';
// Define a schema to validate the assetId parameter
const RemoveAssetSchema = Joi.object({
    assetId: Joi.number().integer().positive().required(), // assetId must be a positive integer
});

export { RemoveAssetSchema };