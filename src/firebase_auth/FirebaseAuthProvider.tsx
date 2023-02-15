import React, { useEffect, useState } from 'react'
import { AuthContext } from './FirebaseAuthContext'
import { auth } from './firebaseSetup'
import firebase from 'firebase/compat/app'

interface Props {
  children: React.ReactNode
}

export const FirebaseAuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log('FirebaseAuthProvider: ', firebaseUser)
      setUser(firebaseUser)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
