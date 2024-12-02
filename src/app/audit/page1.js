export default function AuditTrail() {
    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between bg-white-100 py-4 px-6 border-b">
          <div className="shrink-0">
            <img className="w-{20},h-{10} " src="logo.jpg" alt="Your Company" />
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
  
            <input type="text" placeholder="Search" className="border:none" />
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              {/* Placeholder for user icon */}
              <span className="text-sm font-bold">SK</span>
            </div>
          </div>
        </header>
  
        {/* Main content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-200 border-r">
            <ul className="space-y-4 py-6 px-4">
              <li className="flex items-center space-x-2">
                <span>📊</span>
                <span>Dashboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>👤</span>
                <span>Clients</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>👥</span>
                <span>Members</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🔔</span>
                <span>Activity</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🛠</span>
                <span>Tasks</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🗨</span>
                <span>Reachouts</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📈</span>
                <span>Audit Trail</span>
              </li>
            </ul>
          </aside>
  
          {/* Main Section */}
          <main className="flex-1 p-6">
            <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
            <div className="bg-white p-6 rounded-md shadow-md space-y-4">
              {/* Date Range */}
              <div>
                <label className="block text-bg font-bold">Date Range</label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-medium">
                      Start date
                    </label>
                    <input
                      type="date"
                      className="border px-3 py-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-medium">End date</label>
                    <input
                      type="date"
                      className="border px-3 py-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                </div>
              </div>
  
              {/* Dropdowns */}
              {["Clients", "Users"].map((label) => (
                <div key={label} className="flex items-center space-x-4 mt-2">
                  <label className="block text-bg font-bold">{label}</label>
                  <select className="w-half border px-3 py-1 mt-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300">
                    <option>${label.toLowerCase()}</option>
                  </select>
                </div>
              ))}
              <div className="flex items-center space-x-4 mt-2">
                <button
                  type="submit"
                  className="flex w-half justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Show result
                </button>
                <button
                  type="submit"
                  className="flex w-half justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reset
                </button>
              </div>
            </div>
            <br />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Size (Bytes)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Uploaded By
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Last Modification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td className="px-6 py-4">Silver</td>
                    <td className="px-6 py-4">Laptop</td>
                    <td className="px-6 py-4">$2999</td>
                  </tr>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Microsoft Surface Pro
                    </th>
                    <td className="px-6 py-4">White</td>
                    <td className="px-6 py-4">Laptop PC</td>
                    <td className="px-6 py-4">$1999</td>
                  </tr>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Magic Mouse 2
                    </th>
                    <td className="px-6 py-4">Black</td>
                    <td className="px-6 py-4">Accessories</td>
                    <td className="px-6 py-4">$99</td>
                  </tr>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Google Pixel Phone
                    </th>
                    <td className="px-6 py-4">Gray</td>
                    <td className="px-6 py-4">Phone</td>
                    <td className="px-6 py-4">$799</td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple Watch 5
                    </th>
                    <td className="px-6 py-4">Red</td>
                    <td className="px-6 py-4">Wearables</td>
                    <td className="px-6 py-4">$999</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }