import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MyLearning from "./MyLearning";
import { useUniversalLogout } from "@/utils/authUtils";
import { useUserDetails } from "@/utils/useUserDetails";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/Components/url";

const Profile = () => {
  const { user, isLoading, isError, error } = useUserDetails();

  const [name, setName] = useState(user?.name || "");
  const [profilePhoto, setProfilePhoto] = useState(null); // Initialize as null

  const { refetch: refetchUserData } = useLoadUserQuery();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0]; // Corrected to 'files'
    if (file) {
      if (file.size > 10485760) {
        // 10MB in bytes
        alert("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }
      setProfilePhoto(file);
    }
  };

  // const updateUserHandle = async () => {
  //   // Trigger the update mutation
  //   const inputData = new FormData();
  //   inputData.append("name", name);
  //   inputData.append("profilePhoto", profilePhoto);
  //   await updateUser(inputData);
  // };

  // --------------------------------------------------
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLD, setIsLD] = useState(false);

  const updateUserHandle = async (e) => {
    e.preventDefault();
    setIsLD(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    try {
      const response = await axios.put(
        `${BASE_URL}/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Enable sending cookies with the request
        }
      );
      // loadUserData();
      // useEffect(()=>{

      // }, )
      setIsDialogOpen(false);
      console.log("Success:", response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      setIsDialogOpen(true);
      console.error("Upload Error:", error);
      toast.error("Upload failed!");
    } finally {
      refetchUserData();

      setIsLD(false); // Reset loading state
    }
  };

  // ------------------------------------------------------

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success(updateUserData.message || "Profile updated successfully");
  //   }
  //   if (updateUserIsError) {
  //     toast.error(updateUserError?.data?.message || "Error updating profile");
  //   }
  // }, [updateUserError, updateUserData, isSuccess, updateUserIsError]);

  const handleLogout = useUniversalLogout();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user data found</div>;




  
  return (
    <>
      <div className="max-w-4xl mx-auto my-24">
        <h1 className="font-bold text-2xl text-center">Profile</h1>
        <div className="flex flex-row items-start mt-8 gap-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              <AvatarImage src={user.photoUrl || ""} />
              <AvatarFallback>{user.name ? user.name.charAt(0) : ""}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex flex-col space-y-4">
              <label className="font-semibold text-xl">
                Name:{" "}
                <span className="font-normal text-gray-700">{user.name}</span>
              </label>
              <label className="font-semibold text-xl">
                Email:{" "}
                <span className="font-normal text-gray-700">{user.email}</span>
              </label>
              <label className="font-semibold text-xl">
                Phone:{" "}
                <span className="font-normal text-gray-700">{user.phone}</span>
              </label>
              <label className="font-semibold text-xl">
                Role:{" "}
                <span className="font-normal text-gray-700">
                  {user.role.toUpperCase()}
                </span>
              </label>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="" onClick={openDialog} className="mt-3">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      value={name || user.name} // Controlled input with value set to state or user name
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photoUrl" className="text-right">
                      Image
                    </Label>
                    <Input
                      type="file"
                      id="photoUrl"
                      onChange={onChangeHandler}
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={updateUserHandle} disabled={isLD}>
                    {isLD ?  <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...
                    </> : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="mt-3 ml-3" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "-190px" }}>
        <MyLearning />
      </div>
    </>
  );
};

export default Profile;
