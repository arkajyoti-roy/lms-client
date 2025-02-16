import CourseSkeleton from "./CourseSkeleton";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { Link } from "react-router-dom";

const MyLearning = () => {
  const { data, isLoading } = useGetPurchasedCoursesQuery();
  const purchasedCourses = data?.purchasedCourses || [];

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-16 mx-auto">
        <h1 className="mt-20 font-bold text-2xl mb-9 text-start">My Learning</h1>
        {isLoading ? (
          <CourseSkeleton />
        ) : !purchasedCourses.length ? (
          <p className="text-center">You are not enrolled in any Course.</p>
        ) : (
          <div className="flex flex-wrap -m-2 gap-5">
            {purchasedCourses.map((purchase) => (
              purchase.courseId && (
                <Link to={`course-detail/${purchase.courseId._id}`} key={purchase.courseId._id}>
                  <div
                    className="lg:w-1/4 md:w-1/2 w-full p-2 border rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                  >
                    <a className="block relative h-48 rounded overflow-hidden">
                      <img
                        alt="course thumbnail"
                        className="object-cover object-center w-full h-full block"
                        src={purchase.courseId.courseThumbnail || "https://via.placeholder.com/150"}
                      />
                    </a>
                    <div className="mt-4">
                      <h2 className="text-gray-900 title-font text-lg font-medium truncate">
                        {purchase.courseId.courseTitle}
                      </h2>
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 title-font text-s font-medium truncate">
                          By {purchase.courseId.creator?.name || "Unknown Instructor"}
                        </h3>
                        <h3 className="text-xs tracking-widest title-font mb-1">
                          <button className="button">
                            <span className="label">{purchase.courseId.courseLevel}</span>
                          </button>
                        </h3>
                      </div>
                      <p className="mt-1 text-black text-lg font-semibold">₹{purchase.courseId.coursePrice}</p>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyLearning;