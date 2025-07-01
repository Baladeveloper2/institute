<<<<<<< HEAD
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/Logos.jpeg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../config/API'; // Ensure your API is set up properly
import { Outlet } from 'react-router-dom'; // 
import axios from 'axios';


const navigation = [
  { name: 'Home', to: '/student', key: 'dashboard' },
  { name: 'My Exams', to: '/student/exams', key: 'examslist' },
  {name:"Available Exams", to :"/student/exams-list",key:'exams-list'},
  { name: 'Exam Requests', to: '/student/request-exams', key: 'request' },
  
  { name: 'Batch List', to: '/student/batchlist', key: 'Batches' },
  { name: 'My Profile', to: '/student/profile', key: 'userprofile' },
  { name: 'Logout', key: 'logout', isLogout: true }, // still no `to`
];

=======
import { Fragment, useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// import logo from '../../assets/Logos.jpeg'; // Uncomment if needed
>>>>>>> a5be5d2 (updated code)

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

<<<<<<< HEAD
const StudentDashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
=======
const StudentDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setStudentId(id);

    const navItems = [
      { name: 'Home', to: '/student', key: 'dashboard' },
      { name: 'My Exams', to: '/student/exams', key: 'examslist' },
      { name: 'Available Exams', to: '/student/exams-list', key: 'exams-list' },
      { name: 'Exam Requests', to: '/student/request-exams', key: 'request' },
      { name: 'Batch List', to: '/student/batchlist', key: 'Batches' },
      { name: 'My Profile', to: '/student/profile', key: 'userprofile' },
      { name: 'Reports', to: `/student/reports/${id}`, key: 'reports' },
      { name: 'Logout', key: 'logout', isLogout: true },
    ];

    setNavigation(navItems);
  }, []);
>>>>>>> a5be5d2 (updated code)

  const handleLogout = async () => {
    try {
      await axios.post("https://backend-institute-production.up.railway.app/Student/Logout");
      toast.success("Logout Successful!");
<<<<<<< HEAD
=======
      localStorage.removeItem('userId');
>>>>>>> a5be5d2 (updated code)
      setTimeout(() => {
        navigate('/student-Login');
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Logout Failed!");
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
            <div className="flex h-30 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* <img src={logo} alt="Logo" className="w-28 h-28 rounded-full object-cover ml-30 md:object-center" /> */}
=======
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" /> */}
>>>>>>> a5be5d2 (updated code)
                </div>
                <div className="hidden md:block ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) =>
                    item.isLogout ? (
                      <span
                        key={item.key}
                        onClick={handleLogout}
                        className="cursor-pointer text-red-400 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        key={item.key}
                        to={item.to}
                        className={classNames(
<<<<<<< HEAD
                          location.pathname === item.to
=======
                          location.pathname === item.to ||
                          location.pathname.startsWith(item.to)
>>>>>>> a5be5d2 (updated code)
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center">
                <button
                  type="button"
                  className="hidden md:inline-flex rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                >
                  {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>
                <div className="md:hidden ml-4">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
=======
              {/* Mobile menu button */}
              <div className="md:hidden ml-4">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
>>>>>>> a5be5d2 (updated code)
              </div>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) =>
                item.isLogout ? (
                  <Disclosure.Button
                    key={item.key}
                    as="span"
                    onClick={handleLogout}
                    className="block text-red-400 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                  >
                    {item.name}
                  </Disclosure.Button>
                ) : (
                  <Disclosure.Button
                    key={item.key}
                    as={Link}
                    to={item.to}
                    className={classNames(
<<<<<<< HEAD
                     location.pathname === item.to || location.pathname.startsWith(item.to)
=======
                      location.pathname === item.to ||
                      location.pathname.startsWith(item.to)
>>>>>>> a5be5d2 (updated code)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                )
              )}
            </div>
          </Disclosure.Panel>

          {/* Main Content */}
<<<<<<< HEAD
          <main className="bg-gray-100 min-h-screen p-4">{children}
             <Outlet />   {/* this renders nested routes */}
=======
          <main className="bg-gray-100 min-h-screen p-4">
            <Outlet />
>>>>>>> a5be5d2 (updated code)
          </main>
        </>
      )}
    </Disclosure>
  );
};

export default StudentDashboardLayout;
