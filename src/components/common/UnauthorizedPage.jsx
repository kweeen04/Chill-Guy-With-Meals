'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-2xl max-w-sm w-full">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-orange-100 dark:bg-orange-800 p-4 rounded-full">
                        <UserIcon className="w-10 h-10 text-orange-500 dark:text-orange-300" />
                    </div>
                    <p className="text-xl text-gray-800 dark:text-gray-200 font-semibold text-center">
                        Please sign in to continue
                    </p>
                    <button
                        onClick={() => router.push('/dang-nhap')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
