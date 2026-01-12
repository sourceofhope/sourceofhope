import { useEffect, useState } from "react";
import {
  fetchContent,
  getFeaturedImage,
  getResponsiveImage,
} from "../../../cms";
import { ASSET_VERSION } from "../../../routes";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import { useCartActions } from "../../../context/StoreCartContext";

const mockupProducts = [
  {
    id: 1,
    acf: {
      title: "Classic Cotton T-Shirt",
      price: "$25.00",
      url: "#",
      location: "#",
      size: "M"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Classic Cotton T-Shirt"
      }]
    }
  },
  {
    id: 2,
    acf: {
      title: "Hope Coffee Mug",
      price: "$15.00",
      url: "#",
      location: "#"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Hope Coffee Mug"
      }]
    }
  },
  {
    id: 3,
    acf: {
      title: "Reusable Tote Bag",
      price: "$18.00",
      url: "#",
      location: "#"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Reusable Tote Bag"
      }]
    }
  },
  {
    id: 4,
    acf: {
      title: "Embroidered Hat",
      price: "$22.00",
      url: "#",
      location: "#",
      size: "L"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Embroidered Hat"
      }]
    }
  },
  {
    id: 5,
    acf: {
      title: "Stainless Steel Water Bottle",
      price: "$28.00",
      url: "#",
      location: "#"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Stainless Steel Water Bottle"
      }]
    }
  },
  {
    id: 6,
    acf: {
      title: "Hope Journal",
      price: "$12.00",
      url: "#",
      location: "#"
    },
    _embedded: {
      "wp:featuredmedia": [{
        source_url: `/${ASSET_VERSION}/core/placeholder.webp`,
        alt_text: "Hope Journal"
      }]
    }
  }
];

export default function StorefrontProductSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetchContent("/products&_embed")
      .then((data) => setPosts(data && data.length > 0 ? data : mockupProducts))
      .catch(() => setPosts(mockupProducts))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchPosts);
    } else {
      setTimeout(fetchPosts, 1);
    }
  }, []);

  return (
    <section className="w-full md:justify-items-left items-center grid px-5 lg:px-35 pt-30 h-full">
      <div className="mb-10 flex flex-col max-w-2xl gap-5">
        <Title>Storefront</Title>
        <Heading>Shop With Purpose</Heading>
        <p className="text-neutral-600">
          Every purchase directly supports The Source of Hope’s mission: feeding
          families, empowering students, and strengthening communities.
        </p>
      </div>
      <div className="min-h-80 flex items-center justify-center">
        {loading && (
          <div className="text-center text-neutral-400">Loading products…</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center text-neutral-400">
            No products available at the moment.
          </div>
        )}
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ProductCard key={post.id} post={post} />
          ))}
        </article>
      </div>
    </section>
  );
}

function ProductCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartActions();
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 420 });

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Parse price string to number (e.g., "$25.00" -> 25.00)
    const priceValue = parseFloat(post.acf?.price?.replace(/[$,]/g, '') || 0);
    
    const cartItem = {
      id: post.id,
      title: post.acf?.title || 'Untitled Product',
      price: priceValue,
      quantity: 1,
      image: src || `/${ASSET_VERSION}/core/placeholder.webp`,
      url: post.acf?.url || '#',
    };
    
    // Add size if product has it
    if (post.acf?.size) {
      cartItem.size = post.acf.size;
    }
    
    addToCart(cartItem);
    setAdded(true);
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
      <a href={post.acf?.url} className="relative aspect-[4/5] overflow-hidden">
        <img
          src={src || `/${ASSET_VERSION}/core/placeholder.webp`}
          alt={image?.alt_text || ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </a>
      <div className="relative flex flex-col gap-2 p-5 text-neutral-50">
        <h2 className="line-clamp-2 font-semibold leading-tight transition-colors duration-300">
          {post.acf?.title}
        </h2>
        <p>{post.acf?.price}</p>
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none transition-all duration-300 ${
            added ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:text-neutral-300'
          }`}>
          <span>{added ? 'Added!' : 'Add To Cart'}</span>
          <ArrowUpRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
