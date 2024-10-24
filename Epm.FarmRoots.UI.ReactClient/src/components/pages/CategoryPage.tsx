import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import {
    fetchCategories,
    updateCategory,
    deleteCategory,
    addCategory
} from "../utils/category";

import { AppDispatch, RootState } from "../utils/store";
//import { COUNTRY_LIST } from "../utils/constants/countryList";
import { CATEGORIES } from "../utils/constants/categoryList";

const CategoryPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categories, status, error } = useSelector(
        (state: RootState) => state.categories
    );
    console.log("dk",categories)
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newCategory, setNewCategory] = useState<string>("");

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setNewName(name);
    };

    const handleUpdate = (id: string) => {
        dispatch(updateCategory({ id, name: newName })).then(({ meta }) => {
            if (meta.requestStatus === 'fulfilled') {
                setEditingId(null);
                setNewName("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(id));
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() !== "") {
            dispatch(addCategory(newCategory)).then(({ meta}) => {
                if (meta.requestStatus === 'fulfilled') {
                    setNewCategory("");
                }
            });
        }
    };

    const handleCategoryClick = (id: string, category: any) => {
        navigate(`/subcategories/${id}`, {
            state: { category }
        });
    };
    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">Categories</h1>
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && <p className="text-red-500">{error}</p>}
                        <div className="flex mb-4">
                                <input
                                    type="text"
                                    list="categories"
                                    name="country_of_origin"
                                    value={newCategory}
                                    placeholder="New Category name"
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                <datalist id="categories">
                                    {CATEGORIES.map((country:any, index:any) => (
                                        <option key={index} value={country} />
                                    ))}
                                </datalist>
                            <button
                                onClick={handleAddCategory}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>

                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category:any) => (
                                    <tr
                                        key={category._id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="p-2">
                                            {editingId === category._id ? (
                                                <>
                                                <input
                                                type="text"
                                                list="categories"
                                                    value={newName}
                                                    onChange={(e) =>
                                                        setNewName(e.target.value)
                                                    }
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                            />
                                            <datalist id="categories">
                                                {CATEGORIES.map((country:any, index:any) => (
                                                    <option key={index} value={country} />
                                                ))}
                                            </datalist>
                                            </>
                                            ) : (
                                                <span
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() => handleCategoryClick(category._id,category.name)}
                                                >
                                                    {category.name}
                                                </span>
                                            )}

                                        </td>
                                        <td className="p-2">
                                            {editingId === category._id ? (
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(category._id)
                                                    }
                                                    className="text-green-500 hover:text-green-700 mr-2"
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                category._id,
                                                                category.name
                                                            )
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(category._id)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;