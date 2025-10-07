import { Outlet, NavLink } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout(){
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-2 d-none d-lg-block">
            <div className="list-group card-shadow">
              <NavLink to="/" end className={({isActive})=> 'list-group-item list-group-item-action ' + (isActive?'active':'')}>แดชบอร์ด</NavLink>
              <NavLink to="/children" className={({isActive})=> 'list-group-item list-group-item-action ' + (isActive?'active':'')}>ข้อมูลเด็ก</NavLink>
            </div>
          </div>
          <div className="col-lg-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}
