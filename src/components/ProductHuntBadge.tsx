"use client";

export default function ProductHuntBadge() {
  return (
    <a
      href="https://www.producthunt.com/posts/a11yscope?utm_source=badge-featured"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 group"
      aria-label="View A11yScope on Product Hunt"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <g fill="none" fillRule="evenodd">
          <path
            d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20"
            fill="#DA552F"
          />
          <path
            d="M22.667 20H17v-6h5.667a3 3 0 010 6m0-10H13v20h4v-6h5.667a7 7 0 100-14"
            fill="#FFF"
          />
        </g>
      </svg>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
        Featured on <span className="text-[#DA552F]">Product Hunt</span>
      </span>
    </a>
  );
}
