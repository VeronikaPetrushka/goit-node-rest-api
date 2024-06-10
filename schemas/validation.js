import Joi from "joi";
import { emailRegexp } from "./user.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
}).or("name", "email", "phone");

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authShemas = {
  registerSchema,
  loginSchema,
};
