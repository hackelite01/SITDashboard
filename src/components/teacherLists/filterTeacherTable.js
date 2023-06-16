import { useState } from 'react'
import { useAsyncDebounce } from 'react-table'
import { branchList, semList } from '../../utils/deptData'

export default function FilterTeacherTable({
  filter,
  setFilter,
  columnFilters,
  setColumnFilters,
  setAll,
  isStudentTable,
}) {
  const [value, setValue] = useState(filter)

  const sem = columnFilters?.find((item) => item.id === 'sem')?.value
  const branch = columnFilters?.find((item) => item.id === 'branch')?.value
  const sections = columnFilters?.find((item) => item.id === 'sections')?.value
  const status = columnFilters?.find((item) => item.id === 'status')?.value

  const isReset = sem || branch || filter || sections || status

  // Input change
  const handleChange = useAsyncDebounce((e) => {
    setFilter(e)
  }, 500)

  // Select change
  const handleSelectChange = (e, id) => {
    setColumnFilters(id, e.target.value)
  }

  // Reset All
  const resetFilter = (e) => {
    e.preventDefault()
    setFilter('')
    setValue('')
    setAll([])
  }

  return (
    <>
      <h3 className="filters">Filters</h3>
      <form className="filterForm">
        <input
          type="text"
          placeholder="Search Globally"
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value)
            handleChange(e.target.value)
          }}
        />
        <select
          name="branch"
          value={branch || ''}
          onChange={(e) => handleSelectChange(e, 'branch')}
        >
          <option value="">Branch : All</option>
          {branchList.map((item) => (
            <option value={item.value} key={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="sem"
          value={sem || ''}
          onChange={(e) => handleSelectChange(e, 'sem')}
        >
          <option value="">Semester : All</option>
          {semList.map((item) => (
            <option value={item.value} key={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="sections"
          value={sections || ''}
          onChange={(e) => handleSelectChange(e, 'sections')}
        >
          <option value="">Sections : All</option>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => (
            <option value={item} key={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>
        {isStudentTable ? (
          <select
            name="status"
            value={status || ''}
            onChange={(e) => handleSelectChange(e, 'status')}
          >
            <option value="">Status : All</option>
            <option value={true}>Complete</option>
            <option value={false}>Pending</option>
          </select>
        ) : null}
        {isReset ? (
          <button className="btn border-red" onClick={resetFilter}>
            Reset
          </button>
        ) : null}
      </form>
    </>
  )
}
