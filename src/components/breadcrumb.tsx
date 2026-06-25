import { ChevronRight } from "lucide-react";

type BreadcrumbProps = {
  paths: string[];
};

export default function Breadcrumb({ paths }: BreadcrumbProps) {
  return (
    <h1 className="flex items-center text-2xl font-bold mb-4">
      {paths.map((p, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <ChevronRight className="mx-2 h-5 w-5 text-gray-400" />}
          <span className={i === paths.length - 1 ? "text-gray-800" : ""}>
            {p}
          </span>
        </span>
      ))}
    </h1>
  );
}
