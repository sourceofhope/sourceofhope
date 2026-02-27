import { useMemo, useState } from "react";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Bold from "../../../components/ui/text/Bold";
import MembersCheckoutSection from "./MembersCheckoutSection";

import {
  CheckCircleIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  HeartIcon,
} from "@heroicons/react/20/solid";

const IMPACT_MODEL = {
  dollarsPerMeal: 12.5,
  dollarsPerWellnessAssist: 25,
  dollarsPerStudentSupport: 40,
};

const COMPANIES = [
  {
    id: "partner",
    name: "Company Partner",
    priceMonthly: 50,
    note: "Sustains community outreach and program operations.",
    makesPossible: [
      "Supports meals, outreach supplies, and volunteer coordination",
      "Helps keep wellness and education programs accessible",
    ],
    recognition: [
      "Partner listing on website (optional)",
      "Quarterly partner impact update (optional)",
    ],
    includes: {
      "Sustains monthly meal outreach": true,
      "Supports wellness care access": true,
      "Supports education/mentorship": true,
      "Website partner listing (optional)": true,
      "Spotlight story (optional)": false,
      "Co-hosted volunteer day (optional)": false,
    },
  },
  {
    id: "sponsor",
    name: "Program Sponsor",
    priceMonthly: 100,
    note: "Expands capacity and strengthens sustained service.",
    makesPossible: [
      "Helps fund higher-volume outreach and program growth",
      "Supports care pathways for underserved community members",
    ],
    recognition: [
      "Website partner listing (optional)",
      "Spotlight story (optional)",
      "Priority coordination for volunteer participation (optional)",
    ],
    includes: {
      "Sustains monthly meal outreach": true,
      "Supports wellness care access": true,
      "Supports education/mentorship": true,
      "Website partner listing (optional)": true,
      "Spotlight story (optional)": true,
      "Co-hosted volunteer day (optional)": false,
    },
  },
  {
    id: "champion",
    name: "Impact Champion",
    priceMonthly: 500,
    note: "Helps underwrite major mission work across programs.",
    makesPossible: [
      "Helps underwrite recurring outreach, wellness, and education initiatives",
      "Strengthens rapid response for urgent community needs",
    ],
    recognition: [
      "Website partner listing (optional)",
      "Spotlight story (optional)",
      "Co-hosted volunteer day (optional)",
    ],
    includes: {
      "Sustains monthly meal outreach": true,
      "Supports wellness care access": true,
      "Supports education/mentorship": true,
      "Website partner listing (optional)": true,
      "Spotlight story (optional)": true,
      "Co-hosted volunteer day (optional)": true,
    },
  },
];

const COMPANY_FEATURES = [
  "Sustains monthly meal outreach",
  "Supports wellness care access",
  "Supports education/mentorship",
  "Website partner listing (optional)",
  "Spotlight story (optional)",
  "Co-hosted volunteer day (optional)",
];

export default function MembersPlansSection() {
  const [checkoutSelection, setCheckoutSelection] = useState(null);
  const [individualAmount, setIndividualAmount] = useState(75);
  const [selectedCompanyId, setSelectedCompanyId] = useState("partner");

  const handleJoinIndividual = (amount) => {
    setCheckoutSelection({
      type: "individual",
      planId: "individual",
      planName: "Monthly Individual Support",
      amount,
      note: "Recurring monthly gift. Cancel anytime.",
      makesPossible: [
        "Sustains home-cooked meal outreach",
        "Supports wellness care access",
        "Funds education and mentorship programs",
      ],
    });
  };

  const handleJoinCompany = (plan) => {
    setCheckoutSelection({
      type: "company",
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceMonthly,
      note: plan.note,
      makesPossible: plan.makesPossible,
    });
  };

  if (checkoutSelection) {
    return (
      <section className="w-full p-5 lg:px-20">
        <MembersCheckoutSection
          selection={checkoutSelection}
          onBack={() => setCheckoutSelection(null)}
        />
      </section>
    );
  }

  return (
    <section className="grid gap-10 w-full p-5 lg:px-20">
      <IndividualsMonthlySupportSection
        amount={individualAmount}
        onAmountChange={setIndividualAmount}
        onJoin={handleJoinIndividual}
      />
      <CompanyPartnershipSection
        selectedId={selectedCompanyId}
        onSelectId={setSelectedCompanyId}
        onJoin={handleJoinCompany}
      />
    </section>
  );
}

