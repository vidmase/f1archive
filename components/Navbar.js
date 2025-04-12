import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios';
import { SparkleText } from "@/components/SparkleText";

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
        console.log('Fetching drivers...');
        const response = await axios.get('/api/drivers');
        console.log('Drivers response:', response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setDrivers(response.data);
        } else {
          console.error('Received invalid drivers data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-black bg-opacity-80 backdrop-blur-sm' : ''}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 relative">
          {/* Left Section (Placeholder or add other links) */}
          <div className="w-1/3"></div>

          {/* Center Logo */}
          <div className="flex-shrink-0 flex justify-center w-1/3">
            <Link href="/" className="block w-fit">
              <SparkleText>
                <Image
                  src="/assets/images/F1.png"
                  width={100}
                  height={25}
                  alt="F1 Logo"
                  className="slide-in-blurred-left"
                />
              </SparkleText>
            </Link>
          </div>

          {/* Right Section - Buttons/Dropdown */}
          <div className="flex items-center justify-end space-x-4 w-1/3">
            {/* Driver Comparison Button */}
            <Link href="/driver-comparison" className="shine-button text-sm">
              Compare Drivers
            </Link>

            {/* Driver Stats Dropdown (conditionally rendered) */}
            {isSearchByRacePage && router.pathname !== '/search-by-race' && (
              <div className="relative">
                <button
                  onClick={fetchDrivers}
                  className="shine-button text-sm inline-flex items-center"
                >
                  Driver Stats {isLoading ? '...' : '▼'}
                </button>
                {isDropdownOpen && !isLoading && drivers.length > 0 && (
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
                {/* Consider better loading/empty state indication */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
