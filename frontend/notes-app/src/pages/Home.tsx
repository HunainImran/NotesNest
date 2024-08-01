import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import NotePopup from '../components/NotePopup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {Note, UserInfo} from '../utils/constants';


interface ModalState {
  isShown: boolean;
  type: "add" | "edit";
  data: Note | null; 
}


function Home() {

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [openAddEditModal, setOpenAddEditModal] = useState<ModalState>({ isShown: false, type: "add", data: null });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); 
  const [isSearch, setIsSearch] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails: Note) => {
      setOpenAddEditModal({isShown:true, data: noteDetails, type: "edit"})
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
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
        //Will add a toast message
    }
  }

  const deleteNotes = async (note: Note) => {
    const noteId = note._id;
    try{
      const response = await axiosInstance.delete('/delete-note/' + noteId);
      if(response.data && response.data.message){
        getAllNotes();
      }
    }
    catch(err: any){
      if(err.response && err.response.data && err.response.data.message){
          //Will add a toast message
      }
    }
  }

  const onSearchNote = async (query: string) => {
    try{
      const response = await axiosInstance.get("/search-notes", {
        params: {query},
      });

      if (response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }
    catch(err:any){
        //Will add a toast message
    }
  }
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  const updateIsPinned = async (noteData : Note) => {
    const noteId = noteData._id;
    try{
      const response = await axiosInstance.put('/update-note-pinned/' + noteId, {
        isPinned : !noteData.isPinned,
      });
      if(response.data && response.data.existingNote){
        getAllNotes();
      }
    }
    catch(err: any){
      if(err.response && err.response.data && err.response.data.message){
          //Will add a toast message
      }
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []); 


  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
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
              onPinNote={() => {updateIsPinned(item)}}
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
