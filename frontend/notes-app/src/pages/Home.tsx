import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import NotePopup from '../components/NotePopup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';


interface Note {
  _id: string;
  title: string;
  content: string;
  createdOn: string;
  tags: string[];
  isPinned: boolean;
}
interface ModalState {
  isShown: boolean;
  type: "add" | "edit";
  data: Note | null; // Adjusted to accept Note or null
}


function Home() {
  // Define the type for userInfo
interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  // Add other properties as needed
}
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [openAddEditModal, setOpenAddEditModal] = useState<ModalState>({ isShown: false, type: "add", data: null });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); 
  const navigate = useNavigate();

  const handleEdit = (noteDetails: Note) => {
      setOpenAddEditModal({isShown:true, data: noteDetails, type: "edit"})
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data) {
        setUserInfo(response.data);
        console.log("USER INFO STATE : ", userInfo);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        console.error("Error fetching user info:", error);
      }
    }
  };

  const getAllNotes = async () => {
    try{
      const response = await axiosInstance.get("/get-all-notes/");
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);
      }
    }
    catch(err: any){
        console.log(err);
    }
  }

  const deleteNotes = async (note: Note) => {
    const noteId = note._id;
    try{
      const response = await axiosInstance.delete('/delete-note/' + noteId);
      console.log(response);
      if(response.data && response.data.message){
        getAllNotes();
      }
    }
    catch(err: any){
      if(err.response && err.response.data && err.response.data.message){
          console.log(err);
      }
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []); 


  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto px-6">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item,index) => (
              <NoteCard 
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNotes(item)}
              onPinNote={() => {}}
            />
          ))}
          
        </div>
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10" onClick={() => { setOpenAddEditModal({ isShown: true, type: "add", data: null }) }}>
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <NotePopup noteData={openAddEditModal.data} type={openAddEditModal.type} onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }} getAllNotes={getAllNotes}/>
      </Modal>
    </>
  );
}

export default Home;
