import React from 'react';
import { IoMdClose } from "react-icons/io";

interface LogModalProps {
  logs: { timestamp: Date; message: string }[];
  onClose: () => void;
}

const LogModal= ({ logs, onClose }: LogModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-gray-100 rounded-lg p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-100">Riwayat Tugas</h2>
          <div className="flex justify-end cursor-pointer text-gray-400">
            <IoMdClose onClick={onClose} />
          </div>
        </div>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="border-b border-gray-700 pb-2">
                <p className="text-xs sm:text-sm text-gray-400">{log.timestamp.toLocaleString()}</p>
                <p className="text-sm sm:text-base text-gray-200">{log.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Tidak ada riwayat yang tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogModal;
