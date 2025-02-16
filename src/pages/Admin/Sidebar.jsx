import { Link, Outlet } from "react-router-dom";
import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";



const Sidebar = () => {
  return (
    <>
     <div className="flex mt-12  top-0">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5   h-screen">
        <div className="space-y-4 ">
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
          <Link to="ins-profile" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Profile</h1>
          </Link>
        </div>
      </div>
    <div className="flex-1 p-10 ">
        <Outlet/>
      </div>
    </div>

 
    
   
    </>
  );
};

export default Sidebar;
