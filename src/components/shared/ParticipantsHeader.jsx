import React from 'react'
import { useUsers } from '../../hooks/useUsers'

export function ParticipantsHeader() {
  const { users, loading } = useUsers()

  const getDisplayName = (user) => {
    if (!user) return 'Unknown';
    return user.name || user.email?.split('@')[0] || 'Unknown'
  }

  if (loading) return null;
  if (!Array.isArray(users)) return null;

  return (
    <div className="flex flex-row h-12 jim-casual sticky top-0 z-40 lg:text-5xl md:text-4xl text-3xl border-black border-b-[1.5px]">
      <div className="flex-1 min-w-[150px] flex items-center justify-center" />
      <div className="w-[1.5px] bg-black" />

      {users.map((user, index) => {
        const displayName = getDisplayName(user)

        return (
          <React.Fragment key={user.id}>
            <div className="flex-1 min-w-[30px] flex sm:items-center items-start justify-center max-sm:pt-3">
              <span className="max-sm:-rotate-45 leading-4 text-center">{displayName}</span>
            </div>
            {index < users.length - 1 && (
              <div className="w-[1.5px] bg-black" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}