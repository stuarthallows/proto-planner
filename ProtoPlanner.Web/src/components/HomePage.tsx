/**
 * Home page component that displays a welcome message and navigation instructions
 */
export function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600">Select a section from the navigation to get started.</p>
      </div>
    </div>
  )
}