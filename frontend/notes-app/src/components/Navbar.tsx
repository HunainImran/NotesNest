import React, {useState} from 'react';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { UserInfo } from '../utils/constants';


interface NavbarProps {
  userInfo: UserInfo | null;
  onSearchNote: (query: string) => void;
  handleClearSearch: () => void; 
}

function Navbar({userInfo, onSearchNote, handleClearSearch} : NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () =>{
    if (searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () =>{
    setSearchQuery("");
    handleClearSearch();
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-al font-medium text-black py-2 text-primary'>NoteNest</h2>
        <SearchBar value={searchQuery} onChange={({target}) => {
          setSearchQuery(target.value)
        }} handleSearch={handleSearch} onClearSearch={onClearSearch}/>
        <ProfileInfo onLogout={onLogout} userInfo={userInfo}/>
    </div>
  )
}

export default Navbar;
