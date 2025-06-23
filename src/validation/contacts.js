import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const limits = {
  name: {
    min: 3,
    max: 20,
  },
  number: {
    min: 3,
    max: 20,
  },
};

const { name, number } = limits;
const phoneRegex = new RegExp(`^\\+?[0-9]{${number.min},${number.max}}$`); // допускає + на початку, 7-16 цифр

export const createContactSchema = Joi.object({
  name: Joi.string().min(name.min).max(name.max).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),

  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .required()
    .messages({
      'any.required': 'Phone number is required',
      'string.base': 'Phone number should be a string',
      'string.pattern.base': `Phone number must contain ${number.min} to ${number.max} digits and may start with "+"`,
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.base': 'Email should be a string',
      'string.email': 'Please enter a valid email address',
    }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is favourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Contact type is required',
      'string.base': 'Contact type must be a string',
      'any.only': 'Contact type must be one of: work, home, or personal',
    }),

  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(name.min).max(name.max).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),

  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .messages({
      'string.base': 'Phone number should be a string',
      'string.pattern.base': `Phone number must contain ${number.min} to ${number.max} digits and may start with "+"`,
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.base': 'Email should be a string',
      'string.email': 'Please enter a valid email address',
    }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is favourite should be a boolean',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type must be a string',
    'any.only': 'Contact type must be one of: work, home, or personal',
  }),
});
