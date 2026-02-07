import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import PageHeader from "../PageHeader";
import PageSection from "../PageSection";
import { fetchContent, getFeaturedImage } from "../../cms";
import { ASSET_VERSION, CANONICAL_URL } from "../../routes";
import Loader from "../../components/structure/Loader";

export default function MemberPage() {
  const { memberSlug } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetchContent(`/team-member?slug=${memberSlug}&_embed`)
      .then((data) => {
        if (data && data.length > 0) {
          setMember(data[0]);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [memberSlug]);

  if (loading) {
    return <Loader />;
  }

  if (error || !member) {
    return (
      <>
        <Helmet>
          <title>Team Member Not Found | The Source of Hope</title>
        </Helmet>
        <PageHeader>
          <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
            Member Not Found
          </h2>
        </PageHeader>
        <PageSection className="pt-10 pb-20">
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Sorry, we couldn't find this team member.
            </p>
            <Link
              to="/about/team"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Team
            </Link>
          </div>
        </PageSection>
      </>
    );
  }

  const image = getFeaturedImage(member);
  const { name, title, shortBiography, longBiography } = member.acf || {};

  return (
    <>
      <Helmet>
        <title>{name || "Team Member"} | The Source of Hope</title>
        <meta
          name="description"
          content={shortBiography || `Learn more about ${name}`}
        />
        <link
          rel="canonical"
          href={`${CANONICAL_URL.about}/team/${memberSlug}`}
        />
      </Helmet>

      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          {String(name).toUpperCase()}
        </h2>
        {title && (
          <p className="font-semibold text-neutral-200 text-sm md:text-md">
            {title}
          </p>
        )}
      </PageHeader>

      <PageSection className="pt-10 pb-20">
        <div className="relative">
          <div className="float-right ml-8 mb-8 w-full sm:w-96">
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-lg shadow-lg overflow-hidden border-4 border-white ring-1 ring-gray-200">
              <img
                src={
                  image?.source_url ||
                  `/${ASSET_VERSION}/core/Member-Placeholder.webp`
                }
                alt={image?.alt_text || name || "Team member"}
                loading="lazy"
                decoding="async"
                className="object-cover transition-opacity duration-750"
              />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary-600 uppercase mb-2">
              {name}
            </h1>
            {title && (
              <p className="text-lg text-neutral-600 font-medium mb-4">
                {title}
              </p>
            )}
          </div>

          {shortBiography && (
            <div className="prose prose-lg prose-neutral max-w-none">
              <p
                className="text-neutral-700 leading-relaxed text-justify"
                style={{ textAlign: "justify" }}>
                {shortBiography}
              </p>
            </div>
          )}

          {longBiography && (
            <div className="prose prose-lg prose-neutral max-w-none">
              <p
                className="text-neutral-700 leading-relaxed text-justify"
                style={{ textAlign: "justify" }}>
                {longBiography}
              </p>
            </div>
          )}

          <div className="clear-both"></div>
        </div>

        <div className="mt-12">
          <Link
            to="/about/team"
            className="inline-flex items-center gap-2 text-primary-700 font-medium transition-colors duration-200">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Team
          </Link>
        </div>
      </PageSection>
    </>
  );
}
