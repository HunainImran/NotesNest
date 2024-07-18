import React from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import { MdAdd } from 'react-icons/md';

function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6"> 
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'> 
          <NoteCard 
            title="Complete the project"
            date="2nd August 2024"
            content="Complete the project"
            tags="#workdue"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          <NoteCard 
            title="Complete the project"
            date="2nd August 2024"
            content="Complete the project"
            tags="#workdue"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          <NoteCard 
            title="Complete the project"
            date="2nd August 2024"
            content="Complete the project"
            tags="#workdue"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          <NoteCard 
            title="Complete the project"
            date="2nd August 2024"
            content="Complete the project"
            tags="#workdue"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10" onClick={() => {}}>
        <MdAdd className="text-[32px] text-white"/>
      </button>
    </>
  );
}

export default Home;
