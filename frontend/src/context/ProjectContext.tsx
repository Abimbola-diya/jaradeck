import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import portfolioWork1 from "../assets/portfolio_work_1.png";
import portfolioWork2 from "../assets/portfolio_work_2.png";
import marcusAvatarSvg from "../assets/marcus_avatar.svg";

export interface DeliverableFile {
  id: string;
  name: string;
  type: string;
  size: number;
  hash?: string;
  previewUrl?: string;
  downloadUrl?: string;
  uploadedAt?: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface ProjectContract {
  id: string;
  title: string;
  payeeName: string;
  payeeAvatar?: string;
  totalAmount: number;
  milestoneAmount: number;
  txHash?: string;
  status: "pending" | "funded" | "in_progress" | "delivered" | "released" | "disputed";
}

export type EscrowPaymentMethod = "wallet" | "card" | "crypto";

export interface ProjectContextValue {
  contract: ProjectContract;
  deliverables: DeliverableFile[];
  freelancerNote: string;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
  fundEscrow: (method: EscrowPaymentMethod) => Promise<ActionResult>;
  approveAndReleaseEscrow: (pin: string) => Promise<ActionResult>;
  submitReview: (rating: number, comment: string) => Promise<ActionResult>;
  requestRevision: (feedback: string) => Promise<ActionResult>;
}

const DEFAULT_CONTRACT: ProjectContract = {
  id: "contract_001",
  title: "Social Media Management",
  payeeName: "Marcus Vance",
  payeeAvatar: marcusAvatarSvg,
  totalAmount: 45000,
  milestoneAmount: 22500,
  txHash: "0x4c9e81d2f78a",
  status: "delivered",
};

const DEFAULT_DELIVERABLES: DeliverableFile[] = [
  {
    id: "file_001",
    name: "social-media-calendar.fig",
    type: "image/png",
    size: 2411520,
    previewUrl: portfolioWork1,
  },
  {
    id: "file_002",
    name: "campaign-assets.zip",
    type: "application/zip",
    size: 15728640,
    previewUrl: portfolioWork2,
  },
];

const DEFAULT_NOTE =
  "All 15 creatives are ready for review. The calendar covers the full launch month with captions and hashtags included.";

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contract, setContract] = useState<ProjectContract>(DEFAULT_CONTRACT);
  const [deliverables] = useState<DeliverableFile[]>(DEFAULT_DELIVERABLES);
  const [freelancerNote] = useState<string>(DEFAULT_NOTE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const runAction = useCallback(
    async (
      pendingStatus: ProjectContract["status"],
      nextStatus: ProjectContract["status"],
    ): Promise<ActionResult> => {
      setIsProcessing(true);
      setError(null);
      setContract((prev) => ({ ...prev, status: pendingStatus }));
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setContract((prev) => ({ ...prev, status: nextStatus }));
        return { success: true };
      } catch {
        const message = "Something went wrong. Please try again.";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  const fundEscrow = useCallback(
    async (_method: EscrowPaymentMethod) => runAction("pending", "funded"),
    [runAction],
  );

  const approveAndReleaseEscrow = useCallback(
    async (_pin: string) => runAction("funded", "released"),
    [runAction],
  );

  const submitReview = useCallback(
    async (_rating: number, _comment: string) => runAction("released", "released"),
    [runAction],
  );

  const requestRevision = useCallback(
    async (_feedback: string) => runAction("delivered", "in_progress"),
    [runAction],
  );

  const value = useMemo<ProjectContextValue>(
    () => ({
      contract,
      deliverables,
      freelancerNote,
      isProcessing,
      error,
      clearError,
      fundEscrow,
      approveAndReleaseEscrow,
      submitReview,
      requestRevision,
    }),
    [
      contract,
      deliverables,
      freelancerNote,
      isProcessing,
      error,
      clearError,
      fundEscrow,
      approveAndReleaseEscrow,
      submitReview,
      requestRevision,
    ],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }

  return context;
};
