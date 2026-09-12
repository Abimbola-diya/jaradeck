import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft02Icon,
  Calendar04Icon,
  Money01Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  Clock01Icon,
  Download02Icon,
  Pdf01Icon,
  Upload02Icon,
  SentIcon,
  Folder01Icon,
} from "hugeicons-react";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload?: () => void;
  project?: {
    title?: string;
    clientName?: string;
    duration?: string;
    budget?: string;
    description?: string;
  };
}

export default function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  const [step, setStep] = useState<"details" | "upload">("details");

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("details");
    onClose();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal Sheet Container */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-[390px] max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-t-[32px] bg-white p-[24px_16px_40px_16px] border-t border-slate-100 no-scrollbar"
        >
          {/* Sheet Handle */}
          <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-6 shrink-0" />

          <AnimatePresence
            initial={false}
            mode="wait"
            custom={step === "upload" ? 1 : -1}
          >
            {step === "details" ? (
              /* STEP 1: PROJECT DETAILS */
              <motion.div
                key="details"
                custom={-1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full max-w-[358px] mx-auto flex flex-col gap-[24px]"
              >
                {/* Header Navigation */}
                <div className="w-full flex items-center gap-[16px]">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-[40px] h-[40px] rounded-full bg-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all shrink-0 outline-none"
                    aria-label="Close details modal"
                  >
                    <ArrowLeft02Icon
                      size={20}
                      color="#272931"
                      className="w-[20px] h-[20px] shrink-0"
                    />
                  </button>

                  <div className="flex flex-col gap-[2px] items-start text-left">
                    <h3 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931]">
                      Project details
                    </h3>
                    <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50">
                      Insight into the progress of the project
                    </p>
                  </div>
                </div>

                {/* Project Title & Metadata Section */}
                <div className="w-full flex flex-col gap-[16px] items-start text-left">
                  <div className="w-full flex flex-col gap-[8px]">
                    <h1 className="w-full text-[40px] font-medium leading-[44px] tracking-[-0.02em] text-[#000000]">
                      {project?.title || "Social Media\nManagement"}
                    </h1>
                    <p className="text-[16px] font-normal leading-[24px] text-[#6B7280]">
                      For {project?.clientName || "Sarah Jenkins"}.
                    </p>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-[8px]">
                    <div className="h-[28px] bg-[#F3F4F5] rounded-[12px] px-[12px] flex items-center gap-[6px]">
                      <Calendar04Icon
                        size={14}
                        color="#F43F5E"
                        className="w-[14px] h-[14px] shrink-0"
                      />
                      <span className="text-[14px] font-normal leading-none text-[#4C4546] flex items-center">
                        {project?.duration || "Oct 12 - Nov 30"}
                      </span>
                    </div>

                    <div className="h-[28px] bg-[#F3F4F5] rounded-[12px] px-[12px] flex items-center gap-[6px]">
                      <Money01Icon
                        size={14}
                        color="#10B981"
                        className="w-[14px] h-[14px] shrink-0"
                      />
                      <span className="text-[14px] font-normal leading-none text-[#4C4546] flex items-center">
                        {project?.budget || "$1,200 Total"}
                      </span>
                    </div>
                  </div>

                  {/* Separator Line & Description */}
                  <div className="w-full border-t border-[#E5E7EB] pt-[16px]">
                    <p className="text-[14px] font-normal leading-[20px] text-[#4C4546]">
                      {project?.description ||
                        "Complete overhaul of the client’s Instagram’s presence, including a new visual strategy, content calendar for 6 weeks, and community engagement protocols"}
                    </p>
                  </div>
                </div>

                {/* Milestones Timeline Section */}
                <div className="w-full flex flex-col gap-[24px]">
                  <h3 className="text-[24px] font-medium leading-[32px] tracking-[-0.01em] text-[#000000] text-left">
                    Milestones
                  </h3>

                  <div className="relative pl-[32px] flex flex-col gap-[32px] border-l-2 border-[#FCFCFC] ml-[10px]">
                    {/* Milestone 1 (Completed) */}
                    <div className="relative w-full">
                      <div className="absolute -left-[39px] top-[24px] w-[14px] h-[14px] rounded-full bg-[#10B981] ring-4 ring-white" />
                      <div className="w-full bg-[#FCFCFC] rounded-[8px] p-[20px] flex flex-col gap-[8px] text-left border border-[#E5E7EB]/50">
                        <div className="w-full flex items-start justify-between">
                          <h4 className="text-[14px] font-medium leading-[20px] text-black">
                            Milestone 1:
                            <br />
                            Wireframes & Strategy
                          </h4>
                          <div className="bg-white rounded-[7px] px-[7px] py-[5px] inline-flex items-center gap-[4px] border border-black/[0.03]">
                            <CheckmarkCircle02Icon
                              size={11}
                              color="#498905"
                              className="w-[11px] h-[11px] shrink-0"
                            />
                            <span className="text-[8px] font-medium leading-none text-[#498905] flex items-center">
                              Completed
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] font-normal leading-[20px] text-[#6B7280]">
                          Wireframe delivery approved. Payment for this
                          milestone have been released.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            console.log("View Milestone Details clicked")
                          }
                          className="mt-[4px] text-[14px] font-medium text-[#498905] inline-flex items-center gap-[4px] cursor-pointer hover:underline outline-none"
                        >
                          <span className="leading-none flex items-center">
                            View Milestone Details
                          </span>
                          <ArrowRight02Icon
                            size={13}
                            color="#498905"
                            className="w-[13px] h-[13px] shrink-0"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Milestone 2 (In Progress - Triggers Slide to Upload) */}
                    <div className="relative w-full">
                      <div className="absolute -left-[39px] top-[24px] w-[14px] h-[14px] rounded-full bg-[#0048B3] ring-4 ring-white" />
                      <div className="w-full bg-[#FCFCFC] rounded-[8px] p-[20px] flex flex-col gap-[8px] text-left border border-[#E5E7EB]/50">
                        <div className="w-full flex items-start justify-between">
                          <h4 className="text-[14px] font-medium leading-[20px] text-black">
                            Milestone 2:
                            <br />
                            Content Creation
                          </h4>
                          <div className="bg-white rounded-[7px] px-[7px] py-[5px] inline-flex items-center gap-[4px] border border-black/[0.03]">
                            <Loading03Icon
                              size={11}
                              color="#0048B3"
                              className="w-[11px] h-[11px] animate-spin shrink-0"
                            />
                            <span className="text-[8px] font-medium leading-none text-[#0048B3] flex items-center">
                              In Progress
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] font-normal leading-[20px] text-[#6B7280]">
                          Creation of first 15 posts including graphics, copy
                          and hashtag strategy.
                        </p>

                        <div className="mt-[8px]">
                          <button
                            type="button"
                            onClick={() => setStep("upload")}
                            className="h-[36px] px-[18px] rounded-[18px] bg-[#0048B3] text-white text-[12px] font-medium inline-flex items-center justify-center gap-[6px] cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all outline-none"
                          >
                            <span className="leading-none flex items-center">
                              Submit Work
                            </span>
                            <Download02Icon
                              size={14}
                              color="#FFFFFF"
                              className="w-[14px] h-[14px] shrink-0"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Milestone 3 (Upcoming) */}
                    <div className="relative w-full">
                      <div className="absolute -left-[39px] top-[24px] w-[14px] h-[14px] rounded-full bg-white border-2 border-[#D1D5DB] ring-4 ring-white" />
                      <div className="w-full bg-[#FCFCFC] rounded-[8px] p-[20px] flex flex-col gap-[8px] text-left border border-[#E5E7EB]/50">
                        <div className="w-full flex items-start justify-between">
                          <h4 className="text-[14px] font-medium leading-[20px] text-black">
                            Milestone 3:
                            <br />
                            Final Delivery & Handoff
                          </h4>
                          <div className="bg-white rounded-[7px] px-[7px] py-[5px] inline-flex items-center gap-[4px] border border-black/[0.03]">
                            <Clock01Icon
                              size={11}
                              color="#6E6E6E"
                              className="w-[11px] h-[11px] shrink-0"
                            />
                            <span className="text-[8px] font-medium leading-none text-[#6E6E6E] flex items-center">
                              Upcoming
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] font-normal leading-[20px] text-[#6B7280]">
                          Final batch of content and handover documentation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deliverables Section */}
                <div className="w-full flex flex-col gap-[16px]">
                  <div className="w-full flex items-center justify-between">
                    <h3 className="text-[24px] font-medium leading-[32px] tracking-[-0.01em] text-[#000000]">
                      Deliverables
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        console.log("View All Deliverables clicked")
                      }
                      className="text-[14px] font-medium leading-none text-[#0051D5] hover:underline outline-none cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="w-full h-[66px] bg-white border border-[#FCFCFC] rounded-[8px] p-[13px] flex items-center justify-between select-none shadow-sm">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[40px] h-[40px] rounded-[8px] bg-[#FFE4E6] flex items-center justify-center shrink-0">
                        <Pdf01Icon
                          size={22}
                          color="#E11D48"
                          className="w-[22px] h-[22px] shrink-0"
                        />
                      </div>
                      <div className="flex flex-col items-start text-left gap-[2px]">
                        <span className="text-[13px] font-medium leading-none text-[#000000]">
                          IG_Campaign_Wireframes_v1.pdf
                        </span>
                        <span className="text-[13px] font-normal leading-none text-[#6B7280]">
                          2.4 MB • PDF Document
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        console.log("Download deliverable file clicked")
                      }
                      className="p-1 text-black hover:text-[#0048B3] transition-colors outline-none cursor-pointer flex items-center justify-center"
                      aria-label="Download document"
                    >
                      <Download02Icon
                        size={24}
                        className="w-[24px] h-[24px] shrink-0"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: UPLOAD DELIVERABLES */
              <motion.div
                key="upload"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full max-w-[358px] mx-auto flex flex-col gap-[24px]"
              >
                {/* Header Navigation */}
                <div className="w-full flex items-center gap-[16px]">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-[40px] h-[40px] rounded-full bg-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all shrink-0 outline-none"
                    aria-label="Back to details"
                  >
                    <ArrowLeft02Icon
                      size={20}
                      color="#272931"
                      className="w-[20px] h-[20px] shrink-0"
                    />
                  </button>
                  <div className="flex flex-col gap-[2px] items-start text-left">
                    <h3 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931]">
                      Upload Deliverables
                    </h3>
                    <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50">
                      Milestone 2: Content Creation
                    </p>
                  </div>
                </div>

                {/* Project Context Box */}
                <div className="p-4 rounded-[12px] bg-[#FCFCFC] border border-[#E5E7EB] flex flex-col gap-[6px] text-left">
                  <div className="flex items-center gap-2 text-[#0048B3] font-medium text-[13px]">
                    <Folder01Icon size={16} color="#0048B3" />
                    <span>{project?.title || "Social Media Management"}</span>
                  </div>
                  <h4 className="text-[14px] font-medium text-[#272931]">
                    Submitting to {project?.clientName || "Sarah Jenkins"}
                  </h4>
                  <p className="text-[13px] text-[#6B7280] leading-[18px]">
                    Ensure all files for the "Content Creation" milestone are
                    included before submitting.
                  </p>
                </div>

                {/* File Dropzone */}
                <div className="w-full flex flex-col gap-[8px] text-left">
                  <span className="text-[14px] font-medium text-[#272931]">
                    Upload Deliverables
                  </span>
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-[16px] p-6 flex flex-col items-center justify-center bg-[#FCFCFC] hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center mb-2">
                      <Upload02Icon size={20} color="#0048B3" />
                    </div>
                    <p className="text-[13px] font-medium text-[#272931]">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-[11px] text-[#6B7280] mt-1">
                      Maximum file size 50MB (PDF, ZIP, PNG)
                    </p>
                  </div>
                </div>

                {/* Message Input */}
                <div className="w-full flex flex-col gap-[8px] text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-medium text-[#272931]">
                      Message to Client
                    </label>
                    <span className="text-[12px] text-[#6B7280]">Optional</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Add any notes or context Sarah needs to review this deliverable..."
                    className="w-full p-3 rounded-[12px] bg-[#FCFCFC] border border-[#E5E7EB] text-[13px] text-[#272931] placeholder-[#9E9E9E] focus:outline-none focus:border-[#0048B3] resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-[12px]">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full h-[41px] rounded-[21px] bg-[#0048B3] flex items-center justify-center gap-2 text-white text-[12px] font-medium hover:opacity-95 active:scale-[0.99] transition-all outline-none cursor-pointer"
                  >
                    <span>Submit for Review</span>
                    <SentIcon size={14} color="#FFFFFF" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-full h-[41px] rounded-[21px] border border-[#E5E7EB] text-[#272931] text-[12px] font-medium flex items-center justify-center hover:bg-slate-50 transition-colors outline-none cursor-pointer"
                  >
                    Back to details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
