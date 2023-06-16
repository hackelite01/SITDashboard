import './pagination.style.css'

export default function Pagination({
  previousPage,
  canPreviousPage,
  pageIndex,
  pageOptions,
  nextPage,
  canNextPage,
  gotoPage,
}) {
  return (
    <div className="paginationDiv">
      <button onClick={previousPage} disabled={!canPreviousPage}>
        Prev
      </button>
      <div className="pageNumbers">
        {pageOptions.map((page) => (
          <span
            key={page}
            className={pageIndex === page ? 'active' : ''}
            onClick={() => gotoPage(page)}
          >
            {page + 1}
          </span>
        ))}
      </div>
      <button onClick={nextPage} disabled={!canNextPage}>
        Next
      </button>
    </div>
  )
}
