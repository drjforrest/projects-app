export function LoadingCard() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
} 