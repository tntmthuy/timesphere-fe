import { PlanCard } from "./PlanCard";

export const PricingSection = () => {
  const sharedFeatures = [
    "All features included",
    "No ads",
    "Sync across devices",
    "Priority support",
  ];

  return (
    <section id="pricing" className="bg-[#FFDE70] px-0 py-20 text-black">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold inline-block px-4 py-1 rounded-md">
            Choose Your Plan
          </h2>
          <p className="text-sm text-yellow-900 mt-2">
            Same features, just better value over time!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <PlanCard
            duration="Weekly"
            price="$1.00"
            features={sharedFeatures}
          />
          <PlanCard
            duration="Monthly"
            price="$3.00"
            features={sharedFeatures}
          />
          <PlanCard
            duration="Yearly"
            price="$25.00"
            features={sharedFeatures}
            isPopular
          />
        </div>
      </div>
    </section>
  );
};