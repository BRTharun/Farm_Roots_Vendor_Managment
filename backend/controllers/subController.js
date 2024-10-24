const mongoose = require("mongoose");
const { Category, Subcategory, Manufacturer } = require("../model/product/Sub");
const Product = require("../model/product/Product");
const Vendor = require("../model/vendor/Vendor");

// Controller to create a new category
const createCategory = async (req, res) => {
    try {
        const { name, subcategories, product_ids } = req.body;
        const vendorId = req.user._id;

        // Step 1: Check if the category exists in the Category model
        //const existingCategory = await Category.findOne({ name });

        // Step 2: Check if the category exists in the vendor's categories
        const vendor = await Vendor.findById(vendorId).populate("category"); // Populate the category field

        // Check if the category with the same name exists in the vendor's populated categories
        const categoryExistsInVendor = vendor.category.some(
            (cat) => cat.name === name
        );

        if (categoryExistsInVendor) {
            return res
                .status(400)
                .json({ message: "Category already exists in your profile" });
        }

        // Step 3: Create the new category
        const newCategory = new Category({ name, product_ids });
        await newCategory.save();

        // Step 4: Update subcategories with the new category
        if (subcategories && subcategories.length > 0) {
            await Subcategory.updateMany(
                { _id: { $in: subcategories } },
                { $addToSet: { category_ids: newCategory._id } }
            );
        }

        // Step 5: Update products with the new category ID
        if (product_ids && product_ids.length > 0) {
            await Product.updateMany(
                { _id: { $in: product_ids } },
                { $addToSet: { category: newCategory._id } }
            );
        }

        // Step 6: Add the new category to the logged-in vendor
        await Vendor.findByIdAndUpdate(vendorId, {
            $addToSet: { category: newCategory._id },
        });

        res.status(201).json({
            message: "Category created successfully",
            category: newCategory,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Controller to create a new subcategory
const createSubcategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const { name } = req.body;

        // Check if the subcategory already exists
        const existingSubcategory = await Subcategory.findOne({ name });
        if (existingSubcategory) {
            return res
                .status(400)
                .json({ message: "Subcategory already exists" });
        }
        console.log(category_id);
        // Create the new subcategory
        const newSubcategory = new Subcategory({
            name,
            category_ids: [category_id],
        });

        // Save the new subcategory
        await newSubcategory.save();

        // Update the category with the new subcategory
        if (category_id) {
            const category = await Category.findById(category_id);
            if (category) {
                category.subcategories.push(newSubcategory._id);
                await category.save();
            }
        }

        res.status(201).json({
            message: "Subcategory created successfully",
            subcategory: newSubcategory,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const productSubCategoryMap = async (req, res) => {
    try {
        const { subCategory_id } = req.params;
        const { product_ids } = req.body;
        console.log(subCategory_id, product_ids);

        const category_id = await Subcategory.findById(subCategory_id).populate(
            "category_ids"
        );
        const final = category_id.category_ids;
        //Update products with the new subcategory ID
        if (product_ids && product_ids.length > 0) {
            await Product.updateMany(
                { _id: { $in: product_ids } },
                {
                    $addToSet: {
                        subcategory: subCategory_id,
                        category: final,
                    },
                }
            );
        }

        if (subCategory_id) {
            const subCategory = await Subcategory.findById(subCategory_id);
            if (subCategory) {
                subCategory.product_ids.push(...product_ids);
                await subCategory.save();
                console.log(subCategory.product_ids);
            }
            const vendorId = req.user._id;
            await Vendor.findByIdAndUpdate(vendorId, {
                $addToSet: { subcategory: subCategory_id },
            });
            res.status(201).json({
                message: "Product mapped to SubCategory Successfully",
                subcategory: subCategory,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Controller to create a new manufacturer
const createManufacturer = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the manufacturer already exists
        // const existingManufacturer = await Manufacturer.findOne({ name });
        // if (existingManufacturer) {
        //     return res
        //         .status(400)
        //         .json({ message: "Manufacturer already exists" });
        // }

        const vendorId = req.user._id;

        // Step 1: Check if the category exists in the Category model
        //const existingCategory = await Category.findOne({ name });

        // Step 2: Check if the category exists in the vendor's categories
        const vendor = await Vendor.findById(vendorId).populate("manufacturer"); // Populate the category field

        // Check if the category with the same name exists in the vendor's populated categories
        const manufacturerExistsInVendor = vendor.manufacturer.some(
            (manu) => manu.name === name
        );

        if (manufacturerExistsInVendor) {
            return res.status(400).json({
                message: "Manufacturer already exists in your profile",
            });
        }

        // Create the new manufacturer
        const newManufacturer = new Manufacturer({ name });

        // Save the new manufacturer
        await newManufacturer.save();

        await Vendor.findByIdAndUpdate(vendorId, {
            $addToSet: { manufacturer: newManufacturer._id },
        });

        res.status(201).json({
            message: "Manufacturer created successfully",
            manufacturer: newManufacturer,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const manufactureMap = async (req, res) => {
    try {
        const { manufacturer_id } = req.params;
        const { product_ids } = req.body;

        if (manufacturer_id) {
            const manufacturer = await Manufacturer.findById(manufacturer_id);
            if (manufacturer) {
                manufacturer.product_ids.push(...product_ids);
                await manufacturer.save();
            }

            // Update products with the new manufacturer ID
            if (product_ids && product_ids.length > 0) {
                await Product.updateMany(
                    { _id: { $in: product_ids } },
                    { $addToSet: { manufacturer: manufacturer_id } }
                );
            }

            res.status(201).json({
                message: "Product mapped to Manufacturer Successfully",
                manufacturer: manufacturer,
            });
        }
    } catch (err) {
        res.status(500).json({ message: "server error", err });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Step 1: Check if the category exists in the Category model
        //const existingCategory = await Category.findOne({ name });

        // Step 2: Check if the category exists in the vendor's categories
        const vendor = await Vendor.findById(vendorId).populate(
            "category",
            "name"
        );
        console.log(vendor.category);

        res.status(200).json(vendor.category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate(
            "subcategories",
            "name"
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndDelete(categoryId);

        // Remove the category reference from Subcategories
        await Subcategory.deleteMany({ category_ids: categoryId });
        // Remove the category reference from Products
        await Product.updateMany(
            { category: categoryId },
            { $pull: { category: categoryId } }
        );

        // Remove the category reference from Vendors
        await Vendor.updateMany(
            { category: categoryId },
            { $pull: { category: categoryId } }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllSubcategories = async (req, res) => {
    try {
        const categoryId = req.params.id; // Extract the ID from URL parameters

        // Find the subcategory by ID and populate the product_ids field
        const subcategory = await Category.findById(categoryId).populate(
            "subcategories"
        );

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateSubcategory = async (req, res) => {
    try {
        const { name } = req.body;

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({
            message: "Subcategory updated successfully",
            subcategory,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateSubcategoryProducts = async (req, res) => {
    try {
        const { product_ids } = req.body;
        console.log(product_ids);
        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { product_ids },
            { new: true }
        );

        const category_id = await Subcategory.findById(req.params.id).populate(
            "category_ids"
        );
        const final = category_id.category_ids;

        if (product_ids && product_ids.length > 0) {
            await Product.updateMany(
                { _id: { $in: product_ids } },
                {
                    $addToSet: {
                        subcategory: req.params.id,
                        category: final,
                    },
                }
            );
        }
        const vendorId = req.user._id;

        await Vendor.findByIdAndUpdate(vendorId, {
            $addToSet: { subcategory: req.params.id },
        });

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({
            message: "Subcategory Products updated successfully",
            subcategory,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        // Remove the category reference from Products
        await Product.updateMany(
            { subcategory: req.params.id },
            { $pull: { subcategory: req.params.id } }
        );

        await Category.updateMany(
            { subcategories: req.params.id },
            { $pull: { subcategories: req.params.id } }
        );

        // Remove the category reference from Vendors
        await Vendor.updateMany(
            { subcategory: req.params.id },
            { $pull: { subcategory: req.params.id } }
        );

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllManufacturers = async (req, res) => {
    try {
        // const manufacturers = await Manufacturer.find().populate(
        //     "product_ids",
        //     "name"
        // );
        const vendorId = req.user._id;

        const vendor = await Vendor.findById(vendorId).populate("manufacturer");

        res.status(200).json(vendor.manufacturer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateManufacturer = async (req, res) => {
    try {
        const { name } = req.body;

        const manufacturer = await Manufacturer.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }

        res.status(200).json({
            message: "Manufacturer updated successfully",
            manufacturer,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateManufacturerProducts = async (req, res) => {
    try {
        const { product_ids } = req.body;
        console.log(product_ids);
        const manufacturer = await Manufacturer.findByIdAndUpdate(
            req.params.id,
            { product_ids },
            { new: true }
        );
        console.log(manufacturer);

        if (product_ids && product_ids.length > 0) {
            await Product.updateMany(
                { _id: { $in: product_ids } },
                {
                    $addToSet: {
                        manufacturer: manufacturer._id,
                    },
                }
            );
        }

        // if (!subcategory) {
        //     return res.status(404).json({ message: "Subcategory not found" });
        // }

        res.status(200).json({
            message: "Subcategory Products updated successfully",
            manufacturer,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteManufacturer = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findByIdAndDelete(
            req.params.id
        );

        await Vendor.updateMany(
            { manufacturer: req.params.id },
            { $pull: { manufacturer: req.params.id } }
        );

        await Product.updateMany(
            { manufacturer: req.params.id },
            { $pull: { manufacturer: req.params.id } }
        );

        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }

        res.status(200).json({ message: "Manufacturer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getManufacturerById = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findById(
            req.params.id
        ).populate("product_ids", "name"); // Populate the related products

        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }

        res.status(200).json(manufacturer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate(
            "product_ids",
            "name"
        ); // Populate the related products

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    createCategory,
    createSubcategory,
    createManufacturer,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
    getAllManufacturers,
    getManufacturerById,
    updateManufacturer,
    deleteManufacturer,
    productSubCategoryMap,
    manufactureMap,
    updateSubcategoryProducts,
    updateManufacturerProducts,
    deleteSubcategory,
};
