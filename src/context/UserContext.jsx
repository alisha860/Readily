import { createContext, useContext, useState } from 'react'
import { users } from '../data/mockData.js'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [userId, setUserId] = useState('simone')
  return (
    <UserContext.Provider value={{ userId, user: users[userId], setUserId, users }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
