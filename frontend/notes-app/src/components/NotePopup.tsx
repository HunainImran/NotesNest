import React, { useState } from 'react';
import TagsInput from './TagsInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';


interface NotePopupProps {
  noteData?: any; 
  type: string;
  onClose: () => void;
  getAllNotes: () => void;
}

const NotePopup: React.FC<NotePopupProps> = ({ noteData, type, onClose, getAllNotes }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Add note API
  const addNewNote = async () => {
    try{
      const response = await axiosInstance.post('/add-note', {
        title, content, tags
      });
      console.log(response);
      if(response.data && response.data.newNote){
        getAllNotes();
        onClose();
      }
    }
    catch(err: any){
      if(err.response && err.response.data && err.response.data.message){
          console.log(err);
      }
    }
   
  };

  // Edit note API
  const editNote = async () => {

  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title.");
      return;
    }
    if (!content) {
      setError("Please enter the content.");
      return;
    }

    setError("");

    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative'>
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' onClick={onClose}>
        <MdClose className='text-xl text-slate-400'/>
      </button>
      <div className='flex flex-col gap-2'>
        <label className='text-xs text-slate-400'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Do Something'
          value={title}
          onChange={({ target }) => { setTitle(target.value) }}
        />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='text-xs text-slate-400'>CONTENT</label>
        <textarea
          className='text-xs text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({ target }) => { setContent(target.value) }}
        />
      </div>
      <div className='mt-3'>
        <label className='text-xs text-slate-400'>TAGS</label>
        <TagsInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button className='w-full text-sm bg-primary text-white rounded my-1 hover:bg-blue-500 font-medium mt-5 p-3' onClick={handleAddNote}>
        ADD
      </button>
    </div>
  );
}

export default NotePopup;
