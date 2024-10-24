import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../utils/store";
import { fetchVendorProfile } from "../utils/vendorSlice";



// Shimmer effect component
const ShimmerEffect: React.FC = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 h-6 mb-4 w-1/2 rounded"></div>
        <div className="bg-gray-200 h-4 mb-4 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-4 mb-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 mb-4 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-4 mb-4 w-1/2 rounded"></div>
    </div>
);

const VendorProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile, loading, error } = useSelector(
        (state: RootState) => state.vendor
    );

    useEffect(() => {
        dispatch(fetchVendorProfile());
    }, [dispatch]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    {loading ? (
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                            <ShimmerEffect />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-red-600">{error}</div>
                    ) : !profile ? (
                        <div className="p-4">No profile data available.</div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                            <h1 className="text-2xl font-bold mb-4">
                                Vendor Profile
                            </h1>
                            <p>
                                <strong className="font-semibold">
                                    Company Name:
                                </strong>{" "}
                                {profile.companyName}
                            </p>
                            <p>
                                <strong className="font-semibold">
                                    Contact Name:
                                </strong>{" "}
                                {profile.contactName}
                            </p>
                            <p>
                                <strong className="font-semibold">
                                    Email:
                                </strong>{" "}
                                {profile.email}
                            </p>
                            <p>
                                <strong className="font-semibold">
                                    Phone:
                                </strong>{" "}
                                {profile.phone}
                            </p>
                            <p>
                                <strong className="font-semibold">Role:</strong>{" "}
                                {profile.role}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
