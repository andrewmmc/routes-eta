/**
 * Home Page
 *
 * Landing page with links to sample boards
 *
 * TODO: Add search functionality
 * TODO: Add favorites/recent boards
 * TODO: Add operator selection
 */

import Link from "next/link";

export default function HomePage() {
  // TODO: Load from config or API
  const sampleBoards = [
    {
      id: "mtr-tsuen-wan-central",
      name: "MTR Tsuen Wan Line - Central",
      nameZh: "港鐵荃灣綫 - 中環",
      href: "/board/mtr/TWL/CEN/down",
    },
    {
      id: "mtr-island-chaiwan",
      name: "MTR Island Line - Chai Wan",
      nameZh: "港鐵港島綫 - 柴灣",
      href: "/board/mtr/ISL/CHW/up",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Routes ETA</h1>
        <p className="mb-8 text-center text-gray-600">
          Hong Kong Transport Arrival Board Display
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sample Boards</h2>

          {sampleBoards.map((board) => (
            <Link
              key={board.id}
              href={board.href}
              className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md"
            >
              <div className="font-semibold">{board.name}</div>
              <div className="text-gray-500">{board.nameZh}</div>
            </Link>
          ))}
        </div>

        {/* TODO: Add custom board URL builder */}
        <div className="mt-8 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">Custom Board</h2>
          <p className="text-gray-500">
            Use the URL pattern:{" "}
            <code className="rounded bg-gray-100 px-2 py-1">
              /board/[operator]/[service]/[station]
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
