import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const POST_QUERY = `*[_type == "teamMember" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  if (!post) {
    notFound();
  }

  const postImageUrl = post.image?.sourceUrl ?? null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={post.image?.altText || post.name || "Team member image"}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.name}</h1>
      <div className="prose">
        <p>{post.title}</p>
        {post.bio && <p>{post.bio}</p>}
      </div>
    </main>
  );
}