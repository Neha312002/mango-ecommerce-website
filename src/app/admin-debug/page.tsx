'use client';

import { useEffect, useState } from 'react';

export default function AdminDebug() {
  const [info, setInfo] = useState<any>({});
  const [tokenVerification, setTokenVerification] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

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

    // Auto-verify token
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTokenVerification(data);
    } catch (error) {
      setTokenVerification({ error: 'Failed to verify token' });
    } finally {
      setVerifying(false);
    }
  };

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

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">JWT Token Verification</h2>
            {verifying ? (
              <p className="text-gray-600">Verifying token...</p>
            ) : tokenVerification ? (
              <div>
                {tokenVerification.valid ? (
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-green-600 text-lg font-semibold mb-2">✅ Token is Valid</p>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(tokenVerification.decoded, null, 2)}
                    </pre>
                    {tokenVerification.decoded?.isAdmin ? (
                      <p className="text-green-700 font-bold mt-2">✅ Token has admin role</p>
                    ) : (
                      <p className="text-red-700 font-bold mt-2">❌ Token does NOT have admin role</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-red-600 text-lg font-semibold mb-2">❌ Token is Invalid</p>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(tokenVerification, null, 2)}
                    </pre>
                    <p className="text-red-700 font-bold mt-2">You need to re-login!</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No token to verify</p>
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
