import header from "@/app/data/header";

const Header = () => {
  const { title } = header;
  return (<header className="flex items-center justify-between bg-white-100 py-4 px-6 border-b ">
    <div className="shrink-0 ">
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
  </header>)
};

export default Header;
