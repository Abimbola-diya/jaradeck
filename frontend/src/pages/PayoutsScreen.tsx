import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheetModal } from "../components/ui/BottomSheetModal";
import { ArrowLeft02Icon, ArrowDown01Icon } from "hugeicons-react";
import { useAuthStore } from "../context/AuthContext";
import bankIsometricSvg from "../assets/bank_isometric_3d.png";
import profileSuccessBadgeImg from "../assets/profile_success_badge.png";
import payoutOptionNgnSvg from "../assets/payout_option_ngn.svg";
import payoutOptionCryptoSvg from "../assets/payout_option_crypto.svg";
import payoutChevronRightSvg from "../assets/payout_chevron_right.svg";
import payoutSquareLockSvg from "../assets/payout_square_lock.svg";
import { SelectField } from "../components/ui/SelectField";

const NIGERIAN_BANKS = [
  "Guaranty Trust Bank",
  "Access Bank",
  "Zenith Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Kuda Bank",
  "Opay",
  "Palmpay",
];

export const PayoutsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [isAccountLinked, setIsAccountLinked] = useState<boolean>(
    Boolean(user?.payouts_configured),
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<"select" | "bank_ngn" | "success">(
    "select",
  );
  const [selectedMethod, setSelectedMethod] = useState<"ngn" | "crypto">("ngn");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "verified"
  >("idle");

  // Automatic verification after 10 digits
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (accountNumber.length === 10) {
      setVerificationStatus("verifying");
      timer = setTimeout(() => {
        setVerificationStatus("verified");
        setAccountName("Adeyemi Christiana");
      }, 1200);
    } else {
      setVerificationStatus("idle");
      setAccountName("");
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [accountNumber]);

  // Preview support via URL hash / params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (url.includes("1547-2733") || url.includes("linked")) {
        setIsAccountLinked(true);
        setSelectedBank("Guaranty Trust Bank");
        setAccountNumber("11006776712");
        setAccountName("Adeyemi Christiana");
      } else if (url.includes("1547-2563") || url.includes("step=success")) {
        setIsModalOpen(true);
        setModalStep("success");
      }
    }
  }, []);

  const handleAddPayoutAccount = () => {
    setSelectedBank("");
    setAccountNumber("");
    setAccountName("");
    setVerificationStatus("idle");
    setIsModalOpen(true);
    setModalStep("select");
  };

  const handleEditPayoutDetails = () => {
    setIsModalOpen(true);
    setModalStep("bank_ngn");
  };

  const handleCloseModal = () => {
    if (modalStep === "success") {
      setIsAccountLinked(true);
    } else if (!isAccountLinked) {
      setSelectedBank("");
      setAccountNumber("");
      setAccountName("");
      setVerificationStatus("idle");
    }
    setIsModalOpen(false);
    setTimeout(() => {
      setModalStep("select");
    }, 300);
  };

  const handleSelectNgn = () => {
    setSelectedMethod("ngn");
    setModalStep("bank_ngn");
  };

  const handleContinue = () => {
    if (modalStep === "select") {
      if (selectedMethod === "ngn") {
        setModalStep("bank_ngn");
      }
    } else if (modalStep === "bank_ngn") {
      if (!selectedBank) setSelectedBank("Guaranty Trust Bank");
      if (!accountNumber) setAccountNumber("11006776712");
      if (!accountName) setAccountName("Adeyemi Christiana");
      setModalStep("success");
    }
  };

  return (
    <div
      id="payouts-screen"
      className="w-full max-w-[390px] min-h-screen bg-white mx-auto flex flex-col items-center justify-between pt-[40px] px-[20px] pb-[100px] relative text-left select-none overflow-hidden font-sans"
    >
      {/* Top Container: Header Bar & Details */}
      <div className="w-[350px] flex flex-col items-start gap-[24px]">
        {/* Header Bar */}
        <div className="w-[350px] h-[44px] flex items-center gap-[24px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-[44px] h-[44px] rounded-full bg-[#FCFCFC] flex items-center justify-center cursor-pointer hover:bg-[#F3F4F6] active:scale-95 transition-all outline-none shrink-0"
            aria-label="Back"
          >
            <ArrowLeft02Icon size={24} color="#141B34" />
          </button>

          <h1 className="text-[20px] font-medium leading-[24px] text-[#272931]">
            Payouts
          </h1>
        </div>

        {/* Linked Account Details */}
        {isAccountLinked && (
          <div className="w-[350px] flex flex-col gap-[16px] items-start animate-fadeIn">
            {/* Card 1: Bank Account - Nigerian */}
            <div className="w-full h-[62px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <img
                  src={payoutOptionNgnSvg}
                  alt="Bank"
                  className="w-[24px] h-[24px] object-contain shrink-0"
                />
                <span className="text-[14px] font-medium leading-[30px] text-[#0D0D0D]">
                  Bank Account - Nigerian
                </span>
              </div>
            </div>

            {/* Field 2: Bank name */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                Bank name
              </label>
              <div className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between">
                <span className="text-[14px] font-medium leading-[30px] text-[#0D0D0D]">
                  {selectedBank || "Guaranty Trust Bank"}
                </span>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className="shrink-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Field 3: Account number */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                Account number
              </label>
              <div className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center">
                <span className="text-[14px] font-medium leading-[30px] text-[#0D0D0D]">
                  {accountNumber || "11006776712"}
                </span>
              </div>
            </div>

            {/* Field 4: Account name */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                Account name
              </label>
              <div className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center">
                <span className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                  {accountName || "Adeyemi Christiana"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* When NOT linked: Hero & Action Container */}
      {!isAccountLinked && (
        <div className="w-[350px] flex flex-col items-center gap-[32px] my-auto animate-fadeIn">
          <div className="w-[263px] flex flex-col items-center gap-[4px] text-center">
            <img
              src={bankIsometricSvg}
              alt="Bank building"
              className="w-[178px] h-[118px] object-contain pointer-events-none select-none"
            />

            <div className="flex flex-col items-center gap-[4px] w-full max-w-[290px]">
              <h2 className="text-[14px] font-medium leading-[30px] text-[#0D0D0D] text-center">
                Add a payout account
              </h2>

              <p className="w-full text-[12px] font-medium leading-[18px] text-[#7B7B7B] text-center">
                <span className="block whitespace-nowrap">
                  Link your preferred payout account to start earning
                </span>
                <span className="block whitespace-nowrap">commission free</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddPayoutAccount}
            className={`w-[350px] h-[44px] ${
              isModalOpen ? "bg-[#6B7280]" : "bg-[#0048B3] hover:bg-[#003A91]"
            } active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none`}
          >
            <span>Add payout account</span>
          </button>
        </div>
      )}

      {/* When linked: Edit Payout Details CTA Button */}
      {isAccountLinked && (
        <div className="w-[350px] mt-auto pt-[24px] animate-fadeIn">
          <button
            type="button"
            onClick={handleEditPayoutDetails}
            className="w-[350px] h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
          >
            <span>Edit payout details</span>
          </button>
        </div>
      )}

      {/* Bottom Sheet Modal */}
      <BottomSheetModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalStep === "select" ? (
          <div className="w-full flex flex-col gap-[24px] items-start animate-fadeIn">
            <div className="w-full flex flex-col gap-[16px] items-start">
              <div className="w-full flex flex-col gap-[4px] items-start text-left">
                <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
                  Add a payout account
                </h3>
                <p className="w-full max-w-[290px] text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                  <span className="block whitespace-nowrap">
                    Link your preferred payout account to start earning
                  </span>
                  <span className="block whitespace-nowrap">
                    commission free
                  </span>
                </p>
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <button
                  type="button"
                  onClick={handleSelectNgn}
                  className="w-full h-[62px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none hover:bg-gray-50 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-[8px]">
                    <img
                      src={payoutOptionNgnSvg}
                      alt="Bank"
                      className="w-[24px] h-[24px] object-contain shrink-0"
                    />
                    <span className="text-[14px] font-medium leading-[30px] text-[#0D0D0D]">
                      Bank Account - Nigerian
                    </span>
                  </div>
                  <img
                    src={payoutChevronRightSvg}
                    alt="Arrow"
                    className="w-[6px] h-[10px] object-contain shrink-0"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("crypto")}
                  className="w-full h-[62px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none hover:bg-gray-50 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-[8px]">
                    <img
                      src={payoutOptionCryptoSvg}
                      alt="Stablecoin"
                      className="w-[24px] h-[24px] object-contain shrink-0"
                    />
                    <span className="text-[14px] font-medium leading-[30px] text-[#6B7280]">
                      Stablecoin
                    </span>
                  </div>
                  <img
                    src={payoutSquareLockSvg}
                    alt="Locked"
                    className="w-[24px] h-[24px] object-contain shrink-0 opacity-80"
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
            >
              <span>Continue</span>
            </button>
          </div>
        ) : modalStep === "bank_ngn" ? (
          <div className="w-full flex flex-col gap-[24px] items-start animate-fadeIn">
            <div className="w-full flex flex-col gap-[16px] items-start">
              <div className="w-full flex flex-col gap-[4px] items-start text-left">
                <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
                  Add a payout account
                </h3>
                <p className="w-full max-w-[290px] text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                  <span className="block whitespace-nowrap">
                    Link your preferred payout account to start earning
                  </span>
                  <span className="block whitespace-nowrap">
                    commission free
                  </span>
                </p>
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <button
                  type="button"
                  onClick={() => setModalStep("select")}
                  className="w-full h-[62px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none hover:bg-gray-50 active:scale-[0.99]"
                  title="Change payout method"
                >
                  <div className="flex items-center gap-[8px]">
                    <img
                      src={payoutOptionNgnSvg}
                      alt="Bank"
                      className="w-[24px] h-[24px] object-contain shrink-0"
                    />
                    <span className="text-[14px] font-medium leading-[30px] text-[#0D0D0D]">
                      Bank Account - Nigerian
                    </span>
                  </div>
                  <img
                    src={payoutChevronRightSvg}
                    alt="Arrow"
                    className="w-[6px] h-[10px] object-contain shrink-0"
                  />
                </button>

                <div className="w-full">
                  <SelectField
                    label="Bank name"
                    placeholder="Select the bank"
                    value={selectedBank}
                    options={NIGERIAN_BANKS}
                    onChange={(val) => setSelectedBank(val)}
                    maxMenuHeight="max-h-[154px]"
                    className="w-full"
                  />
                </div>

                <div className="w-full flex flex-col gap-[8px] items-start text-left">
                  <label className="w-full text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                    Account number
                  </label>
                  <div className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) =>
                        setAccountNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="What’s your account number?"
                      className="w-full bg-transparent text-[14px] font-medium leading-[30px] text-[#0D0D0D] placeholder-[#9E9E9E] outline-none"
                    />
                  </div>

                  {verificationStatus !== "idle" && (
                    <div className="w-full text-left pl-[2px] -mt-[2px] animate-fadeIn">
                      {verificationStatus === "verifying" ? (
                        <span className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                          Verifying......
                        </span>
                      ) : (
                        <span className="text-[12px] font-medium leading-[18px] text-[#0048B3] animate-fadeIn">
                          {accountName || "Adeyemi Christiana"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none shrink-0"
            >
              <span>Continue</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-[24px] py-[4px] text-center animate-fadeIn select-none">
            <img
              src={profileSuccessBadgeImg}
              alt="Success"
              className="w-[88px] h-[90px] object-contain animate-badge-pop select-none pointer-events-none"
            />

            <div className="w-full flex flex-col items-center gap-[8px] text-center">
              <h3 className="text-[24px] font-medium leading-[29px] text-[#0A0A0A] tracking-[-0.01em]">
                Successful!
              </h3>

              <p className="max-w-[271px] text-[14px] font-normal leading-[21px] text-[#7B7B7B] text-center">
                Your payout account has been linked successfully.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none shrink-0"
            >
              <span>Done</span>
            </button>
          </div>
        )}
      </BottomSheetModal>
    </div>
  );
};
