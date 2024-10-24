

const Shimmer = () => (
    <div className="animate-pulse">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4 p-4">
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

export default Shimmer;
