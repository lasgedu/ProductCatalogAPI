const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    basePrice: Joi.number().min(0).required(),
    discountPercentage: Joi.number().min(0).max(100).default(0),
    variants: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().min(0).required(),
        sku: Joi.string().required()
      })
    ),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.array().items(Joi.string()),
    featured: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(200),
    parentCategory: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateCategory
};