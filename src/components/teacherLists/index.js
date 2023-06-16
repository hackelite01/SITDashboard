import { useMemo } from 'react'
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md'
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { TEACHER_COLUMNS } from '../../utils/table'
import Pagination from '../pagination'
import FilterTeacherTable from './filterTeacherTable'
import './teacherLists.style.css'
import { motion } from 'framer-motion'

const tableVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.7, ease: 'easeInOut' },
      duration: 0.3,
    },
  },
}

export default function TeacherList({ listData, handleEditBtn }) {
  const columns = useMemo(() => TEACHER_COLUMNS, [])
  const data = useMemo(() => listData, [listData])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    setFilter,
    state,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    setAllFilters,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((column) => [
        ...column,
        {
          Header: 'Action',
          Cell: ({ row }) => (
            <button
              className="editBtn"
              onClick={() => handleEditBtn(row.original)}
            >
              Edit
            </button>
          ),
        },
      ])
    }
  )

  const { globalFilter, pageIndex, filters } = state

  return (
    <motion.div variants={tableVariants}>
      <div className="teacherLists">
        <FilterTeacherTable
          filter={globalFilter}
          setFilter={setGlobalFilter}
          setColumnFilters={setFilter}
          columnFilters={filters}
          setAll={setAllFilters}
        />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}

                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <MdOutlineArrowDropUp className="iconSort" />
                      ) : (
                        <MdOutlineArrowDropDown className="iconSort" />
                      )
                    ) : (
                      ''
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!page.length ? <p className="noDataTable">No Data Found</p> : null}

        <Pagination
          gotoPage={gotoPage}
          canNextPage={canNextPage}
          nextPage={nextPage}
          canPreviousPage={canPreviousPage}
          previousPage={previousPage}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
        />
      </div>
    </motion.div>
  )
}
