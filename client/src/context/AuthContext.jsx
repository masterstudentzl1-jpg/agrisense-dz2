import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // user shape: { id, firstName, lastName, email, role: 'farmer'|'supplier'|'technician', wilaya, token }

  const login = async (email, password) => {
    // Replace with real API call:
    // const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
    // setUser(res.data.user); localStorage.setItem('token', res.data.token)

    // Mock login for now:
    const mockUsers = {
      'farmer@test.com':     { id: '1', firstName: 'farmer',  lastName: 'far',   role: 'farmer',     wilaya: 'Bouira' },
      'supplier@test.com':   { id: '2', firstName: 'supplier', lastName: 'supp',    role: 'supplier',   wilaya: 'Alger' },
      'technician@test.com': { id: '3', firstName: 'technician',lastName: 'tech',  role: 'technician', wilaya: 'Bouira'  },
    }
    const found = mockUsers[email]
    if (found && password === '123') {
      setUser({ ...found, email, token: 'mock-jwt-token' })
      return { success: true, role: found.role }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = async (data) => {
    // Replace with: await axios.post('http://localhost:5000/api/auth/register', data)
    setUser({ ...data, id: Date.now().toString(), token: 'mock-jwt-token' })
    return { success: true, role: data.role }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}