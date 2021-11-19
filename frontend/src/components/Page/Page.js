import * as React from 'react'
import './Page.css'
import { Topbar, SideBar, ContainerPages } from '../index'
export const Page = ({ children }) => {

  return (
    <>
      <Topbar />
      <div className="mainContainer">
        <SideBar />
        <ContainerPages>
          {children}
        </ContainerPages>
      </div>
    </>
  )
}
