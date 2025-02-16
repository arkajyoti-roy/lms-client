import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COURSES_URL } from "@/Components/url";
import { toast } from "react-toastify";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectures, setLectures] = useState([]); // Initialize as an empty array
  const params = useParams();
  const courseId = params.courseId;
// const lectureId = params.lectureId;
// const lectureId = params.lectureId;
  const createLectureHandler = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${COURSES_URL}/${courseId}/lecture`,
        { lectureTitle: lectureTitle },
        {
          withCredentials: true, // If your API requires credentials
        }
      );
      // navigate("")
      console.log("Lecture created:", response.data);
      toast.success("Lecture created successfully!");
      const newLectureId = response.data.lecture._id;
      setTimeout(() => {
        navigate(`/admin/course/${courseId}/lecture/${newLectureId}`);
      },300);
      // Optionally, fetch the updated list of lectures
      getLectures();
    } catch (error) {
      console.error("Error creating lecture!", error);
      toast.error(error.response?.data?.message || "Error creating lecture!");
    } finally {
      setIsLoading(false);
    }
  };

  const getLectures = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${COURSES_URL}/${courseId}/lecture`, {
        withCredentials: true, // If your API requires credentials
      });
      setLectures(response.data.lectures);
      console.log("Lectures fetched:", response.data);
    } catch (error) {
      console.error("Error fetching lecture data!", error);
      toast.error(
        error.response?.data?.message || "Error fetching lecture data!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLectures();
  }, [courseId]);

  return (
    <>
      <div className="flex-1 mx-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl">
            Add new lectures with details...
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => {
                setLectureTitle(e.target.value);
              }}
              placeholder="Title name"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/admin/course/${courseId}`)}
              variant="outline"
            >
              Back to course
            </Button>
            <Button disabled={isLoading} onClick={createLectureHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait
                </>
              ) : (
                "Create lecture"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading lectures...
            </div>
          ) : lectures.length === 0 ? (
            <p>No lectures found.</p>
          ) : (
            <>
              {lectures.map((lecture, index) => (
                <Lecture key={lecture._id} courseId={courseId} lecture={lecture} index={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateLecture;
