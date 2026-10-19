import Link from "next/link";

const POSTS = [
  {
    id: "1",
    title: "The Future of Foldable Smartphones in 2026",
    excerpt:
      "Foldable tech is maturing fast. We take a deep dive into the latest fold duo smartphones and what they mean for everyday users.",
    date: "Oct 15, 2026",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=250&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Top 10 Noise-Canceling Headphones Reviewed",
    excerpt:
      "From studio sessions to commutes, we tested the best noise-canceling headphones on the market. Here are our picks.",
    date: "Oct 10, 2026",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Smart Home Gadgets Worth Buying",
    excerpt:
      "Turn your apartment into a connected home with these practical smart home devices that actually deliver value.",
    date: "Oct 5, 2026",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&h=250&fit=crop&q=80",
  },
  {
    id: "4",
    title: "Gaming Console Showdown: Which One to Buy?",
    excerpt:
      "We compare the latest gaming consoles across performance, library, and price to help you choose.",
    date: "Sep 28, 2026",
    image: "https://images.unsplash.com/photo-1606181954474-675108d74477?w=400&h=250&fit=crop&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <h1 className="text-[28px] font-normal text-[#212529] mb-2">Blog</h1>
          <p className="text-sm text-black/50 mb-10">
            Tech news, reviews, and guides from the OneTech team.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <article key={post.id} className="flex flex-col border border-[#e5e5e5] rounded-[5px] overflow-hidden hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-shadow">
                <div className="h-48 bg-[#f2f4f8]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] uppercase text-[#0e8ce4] font-medium mb-2 block">
                    Technology
                  </span>
                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-lg font-medium text-[#212529] leading-tight mb-3 group-hover:text-[#0e8ce4] transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-black/50 text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
                    <span className="text-xs text-black/50">{post.date}</span>
                    <Link href={`/blog/${post.id}`} className="text-sm text-[#0e8ce4] font-medium hover:underline">
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
