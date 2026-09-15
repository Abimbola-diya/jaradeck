import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Folder, Upload, Send } from "lucide-react";

export interface UploadDeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  projectTitle?: string;
  clientName?: string;
  milestoneTitle?: string;
  onSubmit?: () => void;
}

export const UploadDeliverablesModal: React.FC<UploadDeliverablesModalProps> = ({
  isOpen,
  onClose,
  onBack,
  projectTitle = "Social Media Management",
  clientName = "Sarah Jenkins",
  milestoneTitle = "Milestone 2: Final Wireframes",
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
        {/* Backdrop Click */}
        <motion.div
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Slide-Right Modal Content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-md h-full bg-slate-50 p-6 overflow-y-auto shadow-2xl border-l border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={onBack || onClose}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none"
              aria-label="Back or Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Upload Deliverables
              </h1>
              <p className="text-xs text-slate-400">{milestoneTitle}</p>
            </div>
          </div>

          {/* Info Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs mb-2">
              <Folder className="w-4 h-4" />
              <span>Project: {projectTitle}</span>
            </div>
            <h2 className="font-bold text-slate-900 text-sm mb-1">
              Submitting to {clientName}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure all files related to the &quot;Final Wireframes&quot; milestone are
              included before submitting. Accepted formats: PDF, ZIP, FIG, PNG
            </p>
          </div>

          {/* Drop Zone */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Upload Deliverables
            </h3>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to browse or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Maximum file size 50MB
              </p>
            </div>
          </div>

          {/* Message Field */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-900 text-sm">
                Message to Client
              </label>
              <span className="text-xs text-slate-400">Optional</span>
            </div>
            <textarea
              rows={4}
              placeholder="Add any notes, links, or context Sarah needs to review this deliverable..."
              className="w-full p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pb-8">
            <button
              type="button"
              onClick={onSubmit || onClose}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer outline-none transition-all"
            >
              Submit for Review <Send className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-full hover:bg-slate-100 cursor-pointer outline-none transition-colors"
            >
              Save as draft
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadDeliverablesModal;