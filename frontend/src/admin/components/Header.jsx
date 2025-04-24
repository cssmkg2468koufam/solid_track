import React  from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillBellFill, BsFillEnvelopeFill, BsSearch, BsJustify, BsPersonCircle } from 'react-icons/bs';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className='menu-icon'>
        <BsJustify className='icon' />
      </div>
      <div className='header-left'>
        <BsSearch className='icon' />
      </div> 
      <div className='header-right'>
        <BsFillBellFill className='icon' />
        {/* <BsFillEnvelopeFill className='icon' /> */}
        <BsPersonCircle className='icon' 
          onClick={() => navigate('/adminprofile-admin')}
        />
      </div>
    </header>
  );
};

export default Header;
