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
  Upload02Icon,
  SentIcon,
  Folder01Icon,
} from "hugeicons-react";
import { getFileTypeConfig } from "../../utils/fileTypeUtils";
import portfolioWork1 from "../../assets/portfolio_work_1.png";
import portfolioWork2 from "../../assets/portfolio_work_2.png";

export interface DeliverableFile {
  id: string;
  name: string;
  size: number;
  type?: string;
  uploadedAt: string;
  url?: string;
  downloadUrl?: string;
  previewUrl?: string;
  hash: string;
}

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
    deliverables?: DeliverableFile[];
  };
}

const DEFAULT_DELIVERABLES: DeliverableFile[] = [
  {
    id: "1",
    name: "IG_Campaign_Wireframes_v1.pdf",
    size: 2516582,
    uploadedAt: "Oct 19, 2026",
    type: "pdf",
    hash: "sha256-8f4b23a1c90e451b6d77e43922110cfa8201bcf559e1029348ba982341ac9012",
  },
  {
    id: "del-2",
    name: "Social_Banner_Visuals.jpg",
    size: 1887436,
    type: "image/jpeg",
    uploadedAt: "Oct 19, 2026",
    hash: "sha256-8f4b23a1c90e451b6d77e43922110cfa8201bcf559e1029348ba982341ac9012",
  },
  {
    id: "del-3",
    name: "Brand_Identity_Assets.fig",
    size: 4404019,
    type: "application/octet-stream",
    uploadedAt: "Oct 19, 2026",
    hash: "sha256-d41d8cd98f00b204e9800998ecf8427e9981240188b43f9a76d1e43849102cba",
  },
];

export default function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  // Converted step system to support details, upload, and internal preview transitions
  const [step, setStep] = useState<"details" | "upload" | "preview">("details");
  const [selectedDeliverable, setSelectedDeliverable] =
    useState<DeliverableFile | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("details");
    setSelectedDeliverable(null);
    onClose();
  };

  const handleDeliverableClick = (file: DeliverableFile) => {
    setSelectedDeliverable(file);
    setStep("preview");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = (file: DeliverableFile) => {
    if (file.downloadUrl) {
      const a = document.createElement("a");
      a.href = file.downloadUrl;
      a.download = file.name;
      a.click();
    } else {
      const blob = new Blob(["Mock deliverable payload: " + file.name], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
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

  const deliverablesList = project?.deliverables || DEFAULT_DELIVERABLES;

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
            custom={step === "details" ? -1 : 1}
          >
            {step === "details" && (
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

                  <div className="w-full flex flex-col gap-[8px]">
                    {deliverablesList.map((file) => {
                      const config = getFileTypeConfig(file.name, file.type);
                      const IconComponent = config.icon;
                      return (
                        <div
                          key={file.id}
                          onClick={() => handleDeliverableClick(file)}
                          className="w-full h-[66px] bg-[#FCFCFC] hover:bg-[#F5F6F8] transition-colors rounded-[8px] p-[13px] flex items-center justify-between select-none cursor-pointer border border-[#E5E7EB]/50"
                        >
                          <div className="flex items-center gap-[12px] truncate">
                            <div
                              className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0"
                              style={{ backgroundColor: config.bgColor }}
                            >
                              <IconComponent
                                size={22}
                                color={config.color}
                                className="w-[22px] h-[22px] shrink-0"
                              />
                            </div>
                            <div className="flex flex-col items-start text-left gap-[2px] truncate">
                              <span className="text-[13px] font-medium leading-none text-[#000000] truncate max-w-[190px]">
                                {file.name}
                              </span>
                              <span className="text-[13px] font-normal leading-none text-[#6B7280]">
                                {formatFileSize(file.size)} • {config.label}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file);
                            }}
                            className="p-1 text-black hover:text-[#0048B3] transition-colors outline-none cursor-pointer flex items-center justify-center shrink-0"
                            aria-label="Download document"
                          >
                            <Download02Icon
                              size={24}
                              className="w-[24px] h-[24px] shrink-0"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === "upload" && (
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

            {step === "preview" &&
              selectedDeliverable &&
              (() => {
                const config = getFileTypeConfig(
                  selectedDeliverable.name,
                  selectedDeliverable.type,
                );
                const IconComponent = config.icon;
                const previewImage =
                  selectedDeliverable.previewUrl ||
                  (config.category === "image"
                    ? portfolioWork2
                    : portfolioWork1);

                return (
                  /* STEP 3: PREVIEW DELIVERABLE */
                  <motion.div
                    key="preview"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full max-w-[358px] mx-auto flex flex-col gap-[20px]"
                  >
                    {/* Header Navigation */}
                    <div className="w-full flex items-center gap-[12px]">
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
                      <div className="flex items-center gap-[10px] min-w-0 flex-1 text-left">
                        <div
                          className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: config.bgColor }}
                        >
                          <IconComponent
                            size={20}
                            color={config.color}
                            className="shrink-0"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <h3 className="text-[16px] font-medium leading-[22px] text-[#0D0D0D] tracking-[-0.01em] truncate">
                            {selectedDeliverable.name}
                          </h3>
                          <p className="text-[12px] font-normal leading-[16px] text-[#9E9E9E] truncate">
                            {formatFileSize(selectedDeliverable.size)} •{" "}
                            {config.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Deliverable Visual Content Card */}
                    <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[14px] flex flex-col items-center gap-[12px] border border-[#E5E7EB]/60">
                      <div className="w-full max-h-[300px] overflow-hidden rounded-[16px] bg-[#F5F6F8] flex items-center justify-center relative select-none">
                        {config.category === "image" ||
                        config.category === "pdf" ? (
                          <img
                            src={previewImage}
                            alt={selectedDeliverable.name}
                            className="w-full h-[220px] object-cover rounded-[16px]"
                          />
                        ) : (
                          <div className="w-full h-[220px] bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-[16px] flex flex-col items-center justify-center gap-[12px] p-[20px]">
                            <div className="w-[56px] h-[56px] rounded-[18px] bg-white shadow-sm flex items-center justify-center">
                              <IconComponent size={30} color={config.color} />
                            </div>
                            <div className="text-center">
                              <span className="text-[14px] font-medium text-[#0D0D0D] block">
                                {config.label}
                              </span>
                              <span className="text-[12px] text-[#6B7280]">
                                {selectedDeliverable.name}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-[10px] right-[10px]">
                          <span className="text-[11px] font-medium text-white/95 bg-black/60 backdrop-blur-md px-[10px] py-[4px] rounded-full">
                            {config.label}
                          </span>
                        </div>
                      </div>

                      {/* Checksum Verification */}
                      <div className="w-full flex items-center justify-between text-left px-[4px] pt-[2px]">
                        <div className="flex flex-col min-w-0 pr-[8px]">
                          <span className="text-[12px] font-medium text-[#0D0D0D] truncate">
                            Deliverable Checksum
                          </span>
                          <span className="text-[10px] font-mono text-[#6B7280] truncate">
                            {selectedDeliverable.hash}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-[8px] py-[3px] rounded-full flex items-center gap-[4px] shrink-0">
                          <CheckmarkCircle02Icon size={12} />
                          <span>Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-[10px]">
                      <button
                        type="button"
                        onClick={() => handleDownload(selectedDeliverable)}
                        className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] flex items-center justify-center gap-[8px] text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
                      >
                        <Download02Icon size={18} />
                        <span>Download Deliverable</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
                      >
                        Back to details
                      </button>
                    </div>
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
