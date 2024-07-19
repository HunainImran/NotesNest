import React from 'react';
import { getInitials } from "../utils/helper"; 

interface ProfileInfoProps {
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-primary font-medium bg-slate-100'>
        {getInitials("John Williams")}
      </div>
      <div>
        <p className='text-sm text-primary font-medium'>John William</p>
        <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
