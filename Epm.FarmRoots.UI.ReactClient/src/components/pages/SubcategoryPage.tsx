import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import the useNavigate hook
import {
    fetchSubcategories,
    updateSubcategory,
    deleteSubcategory,
    addSubcategory,
} from "../utils/subcategory";
import { AppDispatch, RootState } from "../utils/store";
//import { COUNTRY_LIST } from "../utils/constants/countryList";

const categoryData: any = {
    Fruits: [
        "Citrus fruits (oranges, lemons, limes)",
        "Berries (strawberries, blueberries, raspberries)",
        "Fresh fruits (apples, peaches, plums, cherries)",
        "Tropical fruits (mangoes, pineapples, bananas)",
    ],
    Vegetables: [
        "Leafy greens (spinach, kale, lettuce)",
        "Root vegetables (carrots, potatoes, beets)",
        "Fresh vegetables (broccoli, cauliflower, Brussels sprouts)",
    ],
    "Meat, Fish and Eggs": [
        "Chicken",
        "Fish and sea-food (prawn)",
        "Mutton",
        "Eggs",
    ],
    "Dairy Products": ["Milk", "Cheese", "Yogurt", "Butter and Cream"],
    "Cool drinks and juices": ["Soft drinks", "Fruit juices", "Herbal drinks"],
    "Condiments and Spices": [
        "Honey",
        "Jams and preserves",
        "Hot sauces",
        "Herbs (basil, mint, rosemary)",
        "Spices (cinnamon, turmeric, ginger)",
    ],
    "Baked Goods": ["Bread", "Pastries", "Cakes", "Cookies", "Pies"],
    Grains: ["Wheat products (bread, pasta)", "Rice", "Corn", "Oats"],
    Treats: ["Chocolates", "Sweets", "Protein bar", "Premium chocolates"],
    Snacks: ["Chips", "Namkeens", "Dry Fruits and Nuts"],
    "Health and Wellness": ["Handwash", "Cold and Cough", "Pain relief"],
    "Tea and coffee, more": [
        "Tea",
        "Coffee",
        "Milk Drink mixes",
        "Green and Herbal Tea",
    ],
    "Cleaning essentials": ["Cleaning tools", "Detergents", "Liquids"],
    "Body care": ["Skin care", "Hair care", "Soaps"],
    "Other's": [],
};

const SubcategoryPage: React.FC = () => {
    const location = useLocation();
    const { category } = location.state || {};
    const [subcategoriesList, setSubcategoriesList] = useState([]);

    // Fetch subcategories based on the category name
    useEffect(() => {
        if (category && categoryData[category]) {
            setSubcategoriesList(categoryData[category]);
        }
    }, [category]);

    console.log(category);
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { subcategories, status, error } = useSelector(
        (state: RootState) => state.subcategories
    );

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchSubcategories(categoryId));
        }
    }, [categoryId, dispatch]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newSubcategory, setNewSubcategory] = useState<string>("");

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setNewName(name);
    };

    const handleUpdate = (id: string) => {
        dispatch(updateSubcategory({ id, name: newName })).then(({ meta }) => {
            if (meta.requestStatus === "fulfilled") {
                setEditingId(null);
                setNewName("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (
            window.confirm("Are you sure you want to delete this subcategory?")
        ) {
            dispatch(deleteSubcategory(id));
        }
    };

    const handleAddSubcategory = () => {
        if (newSubcategory.trim() !== "") {
            dispatch(
                addSubcategory({
                    categoryId: categoryId!,
                    name: newSubcategory,
                })
            ).then(({ meta }) => {
                if (meta.requestStatus === "fulfilled") {
                    setNewSubcategory("");
                }
            });
        }
    };

    const handleSubcategoryClick = (id: string) => {
        navigate(`/subcategory-products/${id}`);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">
                            Subcategories
                        </h1>
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && (
                            <p className="text-red-500">{error}</p>
                        )}

                        <div className="flex mb-4">
                            <input
                                type="text"
                                list="subcategoriesList"
                                value={newSubcategory}
                                onChange={(e) =>
                                    setNewSubcategory(e.target.value)
                                }
                                placeholder="New subcategory name"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                            />
                            <datalist id="subcategoriesList">
                                {subcategoriesList.map(
                                    (country: any, index: any) => (
                                        <option key={index} value={country} />
                                    )
                                )}
                            </datalist>

                            <button
                                onClick={handleAddSubcategory}
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
                                {subcategories.map((subcategory) => (
                                    <tr
                                        key={subcategory._id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="p-2">
                                            {editingId === subcategory._id ? (
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) =>
                                                        setNewName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() =>
                                                        handleSubcategoryClick(
                                                            subcategory._id
                                                        )
                                                    }
                                                >
                                                    {subcategory.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {editingId === subcategory._id ? (
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(
                                                            subcategory._id
                                                        )
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
                                                                subcategory._id,
                                                                subcategory.name
                                                            )
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                subcategory._id
                                                            )
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

export default SubcategoryPage;
