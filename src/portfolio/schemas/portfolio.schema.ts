// validation/portfolio.validation.ts
import * as Joi from 'joi';

// Schema for validating `userId` parameter
export const UserIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': '`userId` must be a number',
    'number.integer': '`userId` must be an integer',
    'number.positive': '`userId` must be a positive number',
    'any.required': '`userId` is required',
  }),
});

// Schema for validating `assetId` parameter
export const AssetIdSchema = Joi.object({
  assetId: Joi.number().integer().positive().required().messages({
    'number.base': '`assetId` must be a number',
    'number.integer': '`assetId` must be an integer',
    'number.positive': '`assetId` must be a positive number',
    'any.required': '`assetId` is required',
  }),
});
