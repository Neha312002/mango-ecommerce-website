'use client';

import { useEffect, useState } from 'react';

export default function AdminDebug() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    let parsedUser = null;
    try {
      if (currentUser) {
        parsedUser = JSON.parse(currentUser);
      }
    } catch (e) {
      parsedUser = { error: 'Failed to parse user data' };
    }

    setInfo({
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      hasCurrentUser: !!currentUser,
      currentUserData: parsedUser,
      allLocalStorageKeys: Object.keys(localStorage),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🔍 Admin Debug Info
        </h1>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Has Token:</p>
                <p className={info.hasToken ? 'text-green-600' : 'text-red-600'}>
                  {info.hasToken ? '✅ Yes' : '❌ No'}
                </p>
              </div>
              <div>
                <p className="font-medium">Token Length:</p>
                <p>{info.tokenLength} characters</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">User Data</h2>
            <div>
              <p className="font-medium">Has Current User:</p>
              <p className={info.hasCurrentUser ? 'text-green-600' : 'text-red-600'}>
                {info.hasCurrentUser ? '✅ Yes' : '❌ No'}
              </p>
              
              {info.currentUserData && (
                <div className="mt-4 bg-gray-50 p-4 rounded">
                  <p className="font-medium mb-2">User Details:</p>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(info.currentUserData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">LocalStorage Keys</h2>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm">
                {JSON.stringify(info.allLocalStorageKeys, null, 2)}
              </pre>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Admin Access Check</h2>
            {info.currentUserData?.role === 'admin' ? (
              <p className="text-green-600 text-lg font-semibold">
                ✅ User has admin role - Access should be granted
              </p>
            ) : (
              <p className="text-red-600 text-lg font-semibold">
                ❌ User does NOT have admin role (role: {info.currentUserData?.role || 'undefined'})
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <a
              href="/admin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Admin Panel
            </a>
            <a
              href="/auth?redirect=/admin"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Re-login
            </a>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
