import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { COURSES_URL } from "@/Components/url";

const AddCourse = () => {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Define a local state for isLoading

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    const cous = { courseTitle, category };
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post(
        `${COURSES_URL}`,
        cous,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials with the request
        }
      );
      // Handle the response as needed
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully!");
    
    navigate("/admin/course");
    } catch (error) {
      // Handle the error as needed
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setIsLoading(false); // Set loading to false when the request ends
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add new courses with details...</h1>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
            }}
            placeholder="Course name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="DSA">DSA</SelectItem>
              <SelectItem value="Cloud">Cloud</SelectItem>
              <SelectItem value="Networking">Networking</SelectItem>
              <SelectItem value="DBMS">DBMS</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/admin/course`)} variant="outline">
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
