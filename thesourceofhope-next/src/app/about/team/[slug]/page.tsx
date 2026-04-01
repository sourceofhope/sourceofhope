import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SanityDocument } from "next-sanity";

interface TeamMember extends SanityDocument {
  name: string;
  slug: { current: string };
  title?: string;
  bio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
  team?: {
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
  image,
  team->{
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
    options
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
    options
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

      <section className="w-full grid my-5 px-5 lg:px-35 pb-20">
        <div className="relative">
          {/* Member Image - Float Right */}
          {member.image?.sourceUrl && (
            <div className="float-right ml-8 mb-8 w-full sm:w-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image.sourceUrl}
                alt={member.image.altText || member.name}
                loading="lazy"
                decoding="async"
                className="aspect-square object-cover w-full rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Member Info */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-primary-600 uppercase mb-2">
              {member.name}
            </h2>
            {member.title && (
              <p className="text-lg text-neutral-600 font-medium mb-4">
                {member.title}
              </p>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="prose prose-lg prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          )}

          {/* Team Info */}
          {member.team?.name && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-sm font-medium text-neutral-600">
                Team: <span className="text-accent-600">{member.team.name}</span>
              </p>
            </div>
          )}

          <div className="clear-both"></div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/about/team"
            className="inline-flex items-center group gap-2 text-primary-700 font-medium transition-colors duration-200 hover:text-primary-800"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Team
          </Link>
        </div>
      </section>
    </>
  );
}
