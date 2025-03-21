import React from 'react'
import { Link } from 'react-router-dom'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'

const Sidebar = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }




  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3  className='icon_header'/> SolidTrack
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/products">
                    <BsFillArchiveFill className='icon'/> Products
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/Materials">
                    <BsFillGrid3X3GapFill className='icon'/> Materials
                </Link>
            </li>   
            <li className='sidebar-list-item'>
                <Link to="/customers">
                    <BsPeopleFill className='icon'/> Customers
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/orders">
                    <BsListCheck className='icon'/> Orders
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/approve-payments">
                    <BsMenuButtonWideFill className='icon'/> Approve Payments
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/settings">
                    <BsFillGearFill className='icon'/> Settings
                </Link>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar