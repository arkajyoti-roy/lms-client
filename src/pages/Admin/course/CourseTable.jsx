import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { COURSES_URL } from "@/Components/url";

const CourseTable = () => { 
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const url = `${COURSES_URL}/getCourses`;
      if (!url) {
        setError(new Error("URL is empty or invalid"));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(url, {
          withCredentials: true, // If your API requires credentials
        });

        if (!response.data || !Array.isArray(response.data.courses)) {
          setError(new Error("Invalid response format"));
          setLoading(false);
          return;
        }

        const courseData = response.data.courses;
        setCourses(courseData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  if (courses.length === 0) return (
    <div>
      <Button className="mb-3" onClick={() => navigate(`create`)}>
        Create a new course
      </Button>
      <br/>
      <p>No courses available. </p>
    </div>
      );
  return (
    <div>
      <Button className="mb-3" onClick={() => navigate(`create`)}>
        Create a new course
      </Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course.coursePrice ? course.coursePrice : "N/A"}</TableCell>
              <TableCell>{course.isPublished ? "Published" : "Draft"}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>{course.courseDescription}</TableCell>
              <TableCell className="text-right">
                <Button onClick={()=> navigate(`${course._id}`)}>Edit<Edit /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CourseTable;