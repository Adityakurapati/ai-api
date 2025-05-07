import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Person Detection API</h1>

      <div className="flex flex-col gap-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Test API Endpoints:</h2>
          <div className="flex flex-col gap-2">
            <Link href="/api/detectperson?person=true" className="text-blue-500 hover:underline" target="_blank">
              /api/detectperson?person=true
            </Link>
            <Link href="/api/detectperson?person=false" className="text-blue-500 hover:underline" target="_blank">
              /api/detectperson?person=false
            </Link>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">API Documentation:</h2>
          <p className="mb-2">
            <strong>GET /api/detectperson</strong> - Updates the Firebase Realtime Database
          </p>
          <p className="mb-1">
            <strong>Query Parameters:</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>
              <code>person</code> - Set to "true" or "false" to update the status
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
