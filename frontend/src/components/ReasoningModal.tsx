import React, { useState } from 'react';

type ReasoningModalProps = {
  isOpen: boolean;
  title?: string;
  setIsReasonOpen : React.Dispatch<React.SetStateAction<boolean>>
  actionText?: string;
};

const ReasoningModal: React.FC<ReasoningModalProps> = ({
  isOpen,
  title = 'Provide a Reason',
  setIsReasonOpen,
  actionText = 'Confirm'
}) => {
  const [reason, setReason] = useState<string>('');

  

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl m-auto w-full p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason here..."
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={()=>setIsReasonOpen(false)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={()=>{}}
            disabled={!reason.trim()}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              reason.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasoningModal;
