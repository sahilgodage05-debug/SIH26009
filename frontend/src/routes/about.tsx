import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleCheck, Database, Mail, ShieldCheck } from "lucide-react";

import { DataNote, PageHeader, SectionTitle } from "@/components/site/ui-bits";
import { CONFIDENCE_META, MINE_SITES } from "@/data/mines";
import { BrandMark } from "@/components/site/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Data Transparency — GeoMineSense | LEGION" },
      {
        name: "description",
        content:
          "How GeoMineSense by LEGION is built, what its reference dataset contains, and how reference, modelled and indicative values are labelled throughout the platform.",
      },
      { property: "og:title", content: "About & Data Transparency — GeoMineSense | LEGION" },
      {
        property: "og:description",
        content:
          "Scope, data provenance and transparency commitments behind the GeoMineSense manganese intelligence prototype.",
      },
    ],
  }),
  component: About,
});

function About() {
  const counts = {
    reference: MINE_SITES.filter((s) => s.confidence === "reference").length,
    modelled: MINE_SITES.filter((s) => s.confidence === "modelled").length,
    indicative: MINE_SITES.filter((s) => s.confidence === "indicative").length,
  };

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="What this platform is — and what it isn't"
        lead="GeoMineSense is a LEGION platform for manganese mine intelligence. This build is a complete frontend prototype: every figure it shows comes from a structured reference dataset bundled with the interface."
        actions={
          <button
            type="button"
            onClick={() =>
              toast.success("Message noted", {
                description: "Prototype action — no message was transmitted.",
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" /> Contact the LEGION team
          </button>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Database,
              title: "Local structured data",
              body: "One typed dataset drives the map, the scoring surfaces and every chart, so numbers stay consistent across all five pages.",
            },
            {
              icon: ShieldCheck,
              title: "Labelled provenance",
              body: "Reference, modelled and indicative values carry a tag wherever they appear, with the meaning available on hover.",
            },
            {
              icon: CircleCheck,
              title: "Human-in-the-loop",
              body: "The pipeline proposes ranked actions; accepting or dismissing an advisory is always a person's call.",
            },
          ].map((c) => (
            <article key={c.title} className="rounded-xl border bg-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                <c.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Transparency"
            title="Confidence classes in the reference set"
            sub="Every one of the tracked sites falls into one of three classes. The class controls how strongly the interface phrases its conclusions."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {(["reference", "modelled", "indicative"] as const).map((k) => (
              <div key={k} className="rounded-xl border bg-background p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-dashed px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {k}
                  </span>
                  <span className="num text-2xl font-semibold">{counts[k]}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {CONFIDENCE_META[k]}
                </p>
              </div>
            ))}
          </div>
          <DataNote className="mt-5">
            Nothing in this build is survey-grade. Site coordinates are belt-level approximations,
            grades and tonnages are rounded illustrative values, and the India outline is a
            simplified drawing for visual context.
          </DataNote>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark className="h-11 w-11" />
              <div>
                <p className="font-display text-lg font-semibold">GeoMineSense</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  LEGION
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              LEGION builds decision-support software for heavy industry. GeoMineSense is our
              manganese-focused platform: spatial intelligence, explainable scoring and reporting in
              one place, designed with mine planners rather than for them.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/map"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open the mine map
              </Link>
              <Link
                to="/intelligence"
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Review the AI workflow
              </Link>
            </div>
          </div>

          <div>
            <SectionTitle kicker="FAQ" title="Common questions" />
            <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
              {[
                {
                  q: "Is any of this connected to a live system?",
                  a: "No. There is no backend, no account system and no payment flow in this build. All state lives in the browser for the duration of your visit.",
                },
                {
                  q: "Where do the site locations come from?",
                  a: "They are belt-level approximations placed from publicly known manganese geography in central, eastern and southern India, rounded to two decimals for the prototype.",
                },
                {
                  q: "How should the opportunity score be read?",
                  a: "As a relative ranking signal within this dataset only. It combines grade continuity, depth, haulage distance, historic recovery, water stress and a community factor with the weights shown on the AI Intelligence page.",
                },
                {
                  q: "Can the dataset be replaced?",
                  a: "Yes. The interface reads a single typed module, so swapping in a block registry with the same shape carries every surface across unchanged.",
                },
                {
                  q: "What happens when I use an action button?",
                  a: "Actions such as exports, dossiers, survey requests and report packs confirm locally and change nothing outside your browser session.",
                },
              ].map((f, i) => (
                <AccordionItem key={f.q} value={`i${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