function IndividualsMonthlySupportSection({ amount: customAmount, onAmountChange: setCustomAmount, onJoin }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <Title className="text-balance">For individuals</Title>
        <p className="text-neutral-700 max-w-[80ch]">
          Your monthly support sustains meals, wellness care, education, and
          outreach. <Bold>There are no member perks</Bold>, just your consistent
          impact.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid md:grid-cols-3 gap-4">
          <CustomAmountCard
            amount={customAmount}
            onAmountChange={setCustomAmount}
            onJoin={() => onJoin(customAmount)}
          />
        </div>

        <aside className="hidden lg:block sticky top-24">
          <div className="bg-neutral-100 rounded-2xl shadow-sm p-5 grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <Heading>Custom monthly support</Heading>
                <p className="text-sm text-neutral-600">
                  Monthly • Cancel anytime
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 text-neutral-900">
                <ShieldCheckIcon className="w-4 h-4" />
                Monthly
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-3xl font-extrabold">
                ${Number(customAmount || 0).toFixed(0)}
                <span className="text-base font-semibold text-neutral-600">
                  /mo
                </span>
              </div>
              <p className="text-xs text-neutral-600 text-right">
                Cancel anytime
              </p>
            </div>

            <button
              type="button"
              onClick={() => onJoin(customAmount)}
              className="w-full px-5 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 bg-accent-500 hover:bg-accent-600 hover:shadow-lg">
              Support monthly
            </button>

            <p className="text-xs text-neutral-600">
              This is a recurring monthly gift that supports our nonprofit
              mission. You can manage or cancel anytime.
            </p>
          </div>
        </aside>
        <IndividualImpactEstimator amount={customAmount} />
      </div>

      <div className="lg:hidden sticky bottom-3 z-10">
        <div className="bg-neutral-100 shadow-lg rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="grid">
            <p className="text-xs text-neutral-600">Selected</p>
            <p className="font-extrabold leading-tight">
              Custom monthly support
            </p>
            <p className="text-sm text-neutral-600">
              ${Number(customAmount || 0).toFixed(0)}
              /mo
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJoin(customAmount)}
            className="px-4 py-3 rounded-xl font-bold text-white bg-accent-500 hover:bg-accent-600">
            Support
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomAmountCard({ isSelected, amount, onAmountChange }) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;

  return (
    <article
      className="relative w-full flex flex-col gap-5 shadow-sm p-5 rounded-2xl h-full transition-all duration-200 cursor-pointer bg-neutral-100 md:col-span-3
        ring-1 ring-transparent hover:ring-neutral-300"
      role="button"
      aria-pressed={isSelected}>
      <div className="grid gap-1">
        <p className="text-xs font-semibold text-neutral-600 flex items-center gap-2">
          <HeartIcon className="w-4 h-4 text-neutral-600" />
          Monthly Impact
        </p>
        <Heading className="leading-tight">
          Give a custom monthly amount
        </Heading>
        <p className="text-sm text-neutral-600">
          Choose what's sustainable for you. Every amount helps.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-5 items-end">
        <div className="grid gap-1">
          <label htmlFor="customAmount" className="text-sm font-semibold">
            Amount (USD)
          </label>
          <input
            id="customAmount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-50 rounded-2xl border-0 shadow-sm w-full h-[4ch] px-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="75"
          />
          <p className="text-xs text-neutral-600">
            Monthly • You can adjust or cancel anytime
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((preset) => (  
          <button
            key={preset}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAmountChange(preset);
            }}
            className={`${preset === amount ? "text-white bg-accent-500 hover:bg-accent-600" : "bg-neutral-100 hover:bg-neutral-300"} rounded-xl px-3 py-2 font-semibold`}>
            ${preset}
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-600">
        This is a recurring monthly gift supporting a 501(c)(3) nonprofit
        mission.
      </p>
    </article>
  );
}

