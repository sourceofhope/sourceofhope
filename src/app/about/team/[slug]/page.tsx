import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SanityDocument } from "next-sanity";
import { client } from "@/lib/client";

interface TeamMember extends SanityDocument {
  name: string;
  slug: { current: string };
  title?: string;
  bio?: string;
  shortBio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
  teamGroup?: {
    _id?: string;
    name?: string;
  };
}

const MEMBER_QUERY = `*[_type == "teamMember" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  title,
  bio,
	shortBio,
  "image": image{
    "sourceUrl": asset->url,
    "altText": alt
  },
  teamGroup->{
    _id,
    name,
  }
}`;

const options = { next: { revalidate: 30 } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await client.fetch<TeamMember>(
    MEMBER_QUERY,
    { slug },
    options,
  );

  if (!member) {
    return {
      title: "Team Member Not Found | The Source of Hope",
    };
  }

  return {
    title: `${member.name} | The Source of Hope`,
    description: member.title || "Meet our team member",
  };
}

export default async function TeamMember({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await client.fetch<TeamMember>(
    MEMBER_QUERY,
    { slug },
    options,
  );

  if (!member) {
    notFound();
  }

  return (
    <>
      <PageHeader>
        <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          {member.name.toUpperCase()}
        </h1>
        {member.title && (
          <p className="font-semibold text-neutral-200 text-sm md:text-md">
            {member.title}
          </p>
        )}
      </PageHeader>

      <section className="w-full px-5 py-8 pb-20 lg:px-35">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            {/* Main Content */}
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold uppercase text-primary-600">
                    {member.name}
                  </h2>
                  {member.title && (
                    <p className="mt-2 text-md font-medium text-neutral-600">
                      {member.title}
                      {member.teamGroup?.name && (
                        <span>, {member.teamGroup.name}</span>
                      )}
                    </p>
                  )}
                </div>

                {member.shortBio && (
                  <div className="text-md prose prose-lg prose-neutral max-w-none">
                    <p className="whitespace-pre-wrap font-semibold leading-relaxed text-neutral-700">
                      {member.shortBio}
                    </p>
                  </div>
                )}

                {member.bio && (
                  <div className="text-md prose prose-lg prose-neutral max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                      {member.bio}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href="/about/team"
                    className="text-sm md:text-md inline-flex items-center gap-2 font-medium text-primary-700 transition-colors duration-200 hover:text-primary-800 group">
                    <ArrowLeftIcon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to Team
                  </Link>
                </div>
              </div>
            </div>

            {/* Image */}
            {member.image?.sourceUrl && (
              <aside className="order-1 lg:order-2">
                <div className="overflow-hidden rounded-2xl bg-neutral-100 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image.sourceUrl}
                    alt={member.image.altText || member.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
