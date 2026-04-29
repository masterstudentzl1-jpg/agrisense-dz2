import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FarmerDashboard from './FarmerDashboard'
import SupplierDashboard from './SupplierDashboard'
import TechnicianDashboard from './TechnicianDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'farmer')     return <FarmerDashboard />
  if (user.role === 'supplier')   return <SupplierDashboard />
  if (user.role === 'technician') return <TechnicianDashboard />

  return <Navigate to="/" replace />
}