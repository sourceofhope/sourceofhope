"use client";

import { useState } from "react";
import { Accordion, AccordionItem, Disclosure } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, Sheet } from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import { Menu, MenuLink } from "@/components/ui/menu";
import { Tab, Tabs, TabsList, TabsPanel } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Heading level={3} size="xl">
        {title}
      </Heading>
      {children}
    </div>
  );
}

export function OverlaysSection() {
  const [takeoverOpen, setTakeoverOpen] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <Demo title="Dialog, takeover and sheet">
        <p className="max-w-prose text-muted">
          One Dialog with three layouts. <code>dialog</code> for short tasks; <code>takeover</code> (the Action Hub) is full
          screen on phones and a centered dialog from md up; <code>Sheet</code> is the phone menu. Escape, the close button
          and the backdrop all close it, and focus returns to the trigger.
        </p>
        <div className="flex flex-wrap gap-3">
          <Dialog
            title="Leave this sign-up?"
            description="Your answers so far won't be saved."
            trigger={
              <Button type="button" variant="secondary">
                Open dialog
              </Button>
            }
            footer={
              <>
                <Button type="button" variant="tertiary">
                  Keep going
                </Button>
                <Button type="button" variant="danger">
                  Leave
                </Button>
              </>
            }
          >
            <p>You can come back to this event from the Get Help menu at any time.</p>
          </Dialog>

          <Button type="button" variant="secondary" onClick={() => setTakeoverOpen(true)}>
            Open takeover (controlled)
          </Button>
          <Dialog title="Get Help" description="Food, events and services near you." layout="takeover" open={takeoverOpen} onOpenChange={setTakeoverOpen}>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <p key={i}>Scrolling body line {i + 1}. The header and close button stay put.</p>
              ))}
            </div>
          </Dialog>

          <Sheet
            title="Menu"
            hideTitle
            trigger={
              <Button type="button" variant="secondary">
                Open sheet
              </Button>
            }
          >
            <p>Phone navigation lives here (slice 1.6).</p>
          </Sheet>
        </div>
      </Demo>

      <Demo title="Menu">
        <div>
          <Menu label="About">
            <MenuLink href="/about">Our story</MenuLink>
            <MenuLink href="/team">Our team</MenuLink>
            <MenuLink href="/awards">Awards</MenuLink>
          </Menu>
        </div>
      </Demo>

      <Demo title="Tabs">
        <div className="grid gap-8 md:grid-cols-2">
          <Tabs defaultValue="guest">
            <TabsList aria-label="Sign up as (underline)" look="underline">
              <Tab value="guest" look="underline">
                Guest
              </Tab>
              <Tab value="volunteer" look="underline">
                Volunteer
              </Tab>
            </TabsList>
            <TabsPanel value="guest">
              <p className="pt-4">Guest sign-up: who&apos;s coming, then confirm.</p>
            </TabsPanel>
            <TabsPanel value="volunteer">
              <p className="pt-4">Volunteer sign-up: pick a shift, then sign the agreement.</p>
            </TabsPanel>
          </Tabs>
          <Tabs defaultValue="help">
            <TabsList aria-label="Action Hub doors (pill)" look="pill">
              <Tab value="help" look="pill">
                Get Help
              </Tab>
              <Tab value="volunteer" look="pill">
                Volunteer
              </Tab>
              <Tab value="give" look="pill">
                Give
              </Tab>
            </TabsList>
            <TabsPanel value="help">
              <p className="pt-4">Upcoming events and services.</p>
            </TabsPanel>
            <TabsPanel value="volunteer">
              <p className="pt-4">Shifts that need people.</p>
            </TabsPanel>
            <TabsPanel value="give">
              <p className="pt-4">Give once or monthly.</p>
            </TabsPanel>
          </Tabs>
        </div>
      </Demo>

      <Demo title="Accordion and Disclosure">
        <div className="max-w-prose">
          <Accordion defaultOpen={["food"]}>
            <AccordionItem value="food" title="Do I need to sign up to get food?" level={4}>
              No. Food is given out at our events to everyone who comes. Signing up helps us plan.
            </AccordionItem>
            <AccordionItem value="teens" title="Can teens volunteer?" level={4}>
              Yes. Volunteers under 18 sign up with a parent or guardian, who signs their agreement.
            </AccordionItem>
            <AccordionItem value="receipt" title="Will I get a receipt for my gift?" level={4}>
              Yes. We email a receipt as soon as your gift goes through.
            </AccordionItem>
          </Accordion>
        </div>
        <Disclosure label="How volunteering works">
          Pick an event and a shift, tell us who&apos;s coming, and sign the agreement. We email you a reminder the day before.
        </Disclosure>
      </Demo>

      <Demo title="Toast">
        <p className="max-w-prose text-muted">For confirmations that need no decision. Blocking errors use an Alert beside the problem.</p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => toast.success("You're signed up", { description: "We emailed your confirmation." })}>
            Success toast
          </Button>
          <Button type="button" variant="secondary" onClick={() => toast.info("Link copied")}>
            Info toast
          </Button>
          <Button type="button" variant="secondary" onClick={() => toast.error("We couldn't save that", { description: "Check your connection and try again." })}>
            Error toast
          </Button>
        </div>
      </Demo>
    </div>
  );
}
