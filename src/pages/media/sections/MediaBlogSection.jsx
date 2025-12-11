import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

export default function MediaBlogPage() {
  const posts = getPosts();

  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-base lg:text-lg">
      <Title>Our Blog</Title>
      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <EntryCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic py-10">
          No Posts To Display...
        </p>
      )}
    </PageSection>
  );
}

function EntryCard({ post }) {
  return (
    <div className="relative w-full group">
      <div className="relative">
        <img
          src={post.image}
          alt={post.excerpt}
          className="w-full aspect-video md:aspect-9/2 rounded-t-2xl border-4 border-b-0 border-neutral-300 object-cover"
        />
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>
      <div
        className="
					relative bottom-0 left-0 w-full
					p-5
					rounded-b-2xl border-x-4 border-b-4 border-neutral-300
					bg-neutral-100/95 backdrop-blur-sm
					shadow-lg
					transform transition-all
				">
        <Title className="text-accent-800">{post.title}</Title>
        <p className="text-accent-700">
          <div className="flex flex-col gap-3">
            <p className="text-sm items-center h-fit text-neutral-600 rounded-full border-2 border-neutral-500 bg-neutral-300 w-fit px-3 py-1">
              {post.date}
            </p>
            <p className="text-sm md:text-md">{post.excerpt}</p>
          </div>
        </p>
      </div>
    </div>
  );
}

function getPosts() {
  return [];
}