function IndividualImpactEstimator({
  amount,
  className = "",
  assumptions = IMPACT_MODEL,
}) {
  const formatNumber = (n) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      n,
    );
  };

  const impact = useMemo(() => {
    const meals =
      amount > 0 ? Math.max(amount / assumptions.dollarsPerMeal, 1) : 0;

    const wellnessAssists =
      amount > 0
        ? Math.max(amount / assumptions.dollarsPerWellnessAssist, 1)
        : 0;

    const studentSupports =
      amount > 0
        ? Math.max(amount / assumptions.dollarsPerStudentSupport, 1)
        : 0;
    return {
      meals: Math.floor(meals),
      wellnessAssists: Math.floor(wellnessAssists),
      studentSupports: Math.floor(studentSupports),
    };
  }, [amount, assumptions]);

  return (
    <section
      className={`bg-neutral-200 rounded-2xl p-5 lg:p-6 grid gap-4 ${className}`}
      aria-live="polite"
      aria-atomic="true">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <Heading>Estimated monthly impact</Heading>
          <p className="text-sm text-neutral-700 max-w-[80ch]">
            Based on <Bold>${formatNumber(amount)}/month</Bold>. These are{" "}
            estimates to help supporters understand how recurring gifts sustain
            mission work.
          </p>
        </div>

        <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-100 text-neutral-900 shadow-sm">
          Live estimate
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <ImpactStat
          icon={<HeartIcon className="w-5 h-5" />}
          label="Meals supported"
          value={formatNumber(Math.round(impact?.meals || 0))}
          sublabel="home-cooked meals (estimated)"
        />

        <ImpactStat
          icon={<CheckCircleIcon className="w-5 h-5" />}
          label="Wellness support"
          value={formatNumber(Math.round(impact?.wellnessAssists || 0))}
          sublabel="subsidy units (estimated)"
        />

        <ImpactStat
          icon={<CheckCircleIcon className="w-5 h-5" />}
          label="Education support"
          value={formatNumber(Math.round(impact?.studentSupports || 0))}
          sublabel="student support units (estimated)"
        />
      </div>

      <div className="bg-neutral-100 rounded-2xl p-4 shadow-sm grid gap-2">
        <p className="text-sm text-neutral-700">
          <Bold>Why monthly matters:</Bold> recurring support lets us plan
          ahead, purchase supplies responsibly, and respond quickly when needs
          rise.
        </p>

        <p className="text-xs text-neutral-600">
          Our estimates use internal assumptions (e.g., average cost per meal).
          Adjust the model constants when you finalize real numbers.
        </p>
      </div>
    </section>
  );
}

function ImpactStat({ icon, label, value, sublabel }) {
  return (
    <div className="bg-neutral-100 rounded-2xl p-5 shadow-sm grid gap-2">
      <div className="flex items-center gap-2 text-neutral-700">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-200">
          {icon}
        </span>
        <p className="text-sm font-semibold">{label}</p>
      </div>

      <p className="text-4xl font-extrabold leading-none pl-2">{value}</p>
      <p className="text-xs text-neutral-600">{sublabel}</p>
    </div>
  );
}

