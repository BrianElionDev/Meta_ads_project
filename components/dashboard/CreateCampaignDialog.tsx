"use client";

import { useRouter } from "next/navigation";

interface CreateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignDialog({
  isOpen,
  onClose,
}: CreateCampaignDialogProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCreateCampaign = () => {
    onClose();
    router.push("/create-campaign");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full mx-4 border border-gray-700/50">
        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Create New Campaign
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Build a complete advertising campaign with campaign, ad set, and ad
            creative in one streamlined flow.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                Campaign setup with objectives and budget
              </span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">
                Ad set configuration and targeting
              </span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Ad creative design and content</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCampaign}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
