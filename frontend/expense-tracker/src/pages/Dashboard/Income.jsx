import React from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from 'react';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance'; // Adjust the path if needed
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm'; // Adjust the path if needed
import { API_PATHS } from '../../utils/apiPaths'; // Adjust the path if needed
import { toast } from 'react-hot-toast';
import { useEffect } from 'react'; 
import IncomeList from '../../components/Income/IncomeList'; 
import { useUserAuth } from '../../hooks/useUserAuth'; // Adjust the path if needed
import DeleteAlert from '../../components/DeleteAlert'; // Adjust the path if needed


const Income = () => {  
   useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const[openDeleteAlert,setOpenDeleteAlert]=useState({
    show:false,
    data:null,
  });
  const [openAddIncomeModal,setOpenAddIncomeModal]=useState(false);
  
  //Get All income details
  const fetchIncomeDetails = async () => {
    if(loading) return;
    setLoading(true);
    try {
      const response=await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if(response.data){
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong while fetching income details", error);
    }finally {
      setLoading(false);
    }
  };

  // handle add income
  const handleAddIncome = async (income) => {
     const{source,amount,date,icon}=income;
     if(!source.trim()){
      toast.error("Source is requires");
      return;
     }
     if(!amount || isNaN(amount)|| Number(amount)<=0){
      toast.error("Valid amount is required");
      return;
     }
     if(!date){
      toast.error("Date is required");
      return;
     }
     try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
     });
      toast.success("Income added successfully");
      setOpenAddIncomeModal(false);
      fetchIncomeDetails();
     }catch(error){
      console.log("Error ading income:",error.response?.data?.message || error.message);
     }

  };

  // delete add income
  const deleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income deleted successfully");
      setOpenDeleteAlert({show:false, data:null});
      fetchIncomeDetails(); 
    }catch(error){
      console.error('error deleting income:', error.response?.data?.message || error.message);
  };
}
  // handle download income
  const handleDownloadDeleteIncome = async() => {
    try{
      const response = await axiosInstance.get (
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob"
        }
      );

      const url = window.URL. createObjectURL(new Blob([response]));
      const link = document. createElement("a");
      link.href= url;
      link.setAttribute("download", "income_details.xslx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } 
    catch(error){
      console.log("Error downloading income details", error);
      toast.error("Failed to download income details. Please try again later");
    }
  };
  
  useEffect(() => {
    fetchIncomeDetails();
  }, []);
  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList 
          transactions={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({
              show:true,
              data:id
            });
          }}
          onDownload={handleDownloadDeleteIncome}
          />
        </div>
        <Modal 
        isOpen={openAddIncomeModal}
        onClose={() => setOpenAddIncomeModal(false)}
        title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show:false, data:null})}
        title="Delete Income"
        >
          <DeleteAlert 
          content="Are you sure you want to delete this income?"
          onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
        </div>
        </DashboardLayout>

  )
}

export default Income