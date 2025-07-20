const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory, // Make sure this is imported
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController'); // Path to your controller functions
const { validateCategory } = require('../middleware/validation'); // Path to your validation middleware

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the category
 *           readOnly: true
 *         name:
 *           type: string
 *           description: The name of the category
 *           example: "Electronics"
 *         description:
 *           type: string
 *           description: A brief description of the category
 *           example: "Electronic devices and gadgets"
 *         parentCategory:
 *           type: string
 *           description: The ID of the parent category, if applicable
 *           nullable: true
 *           example: "60c72b2f9b1d8e001c8a4c3d"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the category was created
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the category was last updated
 *           readOnly: true
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Retrieve a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Details of the category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCategory);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "Clothing"
 *               description:
 *                 type: string
 *                 description: A brief description of the category
 *                 example: "Apparel and accessories"
 *               parentCategory:
 *                 type: string
 *                 description: The ID of the parent category
 *                 example: "60c72b2f9b1d8e001c8a4c3d"
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Category name is required"
 *       500:
 *         description: Server error
 */
router.post('/', validateCategory, createCategory); // <-- THIS IS THE MISSING LINE THAT FIXES THE 404 FOR POST

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Home Decor"
 *               description:
 *                 type: string
 *                 example: "Items for home beautification"
 *               parentCategory:
 *                 type: string
 *                 example: "60c72b2f9b1d8e001c8a4c3d"
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or validation error
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validateCategory, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       400:
 *         description: Cannot delete category with existing products
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteCategory);

module.exports = router;