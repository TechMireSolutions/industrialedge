"use client";

import { useState } from "react";
import { Share2, Heart, Check, Copy, MessageCircle } from "lucide-react";

interface SocialShareBarProps {
  title: string;
  slug: string;
  initialLikes?: number;
}

export default function SocialShareBar({
  title,
  slug,
  initialLikes = 0,
}: SocialShareBarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://industrialedge.pk/blog/${slug}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Reading "${title}" on IndustrialEdge.pk:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out this article: "${title}" - ${getShareUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-slate-50 border border-slate-200 rounded-xl my-8">
      {/* Left: Like & Engagement */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            hasLiked
              ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
          title="Like this article"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              hasLiked ? "fill-red-600 text-red-600 scale-110" : "text-slate-500"
            }`}
          />
          <span>{likes} Likes</span>
        </button>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Found this helpful? Share with colleagues:
        </span>
      </div>

      {/* Right: Share Buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-[#ff3d3d]" />
          Share:
        </span>

        {/* X / Twitter */}
        <button
          onClick={shareToTwitter}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100 transition-colors text-xs font-medium"
          title="Share on X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareToLinkedIn}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0077b5] hover:bg-slate-100 transition-colors text-xs font-medium"
          title="Share on LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#25D366] hover:bg-slate-100 transition-colors text-xs font-medium"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            copied
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
          }`}
          title="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
