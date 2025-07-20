const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get low stock report
// @route   GET /api/reports/low-stock
// @access  Private
const getLowStockReport = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const products = await Product.find({
      isActive: true,
      $or: [
        { 'variants.stock': { $lte: threshold } },
        { variants: { $size: 0 } } 
      ]
    }).populate('category', 'name');

    const lowStockItems = [];

    products.forEach(product => {
      if (product.variants.length === 0) {
        lowStockItems.push({
          productId: product._id,
          productName: product.name,
          category: product.category.name,
          variantId: null,
          variantName: 'Default',
          currentStock: 0,
          threshold
        });
      } else {
        product.variants.forEach(variant => {
          if (variant.stock <= threshold) {
            lowStockItems.push({
              productId: product._id,
              productName: product.name,
              category: product.category.name,
              variantId: variant._id,
              variantName: `${variant.name}: ${variant.value}`,
              currentStock: variant.stock,
              threshold
            });
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        threshold,
        totalLowStockItems: lowStockItems.length,
        items: lowStockItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory summary
// @route   GET /api/reports/inventory-summary
// @access  Private
const getInventorySummary = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category', 'name');

    const summary = {
      totalProducts: products.length,
      totalVariants: 0,
      totalStock: 0,
      categorySummary: {},
      outOfStockItems: 0
    };

    products.forEach(product => {
      const categoryName = product.category.name;
      
      if (!summary.categorySummary[categoryName]) {
        summary.categorySummary[categoryName] = {
          products: 0,
          variants: 0,
          totalStock: 0
        };
      }

      summary.categorySummary[categoryName].products++;

      if (product.variants.length === 0) {
        summary.outOfStockItems++;
      } else {
        product.variants.forEach(variant => {
          summary.totalVariants++;
          summary.categorySummary[categoryName].variants++;
          summary.totalStock += variant.stock;
          summary.categorySummary[categoryName].totalStock += variant.stock;

          if (variant.stock === 0) {
            summary.outOfStockItems++;
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category report
// @route   GET /api/reports/products-by-category
// @access  Private
const getProductsByCategoryReport = async (req, res, next) => {
  try {
    const categoryReport = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$category',
          categoryName: { $first: '$categoryInfo.name' },
          productCount: { $sum: 1 },
          averagePrice: { $avg: '$basePrice' },
          totalVariants: { $sum: { $size: '$variants' } }
        }
      },
      { $sort: { productCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categoryReport
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLowStockReport,
  getInventorySummary,
  getProductsByCategoryReport
};