import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Auto-restore session on page refresh ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get extra info (role, wilaya, name) from Firestore
        const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (docSnap.exists()) {
          setUser({ id: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ── LOGIN ─────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const docSnap = await getDoc(doc(db, 'users', result.user.uid))
      if (docSnap.exists()) {
        const userData = { id: result.user.uid, email, ...docSnap.data() }
        setUser(userData)
        return { success: true, role: userData.role }
      }
      return { success: false, error: 'User data not found.' }
    } catch (err) {
      return { success: false, error: getErrorMessage(err.code) }
    }
  }

  // ── SIGNUP ────────────────────────────────────────────────────────
  const signup = async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const uid = result.user.uid

      // Save user profile in Firestore
      const userData = {
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        role:      data.role,
        wilaya:    data.wilaya,
        createdAt: new Date()
      }
      await setDoc(doc(db, 'users', uid), userData)
      setUser({ id: uid, ...userData })
      return { success: true, role: data.role }
    } catch (err) {
      return { success: false, error: getErrorMessage(err.code) }
    }
  }

  // ── LOGOUT ────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {/* Don't render app until Firebase checks session */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// ── Firebase error messages ────────────────────────────────────────
function getErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':      return 'No account found with this email.'
    case 'auth/wrong-password':      return 'Incorrect password. Try again.'
    case 'auth/email-already-in-use':return 'This email is already registered.'
    case 'auth/weak-password':       return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':       return 'Please enter a valid email address.'
    case 'auth/too-many-requests':   return 'Too many attempts. Please try again later.'
    default:                         return 'Something went wrong. Please try again.'
  }
}