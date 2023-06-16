import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'
import { useMainData } from '../context/mainDataContext'
import { db } from '../lib/firebase'

export default function useLiveData(branch, sem, isOn) {
  const [isLoading, setIsLoading] = useState(false)

  const { studentsList, dispatch } = useMainData()

  useEffect(() => {
    let unsubscribe

    if (branch && sem) {
      setIsLoading(true)
      const q = query(
        collection(db, 'students'),
        where('branch', '==', branch),
        where('sem', '==', parseInt(sem))
      )
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const newData = snapshot.docs.map((item) => ({
            ...item.data(),
            id: item.id,
          }))

          dispatch({
            type: 'ADD_DATA',
            payload: {
              name: 'studentsList',
              value: newData,
            },
          })
        } else {
          dispatch({
            type: 'ADD_DATA',
            payload: {
              name: 'studentsList',
              value: [],
            },
          })
        }
        setIsLoading(false)
      })
    }
    return () => unsubscribe && unsubscribe()
  }, [branch, sem, dispatch])

  return { isLoading, studentsList }
}
