import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

const POSTS_QUERY = `*[_type == "teamMember"]`;

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.length === 0 && (
          <li className="text-sm text-gray-600">
            No team members found. If your Sanity dataset is private, set
            SANITY_API_READ_TOKEN in your .env file and restart the dev server.
          </li>
        )}
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.name}</h2>
              <p>{post.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
