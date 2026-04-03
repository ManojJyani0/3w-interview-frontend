import { useNavigate } from "@tanstack/react-router"

export function AuthError({ error }: { error: Error }) {
  const navigate = useNavigate()
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold text-lg mb-2">
          Authentication Error
        </h2>
        <p className="text-red-600 text-sm mb-4">
          {error.message || 'Failed to verify authentication status'}
        </p>
        <button
          onClick={() => navigate({ to: '/login', replace: true })}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}