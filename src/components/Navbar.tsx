import { GiFlatHammer } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";

interface NavbarProps {
  onClick: () => void;
}

const Navbar = ({ onClick }: NavbarProps) => {
  return (
    <nav className="border-b border-(--white-10)">
      <div className="max-w-[1000px] m-auto p-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <GiFlatHammer color="#8c2bee" size={22} />
          <h1 className="text-(--white) text-xl font-bold">ReadMeForge</h1>
        </div>

        <div
          className="p-3 rounded-full hover:bg-(--accent-10) cursor-pointer"
          onClick={onClick}
        >
          <IoSettingsOutline size={22} color="#fff" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
