
import React from 'react';
import FormPage from './formPage';
const GoalComponent = () => {
    return (
        <div className="bg-blue-50 flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-center mb-6">I really want to reach this goal because...</h1>
                <div className="space-y-4">

                    <div className="flex items-center space-x-4 p-4 border border-gray-200 hover:border-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-[#3B82F680] ">
                        <div className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center font-bold">1</div>
                        <div className="text-gray-700">I want to step up and support my family</div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border border-gray-200 hover:border-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-[#3B82F680] ">
                        <div className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center font-bold">2</div>
                        <div className="text-gray-700">I want to step up and support my family</div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border border-gray-200 hover:border-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-[#3B82F680] ">
                        <div className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center font-bold">3</div>
                        <div className="text-gray-700">I want to have more freedom in my life</div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default GoalComponent;
