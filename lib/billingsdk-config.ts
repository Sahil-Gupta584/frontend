export interface Plan {
  id: string;
  title: string;
  description: string;
  highlight?: boolean;
  type?: "monthly" | "yearly";
  currency?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  buttonText: string;
  badge?: string;
  features: {
    name: string;
    icon: string;
    iconColor?: string;
  }[];
}

export interface CurrentPlan {
  plan: Plan;
  type: "monthly" | "yearly" | "custom";
  price?: string;
  nextBillingDate: string;
  paymentMethod: string;
  status: "active" | "inactive" | "past_due" | "cancelled";
}

export const plans: Plan[] = [
  {
    id: "starter",
    title: "Starter",
    description: "For developers testing out Liveblocks locally.",
    currency: "$",
    monthlyPrice: "0",
    yearlyPrice: "0",
    buttonText: "Start today for free",
    features: [
      {
        name: "5 Websites",
        icon: "check",
        iconColor: "text-orange-500",
      },
      {
        name: "10k Events",
        icon: "check",
        iconColor: "text-teal-500",
      },
      {
        name: "Basic Analytics",
        icon: "check",
        iconColor: "text-blue-500",
      },
      {
        name: "Email Support",
        icon: "check",
        iconColor: "text-zinc-500",
      },
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "For companies adding collaboration in production.",
    currency: "$",
    monthlyPrice: "9",
    yearlyPrice: "90",
    buttonText: "Sign up",
    badge: "Most popular",
    highlight: true,
    features: [
      {
        name: "20 websites",
        icon: "check",
        iconColor: "text-green-500",
      },
      {
        name: "100k events",
        icon: "check",
        iconColor: "text-orange-500",
      },
      {
        name: "Advanced Attribution",
        icon: "check",
        iconColor: "text-teal-500",
      },
      {
        name: "Priority Support",
        icon: "check",
        iconColor: "text-blue-500",
      },
      {
        name: "Funnel Insights (Coming Soon)",
        icon: "check",
        iconColor: "text-zinc-500",
      },
    ],
  },
];
