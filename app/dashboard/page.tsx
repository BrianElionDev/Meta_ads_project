"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateCampaignDialog from "../../components/dashboard/CreateCampaignDialog";

export default function DashboardPage() {
  const router = useRouter();
  const [showCreateCampaignDialog, setShowCreateCampaignDialog] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => router.push("/campaigns")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">My Campaigns</p>
              <p className="text-gray-600 text-sm">Manage and monitor all your advertising campaigns</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => setShowCreateCampaignDialog(true)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Create Campaign</p>
              <p className="text-gray-600 text-sm">Start building your next advertising campaign</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-500 text-center">
          Click on "Create Campaign" to start building your next advertising campaign. Choose between creating a new campaign from scratch or reusing an existing successful campaign as a template.
        </p>
      </div>


      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        isOpen={showCreateCampaignDialog}
        onClose={() => setShowCreateCampaignDialog(false)}
      />
    </div>
  );
}
