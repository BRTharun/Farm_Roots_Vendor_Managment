import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchManufacturers,
    updateManufacturer,
    deleteManufacturer,
    addManufacturer,
} from "../utils/manufactue";
import { AppDispatch, RootState } from "../utils/store";

const ManufacturersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { manufacturers, status, error } = useSelector(
        (state: RootState) => state.manufacturers
    );

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchManufacturers());
        }
    }, [status, dispatch]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newManufacturer, setNewManufacturer] = useState<string>("");

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setNewName(name);
    };

    const handleUpdate = (id: string) => {
        dispatch(updateManufacturer({ id, name: newName })).then(({ meta }) => {
            if (meta.requestStatus === 'fulfilled') {
                setEditingId(null);
                setNewName("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this manufacturer?")) {
            dispatch(deleteManufacturer(id));
        }
    };

    const handleAddManufacturer = () => {
        if (newManufacturer.trim() !== "") {
            dispatch(addManufacturer({ name: newManufacturer })).then(({ meta }) => {
                if (meta.requestStatus === 'fulfilled') {
                    setNewManufacturer("");
                }
            });
        }
    };

    const handleManufacturerClick = (id: string) => {
        console.log(id);
        navigate(`/manufacturer-products/${id}`);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">Manufacturers</h1>
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && <p className="text-red-500">{error}</p>}

                        <div className="flex mb-4">
                            <input
                                type="text"
                                value={newManufacturer}
                                onChange={(e) => setNewManufacturer(e.target.value)}
                                placeholder="New manufacturer name"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                            />
                            <button
                                onClick={handleAddManufacturer}
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
                                {manufacturers.map((manufacturer) => (
                                    <tr
                                        key={manufacturer._id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="p-2">
                                            {editingId === manufacturer._id ? (
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) =>
                                                        setNewName(e.target.value)
                                                    }
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() => handleManufacturerClick(manufacturer._id)}
                                                >
                                                    {manufacturer.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {editingId === manufacturer._id ? (
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(manufacturer._id)
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
                                                                manufacturer._id,
                                                                manufacturer.name
                                                            )
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(manufacturer._id)
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

export default ManufacturersPage;