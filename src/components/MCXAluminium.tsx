import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { useMCXPrice } from '../hooks/useMCXPrice';
import { format } from 'date-fns';

export default function MCXAluminium() {
    const { priceData, error, loading, fetchMCXPrice } = useMCXPrice();

    return (
        <div className="bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-pink-50/90 backdrop-blur-sm rounded-xl p-6
      border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
      transition-all duration-300 relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        MCX Aluminium
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Source: 5paisa.com
                    </p>
                </div>
                <span className="text-gray-500 dark:text-gray-400">Future Nov 2024</span>
            </div>

            <div className="mb-4">
                {error ? (
                    <div className="text-red-500 mb-4">{error}</div>
                ) : (
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[56px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{priceData.currentPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">per kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`text-xl ${priceData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                            </div>
                            {loading && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Loading price...</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {priceData && (
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                        Last updated: {format(new Date(priceData.lastUpdated), 'hh:mm:ss a')}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Live
                    </span>
                </div>
            )}

            <button
                onClick={fetchMCXPrice}
                className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
    );
}