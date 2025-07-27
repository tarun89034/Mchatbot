import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, Shield, Palette, Download, Trash2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    crisisAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    crashReports: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const exportData = () => {
    // This would typically make an API call to export user data
    alert('Data export feature would be implemented here');
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // This would typically make an API call to delete the account
      alert('Account deletion would be implemented here');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member since</label>
            <input
              type="text"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Daily Reminders</p>
              <p className="text-sm text-gray-600">Get reminded to check in with your mood</p>
            </div>
            <button
              onClick={() => handleNotificationChange('dailyReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.dailyReminders ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.dailyReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-600">Receive weekly mood and progress summaries</p>
            </div>
            <button
              onClick={() => handleNotificationChange('weeklyReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Crisis Alerts</p>
              <p className="text-sm text-gray-600">Important notifications for mental health support</p>
            </div>
            <button
              onClick={() => handleNotificationChange('crisisAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.crisisAlerts ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.crisisAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Share anonymized data for research purposes</p>
            </div>
            <button
              onClick={() => handlePrivacyChange('dataSharing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.dataSharing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Usage Analytics</p>
              <p className="text-sm text-gray-600">Help improve the app with usage data</p>
            </div>
            <button
              onClick={() => handlePrivacyChange('analytics')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.analytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Crash Reports</p>
              <p className="text-sm text-gray-600">Automatically send crash reports to help fix issues</p>
            </div>
            <button
              onClick={() => handlePrivacyChange('crashReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.crashReports ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.crashReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        </div>

        <div className="space-y-4">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data</span>
          </button>

          <div className="border-t border-gray-200 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={deleteAccount}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={logout}
          className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;