import React from 'react';

const ProfileView = ({ userId, userProfile }) => (
    <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Profile</h2>
        <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="space-y-4">
                <div className="flex items-center text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="ml-2 break-all">{userId}</span>
                </div>
                <div className="flex items-center text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-500"><path d="m15.477 12.892-1.523.678-.543 1.543a.5.5 0 0 1-.942 0l-.543-1.543-1.523-.678a.5.5 0 0 1-.22-.622l.745-1.776L8.4 8.7a.5.5 0 0 1-.03-.96l1.643-.967L10.37 5.2a.5.5 0 0 1 .842 0l.97 2.533L13.8 7.74a.5.5 0 0 1 .03.96L13.064 10.5l.745 1.776a.5.5 0 0 1-.33.622z"></path><circle cx="12" cy="12" r="10"></circle></svg>
                    <span className="font-medium text-gray-700">Loyalty Points:</span>
                    <span className="ml-2 font-bold text-green-600">{userProfile.loyaltyPoints}</span>
                </div>
            </div>
        </div>
    </div>
);

export default ProfileView;