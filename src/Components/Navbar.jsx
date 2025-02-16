import { CropIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUniversalLogout } from "@/utils/authUtils";
import { useUserDetails } from "@/utils/useUserDetails"; // Corrected import statement
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user, isLoading } = useUserDetails();
  const handleLogout = useUniversalLogout(); // Ensure the hook is always called at the top level

  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  const handleLoginClick = () => {
    navigate("/login", { state: { tab: "login" } }); // Pass state to control the tab
  };
  const handleSignupClick = () => {
    navigate("/login", { state: { tab: "signup" } }); // Pass state to control the tab
  };
  // const handleButtonClick = () => {
  //   navigate('/nextPage'); // Navigate to the next page
  //   setTimeout(() => {
  //     document.querySelector('#signup').click(); // Simulate click on the signup button
  //   }, 0);
  // };
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-[#F9FAFB] flex items-center md:justify-around md:gap-96 px-4 shadow-md fixed top-0 left-0 right-0 duration-300 justify-between z-40">
      <Link to="/">
        <div className="flex items-center space-x-2">
          <CropIcon size={"30"} />
          <h1 className="font-extrabold text-2xl">XYZ</h1>
        </div>
      </Link>
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger>
            {user ? (
              <Avatar>
                <AvatarImage src={user.photoUrl || ""} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0) : "&"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <MenuIcon size={"30"} />
            )}
          </SheetTrigger>
          <SheetContent>
            {user ? (
              <>
                <SheetHeader>
                  <div className="flex justify-center items-center">
                    <Avatar>
                      <AvatarImage src={user.photoUrl || ""} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0) : "&"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <SheetTitle>My Account</SheetTitle>
                  <div className="flex flex-col space-y-1 justify-start items-start text-2xl font-semibold">
                    {user?.role === "student" ? (
                      <>
                        <button>
                          <Link to="profile">Profile</Link>
                        </button>
                        <button>
                          <Link to="my-learning">My Learning</Link>
                        </button>
                      </>
                    ) : (
                      <>
                        <button>
                          <Link to="admin/ins-profile">Profile</Link>
                        </button>
                        <button>
                          <Link to="admin/dashboard">Dashboard</Link>
                        </button>
                        <button>
                          <Link to="admin/course">Course</Link>
                        </button>
                      </>
                    )}
                    {/* <button>xyz</button> */}
                  </div>
                  <Button onClick={handleLogout}>Logout</Button>
                </SheetHeader>
              </>
            ) : (
              <div className="flex flex-col space-y-4 mt-8">
                <Button onClick={handleLoginClick}>Login</Button>
                <Button onClick={handleSignupClick}>Signup</Button>
                {/* <Button><Link to="login">Login</Link></Button>
                <Button><Link to="login">Signup</Link></Button> */}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.photoUrl || ""} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0) : "&"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === "student" ? (
                  <>
                    <DropdownMenuItem>
                      <Link to="profile">
                        <button
                          className="text-left"
                          style={{ width: "100px" }}
                        >
                          Profile
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="my-learning">
                        <button
                          className="text-left"
                          style={{ width: "100px" }}
                        >
                          My Learning
                        </button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link to="admin/ins-profile">
                        <button
                          className="text-left"
                          style={{ width: "100px" }}
                        >
                          Profile
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="admin/dashboard">
                        <button
                          className="text-left"
                          style={{ width: "100px" }}
                        >
                          Dashboard
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="admin/course">
                        <button
                          className="text-left"
                          style={{ width: "100px" }}
                        >
                          Course
                        </button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem>
                  <Button style={{ width: "100px" }} onClick={handleLogout}>
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <span>{user.name}</span>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <Button onClick={handleLoginClick}>Login</Button>
            <Button onClick={handleSignupClick}>Signup</Button>
            {/* <Button><Link to="login">Login</Link></Button>
            <Button><Link to="login">Signup</Link></Button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
