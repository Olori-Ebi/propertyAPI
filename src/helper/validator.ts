import Joi from "joi";

export const ValidateRegister = Joi.object({
  first_name: Joi.string().min(3),
  last_name: Joi.string().min(3),
  email: Joi.string().email().lowercase().required(),
  address: Joi.string().lowercase().required().min(5),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().min(6).required(),
});

export const ValidateLogin = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

export const ValidatePropertyAd = Joi.object({
  status: Joi.string().valid("sold", "available").default("available"),
  price: Joi.number().required(),
  state: Joi.string().lowercase().required(),
  city: Joi.string().lowercase().required().min(5),
  address: Joi.string().min(6).required(),
  type: Joi.string().min(6).required(),
});
