import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

/** Firebase 專案設定 */
const firebaseConfig = {
  apiKey: 'AIzaSyCYPWT4L2EstVDI3EsZizt9Q8BxSNPZVzY',
  authDomain: 'css-birthday.firebaseapp.com',
  projectId: 'css-birthday',
  storageBucket: 'css-birthday.firebasestorage.app',
  messagingSenderId: '500644389653',
  appId: '1:500644389653:web:f8f05be577ae981d4ebf1c',
  measurementId: 'G-M10JS6ZGKE',
}

const app = initializeApp(firebaseConfig)

/** Firestore 資料庫實例 */
export const db = getFirestore(app)
