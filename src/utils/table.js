export const TEACHER_COLUMNS = [
  {
    Header: 'Name',
    accessor: 'teacherName',
  },
  {
    Header: 'Branch',
    accessor: 'branch',
  },
  {
    Header: 'Sem',
    accessor: 'sem',
  },
  {
    Header: 'Sections',
    accessor: 'sections',
    disableSortBy: true,
    Cell: ({ value }) => {
      return value ? (
        <div className="sections">
          {value.sort().map((section) => (
            <div key={section} className={`section ${section || ''}`}>
              {section}
            </div>
          ))}
        </div>
      ) : (
        'No Section'
      )
    },
  },
  {
    Header: 'Subject',
    accessor: 'subfull',
  },
  {
    Header: 'Subcode',
    accessor: 'subcode',
  },
]

export const STUDENTS_COLUMN = [
  {
    Header: 'USN',
    accessor: 'usn',
  },
  {
    Header: 'Number',
    accessor: 'number',
  },
  {
    Header: 'Branch',
    accessor: 'branch',
  },
  {
    Header: 'Sem',
    accessor: 'sem',
  },
  {
    Header: 'Section',
    accessor: 'sec',
    id: 'sections',
  },
  {
    Header: 'Feedback',
    accessor: 'status',
    sortType: 'basic',
    Cell: ({ value }) =>
      value ? (
        <span className="complete">Completed</span>
      ) : (
        <span className="pending">Pending</span>
      ),
  },
]
