export async function GET() {
  const plans = [
    {
      id: "price_1RAixw2fdc8VbWW3BREmKPn9",
      name: "Monthly",
      amount: 1000,
      interval: "month",
      description: "Basic meal planning, billed monthly",
      features: [
        'Plan up to 25 meals per month',
        'Generate grocery lists',
        'Basic nutrition breakdown',
        'Email support within 24 hours'
      ],
      featured: false
    },
    {
      id: "price_1RAiyK2fdc8VbWW3Mtq89g4v",
      name: "Yearly",
      amount: 10000,
      interval: "year",
      description: "Advanced meal planning, billed yearly",
      features: [
        'Unlimited meal plans',
        'Smart grocery list generator',
        'Advanced nutrition tracking',
        'Family sharing support',
        'Recipe import from web',
        'Priority customer support'
      ],
      featured: true
    },
  ];
  return new Response(JSON.stringify(plans), { status: 200 });
}