function CompanyPartnershipSection({ selectedId, onSelectId: setSelectedId, onJoin }) {
  const selectedPlan = useMemo(
    () => COMPANIES.find((p) => p.id === selectedId) ?? COMPANIES[0],
    [selectedId],
  );

  return (
    <div className="grid gap-5 mt-5">
      <div className="grid gap-3">
        <Title className="text-balance">For companies</Title>
        <p className="text-neutral-700 max-w-[85ch]">
          Company partnerships help expand mission capacity, more meals served,
          more accessible care, and more education support. Recognition options
          are available, but the purpose is impact.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid md:grid-cols-3 gap-4">
          {COMPANIES.map((plan) => (
            <CompanyPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedId === plan.id}
              onSelect={() => setSelectedId(plan.id)}
              onJoin={() => onJoin(plan)}
            />
          ))}
        </div>

        <aside className="hidden lg:block sticky top-24">
          <div className="bg-neutral-100 rounded-2xl shadow-sm p-5 grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <Heading>{selectedPlan.name}</Heading>
                <p className="text-sm text-neutral-600">
                  Company Partnership • Monthly
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 text-neutral-900">
                <ShieldCheckIcon className="w-4 h-4" />
                Monthly
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-3xl font-extrabold">
                ${selectedPlan.priceMonthly}
                <span className="text-base font-semibold text-neutral-600">
                  /mo
                </span>
              </div>
              <p className="text-xs text-neutral-600 text-right">
                Cancel anytime
              </p>
            </div>

            <button
              type="button"
              onClick={() => onJoin(selectedPlan)}
              className="w-full px-5 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 bg-accent-500 hover:bg-accent-600 hover:shadow-lg">
              Start partnership
            </button>

            <p className="text-xs text-neutral-600">
              Recognition options are optional. Partnership funds help sustain
              core programs.
            </p>
          </div>
        </aside>
      </div>

      <div className="bg-neutral-200 rounded-2xl p-5 lg:p-6 grid gap-4">
        <div className="grid gap-1">
          <Heading>Partnership details</Heading>
          <p className="text-sm text-neutral-700">
            On mobile, you’ll only see the selected partnership’s details.
          </p>
        </div>

        <div className="grid gap-4 lg:hidden">
          <SelectedCompanyIncludes plan={selectedPlan} />
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[860px] grid grid-cols-[320px_repeat(3,1fr)] gap-2">
            <div />
            {COMPANIES.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl p-3 text-center font-bold ${
                  selectedId === p.id
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100"
                }`}>
                {p.name}
                <div className="text-xs font-semibold opacity-80">
                  ${p.priceMonthly}/mo
                </div>
              </div>
            ))}

            {COMPANY_FEATURES.map((feature) => (
              <CompanyFeatureRow
                key={feature}
                feature={feature}
                plans={COMPANIES}
              />
            ))}
          </div>
        </div>
        <div className="lg:hidden sticky bottom-3 z-10">
          <div className="bg-neutral-100 shadow-lg rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="grid">
              <p className="text-xs text-neutral-600">Selected</p>
              <p className="font-extrabold leading-tight">
                {selectedPlan.name}
              </p>
              <p className="text-sm text-neutral-600">
                ${selectedPlan.priceMonthly}/mo
              </p>
            </div>
            <button
              type="button"
              onClick={() => onJoin(selectedPlan)}
              className="px-4 py-3 rounded-xl font-bold text-white bg-accent-500 hover:bg-accent-600">
              Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyPlanCard({ plan, isSelected, onSelect, onJoin }) {
  return (
    <article
      className={`relative w-full flex flex-col gap-4 shadow-sm p-5 rounded-2xl h-full transition-all duration-200 cursor-pointer bg-neutral-100
        ${isSelected ? "ring-2 ring-accent-500" : "ring-1 ring-transparent hover:ring-neutral-300"}
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      aria-pressed={isSelected}>
      <div className="grid gap-1">
        <p className="text-xs font-semibold text-neutral-600 flex items-center gap-2">
          <BuildingOffice2Icon className="w-4 h-4 text-neutral-600" />
          Company Partnership
        </p>
        <Heading className="leading-tight">{plan.name}</Heading>
        <p className="text-sm text-neutral-600">{plan.note}</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="text-3xl font-extrabold">
          ${plan.priceMonthly}
          <span className="text-base font-semibold text-neutral-600">/mo</span>
        </div>
        <p className="text-xs text-neutral-600">Cancel anytime</p>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <p className="text-sm font-semibold text-neutral-800">
            What this partnership makes possible
          </p>
          <ul className="grid gap-2">
            {plan.makesPossible.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm">
                <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-[1px]" />
                <span className="text-neutral-800">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-semibold text-neutral-800">
            Recognition options (optional)
          </p>
          <ul className="grid gap-2">
            {plan.recognition.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm">
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-800">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isSelected ? null : onSelect();
        }}
        className={`mt-auto w-full px-5 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
          isSelected
            ? "bg-accent-500 hover:bg-accent-600 hover:shadow-lg"
            : "bg-neutral-900 hover:shadow-lg"
        }`}>
        {isSelected ? "Selected" : "Select"}
      </button>
    </article>
  );
}

function SelectedCompanyIncludes({ plan }) {
  return (
    <div className="bg-neutral-100 rounded-2xl p-5 shadow-sm grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <Heading>{plan.name}</Heading>
          <p className="text-sm text-neutral-600">
            ${plan.priceMonthly}/mo • Monthly
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 text-neutral-900">
          <ShieldCheckIcon className="w-4 h-4" />
          Monthly
        </span>
      </div>

      <div className="grid gap-2">
        {COMPANY_FEATURES.map((feature) => (
          <div
            key={feature}
            className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-neutral-800">
              {feature}
            </span>
            {plan.includes?.[feature] ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <span className="text-neutral-400 text-sm">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyFeatureRow({ feature, plans }) {
  return (
    <>
      <div className="rounded-xl p-3 bg-neutral-100 font-semibold text-sm">
        {feature}
      </div>
      {plans.map((p) => (
        <div
          key={p.id + feature}
          className="rounded-xl p-3 bg-neutral-50 grid place-items-center">
          {p.includes?.[feature] ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <span className="text-neutral-400 text-sm">—</span>
          )}
        </div>
      ))}
    </>
  );
}
