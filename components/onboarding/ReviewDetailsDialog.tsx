"use client";

interface OnboardingData {
  name: string;
  email: string;
  country: string;
  business: string;
  organization_email: string;
  ad_account_ID: string;
  page_ID: string;
  pixel_ID: string;
  instagram_ID: string;
  whatsapp_ID: string;
}

interface ReviewDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onRestart: () => void;
  data: OnboardingData;
}

export default function ReviewDetailsDialog({
  isOpen,
  onClose,
  onComplete,
  onRestart,
  data
}: ReviewDetailsDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onComplete();
    onClose();
  };

  const handleRestart = () => {
    onRestart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Review Your Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Business Profile Section */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{data.name || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">{data.email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Business:</span>
                <span className="text-white ml-2">{data.business || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Country:</span>
                <span className="text-white ml-2">{data.country || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Ad Account Section */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              Ad Account Connection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Organization Email:</span>
                <span className="text-white ml-2">{data.organization_email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Ad Account ID:</span>
                <span className="text-white ml-2">{data.ad_account_ID || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Page ID:</span>
                <span className="text-white ml-2">{data.page_ID || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Pixel ID:</span>
                <span className="text-white ml-2">{data.pixel_ID || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">Instagram ID:</span>
                <span className="text-white ml-2">{data.instagram_ID || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400">WhatsApp ID:</span>
                <span className="text-white ml-2">{data.whatsapp_ID || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Skip Option */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> You can skip optional fields and add them later in your dashboard settings.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6">
          <button
            onClick={handleRestart}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Restart
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
