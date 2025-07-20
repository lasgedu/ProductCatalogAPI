const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.basePrice = {};
      if (req.query.minPrice) query.basePrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.basePrice.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    } else {
      query.isActive = true; 
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1; 
    }

    const products = await Product.find(query)
      .populate('category', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: products.length,
        totalItems: total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const product = await Product.create(req.body);
    await product.populate('category');

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};


const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category');

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const { variantId, stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
      variant.stock = stock;
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory
};