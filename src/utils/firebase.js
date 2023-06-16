import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// Generate Rankings
export const generateRanking = async (branch, sem) => {
  const q = query(
    collection(db, 'teachers'),
    where('branch', '==', branch),
    where('sem', '==', sem),
    orderBy('avgRating', 'desc')
  )
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    return snapshot.docs.map((item) => item.data())
  } else {
    return []
  }
}

export const countCompleted = async (branch, sem) => {
  const completeQuery = query(
    collection(db, 'students'),
    where('branch', '==', branch),
    where('sem', '==', sem),
    where('status', '==', true)
  )
  const totalStudentQ = query(
    collection(db, 'students'),
    where('branch', '==', branch),
    where('sem', '==', sem)
  )
  const completeSnap = await getDocs(completeQuery)
  const totalSnap = await getDocs(totalStudentQ)
  const given = completeSnap.size
  const total = totalSnap.size
  const notgiven = total - given
  return { given, notgiven, total }
}

export const getProfile = async (uid) => {
  const snapshot = await getDoc(doc(db, 'admins/' + uid))
  if (snapshot.exists()) {
    return snapshot.data()
  } else {
    return null
  }
}

export const clearAndCreate = async (branch, sem) => {
  const batch = writeBatch(db)

  const teacherQ = query(
    collection(db, 'teachers'),
    where('branch', '==', branch),
    where('sem', '==', sem),
    where('total', '>', 0)
  )
  const studentQ = query(
    collection(db, 'students'),
    where('branch', '==', branch),
    where('sem', '==', sem)
  )

  const teacherSnapshot = await getDocs(teacherQ)
  const studentSnapshot = await getDocs(studentQ)

  if (!teacherSnapshot.empty) {
    teacherSnapshot.docs.map((item) =>
      batch.update(item.ref, { avgRating: 0, total: 0 })
    )
  }
  if (!studentSnapshot.empty) {
    studentSnapshot.docs.map((item) =>
      batch.update(item.ref, { complete: [], status: false })
    )
  }
  batch.commit()
}

export const getDBData = async (ref) => {
  const q = collection(db, ref)
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  }
}

export const addDataToDB = async (ref, data) => {
  const q = collection(db, ref)
  await addDoc(q, data)
}

export const updateDataToDB = async (ref, data) => {
  const docRef = doc(db, ref)
  await updateDoc(docRef, data)
}

export const deleteDBData = async (ref) => {
  const docRef = doc(db, ref)
  await deleteDoc(docRef)
}

export const getClassFromDB = async (branch, sem, section) => {
  const q = query(
    collection(db, 'teachers'),
    where('branch', '==', branch),
    where('sem', '==', sem),
    where('sections', 'array-contains', section)
  )
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    return snapshot.docs.map((item) => item.data())
  }
}

export const getStudentsFromDB = async (branch, sem) => {
  const q = query(
    collection(db, 'students'),
    where('branch', '==', branch),
    where('sem', '==', sem)
  )
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  }
}

export const addStudentToDb = async (docId, data) => {
  const docRef = doc(db, `students/${docId}`)
  await setDoc(docRef, data)
}
