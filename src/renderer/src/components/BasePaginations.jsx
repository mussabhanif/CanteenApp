import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function BasePaginations({ current_page, last_page, onFetch }) {
  const getPaginationItems = () => {
    let pages = [];

    if (last_page <= 5) {
      pages = [...Array(last_page)].map((_, index) => index + 1);
    } else {
      pages.push(1);

      if (current_page > 3) {

        pages.push("...");
      }

      let start = Math.max(2, current_page - 1);
      let end = Math.min(last_page - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current_page < last_page - 2) {

        pages.push("...");
      }

      pages.push(last_page);
    }

    return pages;
  };

  return (
    <Pagination className='my-5'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => current_page > 1 && onFetch(current_page - 1)}
            className={current_page <= 1 ? 'cursor-not-allowed text-gray-400 hover:text-gray-400' : 'cursor-pointer'}
            disabled={current_page <= 1}
          />
        </PaginationItem>

        {getPaginationItems().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === current_page}
                onClick={() => onFetch(page)}
                className='cursor-pointer'
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => current_page < last_page && onFetch(current_page + 1)}
            className={current_page >= last_page ? 'cursor-not-allowed text-gray-400 hover:text-gray-400' : 'cursor-pointer'}
            disabled={current_page >= last_page}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
