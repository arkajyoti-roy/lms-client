import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/Components/ui/progress";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { COURSES_URL, MEDIA_URL } from "@/Components/url";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/RichTextEditor";

const CourseTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    isPublished: false,
    lectures: [],
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const params = useParams();
  const courseId = params.courseId;

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${COURSES_URL}/${courseId}`, {
        withCredentials: true,
      });
      const courseData = response.data.course;
      console.log("Fetched course data:", courseData);
  
      if (courseData) {
        setInput({
          courseTitle: courseData.courseTitle || "",
          subTitle: courseData.subTitle || "",
          description: courseData.description || "",
          category: courseData.category || "",
          courseLevel: courseData.courseLevel || "",
          coursePrice: courseData.coursePrice || "",
          courseThumbnail: courseData.courseThumbnail || "",
          isPublished: courseData.isPublished || false,
          lectures: courseData.lectures || [],
        });
        setPreviewThumbnail(courseData.courseThumbnail || "");
      }
    } catch (error) {
      console.error("Error fetching course data!", error);
      toast.error(error.response.data.message || "Error fetching course data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
  
      const formData = new FormData();
      formData.append("file", file);
  
      setMediaProgress(true);
      try {
        console.log('Uploading file...');
        const res = await axios.post(`${MEDIA_URL}/upload-video`, formData, {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        console.log(res.data);
        toast.success("File uploaded successfully!");
        setMediaProgress(false);
      } catch (error) {
        console.error("Error uploading file!", error);
        toast.error(error.response.data.message || "Error uploading file!");
        setMediaProgress(false);
      }
    }
  };
  

  const updateCourseHandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
  
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    
    // Check if the courseThumbnail is a File object, then append it
    if (input.courseThumbnail instanceof File) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
  
    try {
      const response = await axios.put(`${COURSES_URL}/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      toast.success(response.data.message || "Edit Success!");
      toast.success("Edit Success!");
      navigate("/admin/course");
    } catch (error) {
      console.error("Error updating course!", error);
      toast.error(error.response.data.message || "Error updating course!");
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigate = useNavigate();

  const publishStatusHandler = async (publish) => {
    try {
      const res = await axios.patch(
        `${COURSES_URL}/${courseId}?publish=${publish}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Response from publishStatusHandler:", res.data);
      toast.success(res.data.message);
      setInput((prevState) => ({
        ...prevState,
        isPublished: publish === "true",
      }));
      console.log("Updated isPublished state:", publish);
    } catch (error) {
      console.error("Error in publishStatusHandler:", error);
      toast.error(error.response.data.message || 'Failed to update course status.');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Details</CardTitle>
          <CardDescription>
            Make changes to your courses. Click save when you are done.
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button 
            disabled={input.lectures.length === 0} 
            variant="outline" 
            onClick={() => publishStatusHandler(input.isPublished ? "false" : "true")}
          >
            {input.isPublished ? "Unpublished" : "Publish"}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>
      {/* <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              name="courseTitle"
              type="text"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="ex. Fullstack Developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              name="subTitle"
              type="text"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="ex. Become a fullstack developer from zero to hero"
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
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
            <div>
              <Label>Course Level</Label>
              <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="ex. 133"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={selectThumbnail}
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="course thumbnail"
              />
            )}
          </div>
          <div className="space-x-2">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button onClick={updateCourseHandler} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent> */}




      <CardContent>
  <div className="space-y-4 mt-5">
    <div>
      <Label>Title</Label>
      <Input
        name="courseTitle"
        type="text"
        value={input.courseTitle}
        onChange={changeEventHandler}
        placeholder="ex. Fullstack Developer"
      />
    </div>
    <div>
      <Label>Subtitle</Label>
      <Input
        name="subTitle"
        type="text"
        value={input.subTitle}
        onChange={changeEventHandler}
        placeholder="ex. Become a fullstack developer from zero to hero"
      />
    </div>
    <div>
      <Label>Description</Label>
      <RichTextEditor input={input} setInput={setInput} />
    </div>
    <div className="flex items-center gap-5">
      <div>
        <Label>Category</Label>
        <Select value={input.category} onValueChange={selectCategory}>
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
      <div>
        <Label>Course Level</Label>
        <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a course level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Advance">Advance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Price in (INR)</Label>
        <Input
          type="number"
          name="coursePrice"
          value={input.coursePrice}
          onChange={changeEventHandler}
          placeholder="ex. 133"
          className="w-fit"
        />
      </div>
    </div>
    <div>
      <Label>Course Thumbnail</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={selectThumbnail}
        className="w-fit"
      />
      {previewThumbnail && (
        <img
          src={previewThumbnail}
          className="w-64 my-2"
          alt="course thumbnail"
        />
      )}
    </div>
    {mediaProgress && (
      <div className="my-4">
        <p>{uploadProgress}% uploaded</p>
        <Progress value={uploadProgress} />
      </div>
    )}
    <div className="space-x-2">
      <Button onClick={() => navigate("/admin/course")} variant="outline">
        Cancel
      </Button>
      <Button onClick={updateCourseHandler} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  </div>
</CardContent>

    </Card>
  );
};

export default CourseTab;
