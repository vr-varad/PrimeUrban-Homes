import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import {useSelector} from "react-redux";

const Header = () => {
  const {user} = useSelector(state => state.user);
  return (
    <header className="bg-blue-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className=" font-bold text-lg sm:text-3xl flex flex-col">
            <span className="text-blue-500">PrimeUrban</span>
            <span className="text-blue-700">Homes</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 p-2"
          />
          <FaSearch className="text-blue-600" />
        </form>
        <ul className="flex gap-10">
          <Link
            to={"/"}
            className="hidden lg:inline text-blue-700 hover:underline text-lg"
          >
            Home
          </Link>
          <Link
            to={"/about"}
            className="hidden lg:inline text-blue-700 hover:underline text-lg"
          >
            About
          </Link>
          <Link to={'/profile'}>
          {user ? (
            <img src={user.userWithoutPassword.profilePicture} alt="profile" className=" rounded-full h-7 w-7 object-cover"/>
          ) : <li className="text-blue-700 hover:underline text-lg">SignIn</li>}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
