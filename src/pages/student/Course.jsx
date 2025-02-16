import { BASE_URL, COURSES_URL } from "@/Components/url";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const response = await axios.get(`${COURSES_URL}/publishedCourses`,{
        //   withCredentials: true
        // });
        const response = await axios.get(`${COURSES_URL}/publichedCourses`);
        // const response = await axios.get('http://localhost:8081/api/v1/course/publichedCourses');
        setCourses(response.data.courses); // Set the courses state with the fetched data
        console.log(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {/* <Link to={`course-detail/${course._id}`}> */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-wrap -m-2 gap-5">
            {courses.map((course) => (
              <Link to={`course-detail/${course._id}`} key={course._id}>
                <div
                  className=" w-11/12 p-2 w-full border rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                  // className="lg:w-[calc(25%-20px)] md:w-[calc(50%-20px)] p-2 w-full border rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                >
                  <a className="block relative h-48 rounded overflow-hidden">
                    <img
                      alt="course thumbnail"
                      className="object-cover object-center w-full h-full block"
                      src={course.courseThumbnail || "https://via.placeholder.com/150"}
                    />
                  </a>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium truncate">
                      {course.courseTitle}
                    </h2>
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 title-font text-s font-medium truncate">
                        By {course.creator.name}
                      </h3>
                      <h3 className="text-xs tracking-widest title-font mb-1">
                        <button className="button">
                          <span className="label">{course.courseLevel}</span>
                        </button>
                      </h3>
                    </div>
                    <p className="mt-1 text-black text-lg font-semibold">₹{course.coursePrice}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* </Link> */}
    </div>
  );
};

export default Course;
