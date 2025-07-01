import Theme from "../../components/Theme.jsx";
import ReadySmartCardObject from "./ready_objects/ReadySmartCardObject.jsx";

import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import ReadySmartTestObject from "./ready_objects/ReadySmartTestObject.jsx";
import ReadySummaryObject from "./ready_objects/ReadySummaryObject.jsx";
import {ArrowLeftIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";


function ReadySmartPage() {
     const { materialId } = useParams();
  const [material, setMaterial] = useState(null);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
      useEffect(() => {
    console.log("Material ID from URL:", materialId);

    // Оновлений шлях для запиту
    axios
      .get(`http://localhost:8000/material/get_material/${materialId}`, { withCredentials: true })
      .then((response) => {
        setMaterial(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Помилка завантаження матеріалу");
        setLoading(false);
      });
  }, [materialId]);



        if (loading) return <div className="text-center text-lg"><span className="loading loading-dots loading-xl"></span></div>;
  if (error) return <div className="text-center text-red-500">
      <div role="alert" className=" alert alert-error alert-outline">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error}</span>
</div>
  </div>;
  if (!material) return <div className="text-center">
      <div role="alert" className=" alert alert-error alert-outline">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Матеріал не вдалося знайти :(</span>
</div>
  </div>;


  return (

         <div className="relative flex justify-center  h-full">
               <div className="fixed left-6 top-[90px] z-50">
                  <button
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-12 h-12 rounded-2xl flex items-center
                    justify-center border border-gray-300 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    <ArrowLeftIcon className="w-8 h-8 text-gray-800" />
                  </button>
               </div>
          {material.type === "smart_cards" && <ReadySmartCardObject material={material} />}
          {material.type === "smart_test" && <ReadySmartTestObject material={material} />}
          {material.type === "smart_summary" && <ReadySummaryObject material={material} />}

      </div>

  );
}

export default ReadySmartPage;
