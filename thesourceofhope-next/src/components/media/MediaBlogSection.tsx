'use client';

import { useEffect, useState } from 'react';
import PageSection from '@/components/ui/PageSection';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';
import Carousel from '@/components/ui/Carousel';
import { AnchorButton } from '@/components/ui/Button';

interface Post {
  id: number;
  acf?: {
    title: string;
    date: string;
    summary: string;
    url: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      alt_text: string;
      source_url: string;
    }>;
  };
}

export default function MediaBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/publication?per_page=10');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch publications:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-md lg:text-lg">
      <Title>Updates</Title>
      <Heading>See the latest</Heading>

      <div
        className={`min-h-60 flex items-center ${
          loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-750'
        }`}
      >
        {!loading && posts.length === 0 && (
          <p className="text-center w-full text-gray-500 py-10">
            No blog posts to display
          </p>
        )}
        {!loading && posts.length > 0 && (
          <Carousel auto={true} itemsPerView={{ base: 1, md: 2, lg: 3 }}>
            {posts.map((post) => (
              <CarouselCard key={post.id} post={post} />
            ))}
          </Carousel>
        )}
      </div>
    </PageSection>
  );
}

function CarouselCard({ post }: { post: Post }) {
  const [loaded, setLoaded] = useState(false);
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const src = image?.source_url;

  return (
    <div className="group relative shrink-0 bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="relative aspect-video">
        <img
          src={src || '/v2/core/placeholder.webp'}
          alt={image?.alt_text || ''}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
      </div>
      <div className="p-5 grid gap-3">
        <Heading>{post.acf?.title}</Heading>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
          <span className="px-3 py-1 rounded-full bg-neutral-100 border">
            {post.acf?.date
              ? new Date(post.acf.date).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Date TBA'}
          </span>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-3">
          {post.acf?.summary}
        </p>
        <div className="pt-2">
          <AnchorButton href={post.acf?.url || '#'} text="Register Now" />
        </div>
      </div>
    </div>
  );
}
