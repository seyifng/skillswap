import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors"
        >
          SkillSwap
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-6 list-none m-0 p-0">
            <li>
              <Link
                to="/"
                className="px-3 py-2 text-white no-underline hover:text-blue-400 rounded transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="px-3 py-2 text-white no-underline hover:text-blue-400 rounded transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="px-3 py-2 text-white no-underline hover:text-blue-400 rounded transition-colors"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
