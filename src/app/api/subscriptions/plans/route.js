export async function GET() {
    const plans = [
      {
        id: "price_1RAixw2fdc8VbWW3BREmKPn9",
        name: "Monthly",
        amount: 1000,
        interval: "month",
        description: "Basic meal planning, billed monthly",
      },
      {
        id: "price_1RAiyK2fdc8VbWW3Mtq89g4v",
        name: "Yearly",
        amount: 10000,
        interval: "year",
        description: "Advanced features, billed yearly",
      },
    ];
    return new Response(JSON.stringify(plans), { status: 200 });
  }