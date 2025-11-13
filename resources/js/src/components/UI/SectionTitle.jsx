import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router";

const SectionTitle = ({ title, subtitle, btnUrl }) => {
  return (
    <div className="text-center relative">
      <h3 className="text-[22px] md:text-[45px] text-yellow font-normal font-vidaloka mb-[13px] md:mb-[14px]">
        {title}
      </h3>
      <p className="text-cream max-w-[560px] mx-auto text-[12px] md:text-[16px] font-manrope font-normal">
        {subtitle}
      </p>
      <Link
        to={btnUrl}
        className="text-[14px] 2xl:text-[18px] text-cream font-manrope font-normal absolute right-[10px] bottom-0 !hidden xl:!inline-flex items-center gap-4"
      >
        EXPAND COLLECTION
        <span>
          <GoArrowRight />
        </span>
      </Link>
    </div>
  );
};

export default SectionTitle;
