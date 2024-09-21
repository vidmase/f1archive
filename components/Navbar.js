import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isSearchByRacePage = router.pathname === '/search-by-race';

  const fetchDrivers = async () => {
    if (drivers.length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/drivers');  // Updated this line
        const data = await response.json();
        const driverList = data.MRData.DriverTable.Drivers;
        setDrivers(driverList);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-black bg-opacity-80' : ''}`}>
      <div className="w-full">
        <div className="flex justify-center items-center py-4 relative">
          <div className="w-full overflow-hidden">
            <Link href="/" className="block w-fit mx-auto">
              <Image
                src="/assets/images/F1.png"
                width={100}
                height={25}
                alt="F1 Logo"
                className="slide-in-blurred-left"
              />
            </Link>
          </div>
        </div>
      </div>
      {isSearchByRacePage && (
        <div className="absolute top-4 right-10 lg:right-16 xl:right-72">
          <div className="relative">
            <button
              onClick={fetchDrivers}
              className="text-white hover:text-red-500 transition duration-300 focus:outline-none"
            >
              Driver Stats ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-container">
                <ul className="dropdown-menu w-48 bg-black bg-opacity-80 rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                  {drivers.map((driver) => (
                    <li key={driver.driverId}>
                      <Link
                        href={`/driver/${driver.driverId}`}
                        className="block px-4 py-2 text-sm text-white hover:bg-red-500 hover:text-white"
                      >
                        {driver.givenName} {driver.familyName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
