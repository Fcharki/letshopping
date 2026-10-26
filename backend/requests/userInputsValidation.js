import joi from "joi";

const passwordSchema = joi
  .string()
  .pattern(
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  )
  .required()
  .messages({
    "string.pattern.base":
      "The password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
  });

const emailSchema = joi
  .string()
  .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
  .required()
  .messages({
    "string.pattern.base":
      "The email address is not valid. Here is an example of a valid email: example@gmail.com.",
  });

const objectIdSchema = joi.string().hex().length(24);

export const signUpSchema = joi.object({
  name: joi.string().trim().min(2).max(80).required(),
  email: emailSchema,
  password: passwordSchema,
  address: joi.string().trim().min(2).required(),
  phone: joi.string().trim().length(10).required().messages({
    "string.length": "The phone number must contain exactly 10 digits.",
  }),
  role: joi.string().valid("customer", "admin"),
});

export const loginSchema = joi.object({
  email: emailSchema,
  password: joi.string().required(),
});

export const emailOnlySchema = joi.object({
  email: emailSchema,
});

export const passwordChangeSchema = joi.object({
  newPassword: passwordSchema,
  confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
    "any.only": "Passwords don't match",
  }),
});

export const resetPasswordSchema = joi.object({
  newPassword: passwordSchema,
});

export const profileUpdateSchema = joi
  .object({
    name: joi.string().trim().min(2).max(80),
    email: emailSchema.optional(),
    address: joi.string().trim().min(2),
    phone: joi.string().trim().length(10),
  })
  .min(1);

export const contactSchema = joi.object({
  name: joi.string().trim().min(2).max(80).required(),
  email: emailSchema,
  message: joi.string().trim().min(5).max(2000).required(),
});

export const placeOrderSchema = joi.object({
  shippingAddress: joi
    .object({
      street: joi.string().trim().min(1).required(),
      city: joi.string().trim().min(1).required(),
      state: joi.string().trim().allow(""),
      zipCode: joi.string().trim().min(1).required(),
      country: joi.string().trim().min(1).required(),
    })
    .required(),
});

export const cartItemSchema = joi.object({
  productId: objectIdSchema.required(),
  quantity: joi.number().integer().min(1).required(),
});

export const productSchema = joi.object({
  name: joi.string().trim().min(2).max(120).required(),
  description: joi.string().trim().min(5).required(),
  price: joi.number().min(0).required(),
  stockQuantity: joi.number().integer().min(0).required(),
  categoryName: joi.string().trim().min(1).required(),
  imageURL: joi.string().uri().required(),
});

export const reviewSchema = joi.object({
  rating: joi.number().integer().min(1).max(5).required(),
  comment: joi.string().trim().min(1).max(500).required(),
});

export const orderStatusSchema = joi.object({
  status: joi.string().valid("pending", "shipped", "delivered", "canceled").required(),
});

export const paymentStatusSchema = joi.object({
  paymentStatus: joi.string().valid("unpaid", "paid", "refunded").required(),
});

export const paymentIntentSchema = joi.object({
  orderId: objectIdSchema.required(),
});

export const confirmPaymentSchema = joi.object({
  orderId: objectIdSchema.required(),
  paymentIntentId: joi.string().trim().min(1).optional(),
});

export const searchSchema = joi.object({
  keyword: joi.string().trim().min(1).max(100).required(),
});

export const stockAmountSchema = joi.object({
  amount: joi.number().integer().min(1).required(),
});

export const bannerSchema = joi.object({
  title: joi.string().trim().min(2).max(120).required(),
  description: joi.string().trim().min(2).max(500).required(),
  imageUrl: joi.string().uri().required(),
  link: joi.string().uri().required(),
  startDate: joi.date().required(),
  endDate: joi.date().greater(joi.ref("startDate")).required(),
  active: joi.boolean(),
});

export const categorySchema = joi.object({
  name: joi.string().trim().min(2).max(80).required(),
  description: joi.string().trim().min(2).max(500).required(),
  imageURL: joi.string().uri().required(),
});
