// src/features/subscription/components/PlanCheckoutSidebar.tsx

import { useEffect, useState } from "react";

type SubscriptionPlan = {
  type: "WEEKLY" | "MONTHLY" | "YEARLY";
  price: number;
  currency: string;
  displayName: string;
};

type Props = {
  plan: SubscriptionPlan;
  onConfirm: () => void;
  onClose: () => void;
};

export const PlanCheckoutSidebar = ({ plan, onConfirm, onClose }: Props) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose(); // chỉ gọi khi animation xong
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className={`flex h-full w-[400px] flex-col bg-white shadow-lg ${
          isClosing ? "animate-slideout" : "animate-slidein"
        }`}
      >
        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-bold text-yellow-900">Checkout Plan</h2>
            <button
              className="text-sm text-yellow-700 hover:underline cursor-pointer"
              onClick={() => setIsClosing(true)}
            >
              ✕ Close
            </button>
          </div>

          <p className="mb-2 text-sm text-yellow-800">
            <span className="font-semibold">Plan:</span> {plan.displayName} ({plan.type})
          </p>
          <p className="mb-6 text-sm text-yellow-800">
            <span className="font-semibold">Price:</span> ${plan.price.toFixed(2)} {plan.currency}
          </p>

          <p className="text-[13px] text-yellow-600 italic">
            This plan is valid for{" "}
            {plan.type === "WEEKLY"
              ? "7 days"
              : plan.type === "MONTHLY"
              ? "30 days"
              : "1 year"}
            . Manual renewal required.
          </p>
        </div>

        {/* Gạch và nút cố định ở cuối */}
        <div className="x-6 py-4">
          <div className="px-6 pt-4">
            <div className="flex justify-center py-4">
              <div className="w-[100%] border-t border-gray-300" />
            </div>
            <button
              className="w-full rounded bg-yellow-500 px-5 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
              onClick={onConfirm}
            >
              Pay with PayPal
            </button>
          </div>
        </div>
      </div>

      {/* Animation definitions */}
      <style>{`
        @keyframes slidein {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideout {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .animate-slidein {
          animation: slidein 0.3s ease-out forwards;
        }
        .animate-slideout {
          animation: slideout 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};