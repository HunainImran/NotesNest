import React from 'react';
import { getInitials } from "../utils/helper";
import { UserInfo } from '../utils/constants'; 


interface ProfileInfoProps {
  onLogout: () => void;
  userInfo: UserInfo | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onLogout , userInfo}) => {
  console.log(userInfo);
  const initials = userInfo ? getInitials(userInfo.firstName + ' ' + userInfo.lastName) : 'NN';
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-primary font-medium bg-slate-100'>
        {initials}
      </div>
      <div>
        <p className='text-sm text-primary font-medium'>{userInfo?.firstName + ' ' + userInfo?.lastName}</p>
        <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
