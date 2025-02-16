// import React from 'react'

import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-[#F7F9FA] my-2 px-4 py-4 rounded-md ">
      <h1 className="font-bold text-gray-900">
        
        Lecture - {index+1}: {lecture.lectureTitle
        
        }</h1>

      <Edit
        onClick={goToUpdateLecture}
        className="cursor-pointer text-gray-300 hover:text-blue-600"
        size={20}
      />
    </div>
  );
};

export default Lecture;
