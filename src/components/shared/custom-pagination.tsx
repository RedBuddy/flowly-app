"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";

interface Props {
  totalPages: number;
  // limit?: number;
}

export const CustomPagination = ({ totalPages }: Props) => {
  const [queryPage, setQueryPage] = useQueryState("page", { defaultValue: "1" });

  const page = isNaN(+queryPage) ? 1 : +queryPage;
  if (page < 1 || page > totalPages) setQueryPage("1");

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setQueryPage(page.toString());
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <Button key={index} variant={page === index + 1 ? "default" : "outline"} size="sm" onClick={() => handlePageChange(index + 1)}>
          {index + 1}
        </Button>
      ))}

      <Button disabled={page === totalPages} variant="outline" size="sm" onClick={() => handlePageChange(page + 1)}>
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
