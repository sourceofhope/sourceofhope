import { XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, LinkButton } from "@/components/ui/button";

const VARIANTS = ["primary", "secondary", "tertiary"] as const;
const SIZES = ["md", "lg"] as const;

export function ButtonsSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            <code className="w-12 text-sm text-muted">{size}</code>
            {VARIANTS.map((variant) => (
              <Button key={variant} type="button" variant={variant} size={size}>
                {variant === "primary" ? "Give $50" : variant === "secondary" ? "Volunteer" : "Get Help"}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" loading>
          Give $100
        </Button>
        <Button type="button" disabled>
          Full
        </Button>
        <Button type="button" variant="danger" size="sm">
          Remove (portal only)
        </Button>
        <LinkButton href="/events" variant="secondary">
          See all events (link)
        </LinkButton>
        <IconButton label="Close" icon={<XMarkIcon aria-hidden="true" />} />
        <IconButton label="Give" variant="primary" icon={<HeartIcon aria-hidden="true" />} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-inverse p-6">
        <Button type="button" surface="inverse">
          Give
        </Button>
        <Button type="button" surface="inverse" variant="secondary">
          Volunteer
        </Button>
        <Button type="button" surface="inverse" variant="tertiary">
          Get Help
        </Button>
        <IconButton label="Pause background video" surface="inverse" variant="secondary" icon={<XMarkIcon aria-hidden="true" />} />
        <span className="text-sm text-on-inverse-muted">surface=&quot;inverse&quot;: hero video and footer</span>
      </div>
    </div>
  );
}
