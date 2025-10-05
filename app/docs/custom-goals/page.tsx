import ChipComponent from "@/components/chip";
import CodeBlock from "@/components/codeBlock";
import LinkComponent from "@/components/link";

function Page() {
  function Heading({
    text,
    size = "2xl",
    child,
  }: {
    text: string;
    size?: "xl" | "2xl" | "3xl" | "lg" | "md";
    child?: React.ReactNode;
  }) {
    return (
      <h2 className={`font-bold text-${size} text-white`}>
        {text}
        {child}
      </h2>
    );
  }

  return (
    <section className="text-default-500 space-y-10 min-w-0">
      <div className="space-y-4">
        <Heading text="Track custom user actions (Goals)" />
        <p>
          Insightly allows you to track specific user actions beyond pageviews,
          known as Goal (signup, newsletter subscribe, checkout initiated,
          etc.).
        </p>
        <ul className="list-disc space-y-2">
          <li>This helps you understand what visitors do</li>
          <li>
            Improve the <LinkComponent text="revenue predictions" href="" />
          </li>
        </ul>
        <p>You can track goals using three methods:</p>
      </div>
      <div className="space-y-4">
        <Heading text="1. Client-side tracking (simple)" />
        <p>
          Add a JavaScript snippet where the conversion occurs (e.g., on a
          "thank you" page after signup, when a user clicks a button, etc.).
        </p>
        <Heading text="Basic usage" size="lg" />
        <CodeBlock
          codeSamples={{ javascript: 'window?.insightly("goal_name");' }}
        />

        <Heading
          text="Rules for "
          size="md"
          child={<ChipComponent child="goal_name:" />}
        />
        <ul className="list-disc space-y-2">
          <li>Use lowercase letters.</li>
          <li>Numbers, underscores (_), and hyphens (-) are allowed.</li>
          <li>Maximum 32 characters.</li>
        </ul>

        <Heading
          text="Rules for custom parameters: "
          size="md"
          child={<ChipComponent child="goal_name:" />}
        />
        <ul className="list-disc space-y-2 [&_strong]:text-white">
          <li>
            <strong>Property names: </strong>
            lowercase letters, numbers, underscores (_), and hyphens (-) only.
            Max 32 characters.
          </li>
          <li>
            <strong>Property values: </strong>
            any string, max 255 characters.
          </li>
          <li>
            <strong>Limits: </strong>
            maximum 10 custom parameters per event.
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <Heading text="2. HTML data attributes (simple)" />
        <p>
          Track goals automatically when users click on any element with the
          <ChipComponent child="insightly-goal" isMargin />
          attribute. This is the simplest way to track button clicks.
        </p>
        <Heading text="Basic usage" size="lg" />
        <CodeBlock
          codeSamples={{
            html: '<button insightly-goal="initiate_checkout">Buy Now</button>',
          }}
        />
        <p>
          In this example Insightly will send a goal with the name .
          <ChipComponent child="initiate_checkout" isMargin />
        </p>
        <Heading text="Advanced usage with custom parameters" size="lg" />
        <p>
          Add additional
          <ChipComponent child="insightly-goal-*" isMargin />
          attributes to include custom parameters:
        </p>
        <CodeBlock
          codeSamples={{
            html: `<button insightly-goal="pricing_plan_selected" insightly-goal-price="49" insightly-goal-plan-type="pro">
  Subscribe to Pro Plan
</button>`,
          }}
        />
        <p>
          In this example DataFast will send a goal with the name
          <ChipComponent child="pricing_plan_selected" isMargin />
          and
          <ChipComponent child="{ price: '49', plan_type: 'pro' }" isMargin />
          custom parameters.
        </p>
      </div>
    </section>
  );
}

export default Page;
