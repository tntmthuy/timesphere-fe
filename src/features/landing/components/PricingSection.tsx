// import { PageSectionWrapper } from "./PageSectionWrapper";
import { PlanCard } from "./PlanCard";

export const PricingSection = () => {
  return (
    <section id="pricing" className="bg-[#FFDE70] px-0 py-20 text-black">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold inline-block px-4 py-1 rounded-md">
            Choose Your Plan
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <PlanCard
            duration="7 Days"
            price="$2.99"
            features={["All core features", "No ads", "Priority support"]}
          />
          <PlanCard
            duration="1 Month"
            price="$7.99"
            features={[
              "Everything in 7-day plan",
              "Sync across devices",
              "Usage reports",
            ]}
          />
          <PlanCard
            duration="1 Year"
            price="$59.99"
            features={[
              "All features",
              "Early access to new tools",
              "Dedicated support",
            ]}
            isPopular
          />
        </div>
      </div>
    </section>
  );
};
