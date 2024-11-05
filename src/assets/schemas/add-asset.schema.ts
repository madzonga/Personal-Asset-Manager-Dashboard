import * as Joi from 'joi';

// Define a base schema for fields common to both types
const baseFields = {
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    smart_contract_address: Joi.string().required(),
    chain: Joi.string().required(),
    type: Joi.string().valid('ERC-20', 'ERC-721').required(),
};

// Define ERC-20 schema with quantity and without tokenId
const erc20Schema = Joi.object({
    ...baseFields,
    quantity: Joi.number().positive().required(),
    token_id: Joi.forbidden(), // ERC-20 should not have tokenId
});

// Define ERC-721 schema with tokenId and without quantity
const erc721Schema = Joi.object({
    ...baseFields,
    token_id: Joi.string().required(), // ERC-721 requires tokenId
    quantity: Joi.forbidden(), // ERC-721 should not have quantity
});

// Combine the schemas using a conditional wrapper
const AddAssetSchema = Joi.object({
    // Base validation fields
    ...baseFields,
})
    .when(Joi.object({ type: Joi.string().valid('ERC-20') }).unknown(), {
        then: erc20Schema,
    })
    .when(Joi.object({ type: Joi.string().valid('ERC-721') }).unknown(), {
        then: erc721Schema,
    });

export { AddAssetSchema };