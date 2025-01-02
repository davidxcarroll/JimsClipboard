import React from 'react'
import { useUsers } from '../../hooks/useUsers'

export function ParticipantsHeader() {
  const { users, loading } = useUsers()

  console.log('👥 ParticipantsHeader users:', users?.map(u => ({
    id: u.id,
    name: u.name,
    hasPicks: !!u.picks
  })));

  const getDisplayName = (user) => {
    return user.name || user.email?.split('@')[0] || 'Unknown'
  }

  console.log('ParticipantsHeader rendering with users:', users)

  if (loading) return null;

  return (
    <div className="flex flex-row h-12 marker sticky top-0 z-50 lg:text-3xl md:text-2xl text-xl shadow-[0_1px_0_rgba(0,0,0,.1)]">
      <div className="w-1/5 min-w-[150px] flex items-center justify-center" />
      <div className="w-[1.5px] bg-neutral-200" />

      {users.map((user, index) => {
        const displayName = getDisplayName(user)
        console.log('Rendering user:', { user, displayName })
        return (
          <React.Fragment key={user.id}>
            <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
              <span className="max-[450px]:-rotate-45">{displayName}</span>
            </div>
            {index < users.length - 1 && (
              <div className="w-[1.5px] bg-neutral-200" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}