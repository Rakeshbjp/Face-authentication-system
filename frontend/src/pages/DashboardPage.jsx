/**
 * Dashboard Page — Protected route shown after full authentication.
 * Includes option to add/update face data if missing.
 */
import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import FaceCaptureRegistration from '../components/face/FaceCaptureRegistration';
import { updateFaceData } from '../services/authService';
import Spinner from '../components/ui/Spinner';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [showFaceSetup, setShowFaceSetup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const hasFaceData = user?.has_face_data ?? user?.liveness_verified ?? false;

  /**
   * Handle face capture completion — send to update-face endpoint.
   */
  const handleFaceCaptureComplete = useCallback(async (faceImages) => {
    setIsUpdating(true);
    try {
      const result = await updateFaceData(faceImages);
      if (result.status) {
        toast.success(result.message || 'Face data updated successfully!');
        setShowFaceSetup(false);
      } else {
        toast.error(result.message || 'Failed to update face data');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = Array.isArray(detail) ? detail.map(e => e.msg).join(', ') : detail || 'Failed to update face data';
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-500">You are securely authenticated</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Face Verified
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-gray-900 font-medium">{user?.name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-gray-900 font-medium">{user?.phone || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-gray-900 font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Face Data Setup Card — shown when no face data exists */}
        {!hasFaceData && !showFaceSetup && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Face Data Not Set Up</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your account doesn't have face recognition data. Set it up now to enable secure face-based login.
                </p>
                <button
                  onClick={() => setShowFaceSetup(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                >
                  📷 Set Up Face Recognition
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Face Capture Modal */}
        {showFaceSetup && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Set Up Face Recognition</h2>
            {isUpdating ? (
              <div className="text-center py-12">
                <Spinner size="lg" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Processing face data...</h3>
                <p className="text-gray-500 mt-2">Please wait while we verify and store your face data.</p>
              </div>
            ) : (
              <>
                <FaceCaptureRegistration
                  onCaptureComplete={handleFaceCaptureComplete}
                  onCancel={() => setShowFaceSetup(false)}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowFaceSetup(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel face setup
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Password authenticated</span>
            </div>
            <div className="flex items-center gap-3">
              {hasFaceData ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
              <span className="text-gray-700">
                {hasFaceData ? 'Face recognition verified' : 'Face recognition not set up'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Encrypted session active</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Anti-spoofing liveness verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
