"use client";

import { useState } from "react";
import Image from "next/image";
import { BlogComment } from "@/lib/blog-data";
import { MessageSquare, ThumbsUp, Send, Star, CheckCircle2 } from "lucide-react";

interface CommentsSectionProps {
  initialComments: BlogComment[];
  postTitle: string;
}

export default function CommentsSection({
  initialComments,
  postTitle,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleLikeComment = (id: string) => {
    setLikedMap((prev) => {
      const isLiked = prev[id];
      const updated = { ...prev, [id]: !isLiked };
      setComments((list) =>
        list.map((c) =>
          c.id === id ? { ...c, likes: c.likes + (isLiked ? -1 : 1) } : c
        )
      );
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newComment: BlogComment = {
      id: "user-" + Date.now(),
      author: name.trim(),
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop&q=80`,
      date: "Just now",
      content: content.trim(),
      likes: 1,
    };

    setComments((prev) => [newComment, ...prev]);
    setName("");
    setEmail("");
    setContent("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-200" id="comments">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#ff3d3d]" />
          <span>Discussion & Comments</span>
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Comment Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 mb-10 shadow-sm">
        <h4 className="text-base font-bold text-slate-800 mb-1">
          Leave a Technical Comment or Question
        </h4>
        <p className="text-xs text-slate-500 mb-5">
          Share your real-world hardware experience, ask about compatibility, or suggest benchmarks.
        </p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">Comment submitted successfully!</p>
              <p className="text-xs text-emerald-700">Thank you for contributing to the IndustrialEdge engineering community.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Hamza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]/20 focus:border-[#ff3d3d]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address * (not published)
                </label>
                <input
                  type="email"
                  required
                  placeholder="hamza@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]/20 focus:border-[#ff3d3d]"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Article Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Feedback or Technical Query *
              </label>
              <textarea
                required
                rows={4}
                placeholder={`Write your thoughts regarding "${postTitle}"...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]/20 focus:border-[#ff3d3d]"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
            >
              <span>Submit Comment</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-medium">No comments yet.</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    width={38}
                    height={38}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-tight">
                      {comment.author}
                    </h5>
                    <span className="text-xs text-slate-400">{comment.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    likedMap[comment.id]
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title="Upvote comment"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{comment.likes}</span>
                </button>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed pl-12">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
