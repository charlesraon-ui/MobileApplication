import React from 'react';

const BottomNav = ({ view, setView }) => {
    return (  // Add return here to render JSX
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-2 border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center h-16">
                <button onClick={() => setView('home')} className={`flex flex-col items-center text-gray-500 transition-colors ${view === 'home' ? 'text-green-600' : 'hover:text-green-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button onClick={() => setView('categories')} className={`flex flex-col items-center text-gray-500 transition-colors ${view === 'categories' ? 'text-green-600' : 'hover:text-green-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span className="text-xs mt-1">Categories</span>
                </button>
                <button onClick={() => setView('orders')} className={`flex flex-col items-center text-gray-500 transition-colors ${view === 'orders' ? 'text-green-600' : 'hover:text-green-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7.5 4.27 9 5.15"></path>
                        <path d="M21 8.24v9.14a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 17.38V8.24a2 2 0 0 1 1-1.74l7-4a2 2 0 0 1 2 0l7 4a2 2 0 0 1 1.01 1.76"></path>
                        <path d="m3.29 7.42 8.71 5 8.71-5"></path>
                        <line x1="12" x2="12" y1="22" y2="12"></line>
                    </svg>
                    <span className="text-xs mt-1">Orders</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
