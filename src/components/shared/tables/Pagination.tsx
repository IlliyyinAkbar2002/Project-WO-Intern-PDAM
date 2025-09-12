import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  onPageChange: (selected: number) => void;
  currentPage: number;
}

export function Pagination({
  totalPages,
  onPageChange,
  currentPage,
}: PaginationProps) {
  return (
    <div className="flex justify-center">
      <ReactPaginate
        forcePage={currentPage - 1}
        previousLabel={
          <ArrowCircleLeft
            size={28}
            className="text-primary-500 hover:text-primary-700"
          />
        }
        nextLabel={
          <ArrowCircleRight
            size={28}
            className="text-primary-500 hover:text-primary-700"
          />
        }
        breakLabel="..."
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        containerClassName="flex gap-2 place-items-center text-primary-500 text-sm font-semibold"
        pageClassName="rounded-md"
        pageLinkClassName="px-2 py-1 block cursor-pointer rounded-md text-center hover:text-primary-700"
        activeLinkClassName="text-white rounded-md bg-primary-500 hover:text-white"
        previousClassName="rounded-md"
        previousLinkClassName="block cursor-pointer rounded-md"
        nextClassName="rounded-md"
        nextLinkClassName="block cursor-pointer rounded-md"
        breakClassName="rounded-md"
        breakLinkClassName="block"
      />
    </div>
  );
}
