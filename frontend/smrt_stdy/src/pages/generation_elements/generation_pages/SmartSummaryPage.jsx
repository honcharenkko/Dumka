
import Theme from "../../../components/Theme.jsx";
import SmartSummaryForm from "../generation_forms/SmartSummaryForm.jsx";
import {ArrowLeftIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

function SmartSummaryPage() {
    const navigate = useNavigate();
  return (

       <div className="relative flex justify-center  h-screen">
   <div className="fixed left-6 top-[90px] z-50">
              <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-12 h-12 rounded-2xl flex items-center
                justify-center border border-gray-300 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <ArrowLeftIcon className="w-8 h-8 text-gray-800" />
              </button>
            </div>

        <SmartSummaryForm/>
      </div>

  );
}

export default SmartSummaryPage;