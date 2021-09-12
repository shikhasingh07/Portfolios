import React from 'react'
import logo from '../../Image/logo.png';
import './Navbar.css';
import { HashLink } from 'react-router-hash-link';
import { Router } from 'react-router-dom';
const Navbar = () => {
  return (
    <>
      <header className='header___NavBar'>
        <nav className='row m-0 p-4'>
          <div className='logo__media col-2 '>
            <HashLink
              to="/path#data__mainScreen"
              scroll={(el) => el.scrollIntoView({ behavior: 'auto' })}
            > <img src={logo} alt='ImageC' width='50' />
            </HashLink>
          </div>
          <div className='nav__essentails col-10 col-md-6 m-0 p-0'>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='m-0 p-0  nav__bar'>
                <span><HashLink
                  to="/path#main__about"
                  scroll={(el) => el.scrollIntoView({ behavior: 'auto' })}
                >About</HashLink>
                </span>
                <span><HashLink
                  to="/path#Experience"
                  scroll={(el) => el.scrollIntoView({ behavior: 'auto', block: 'end' })}
                > Experience</HashLink></span>
                <span>
                  < HashLink
                    to="/path#Build"
                    scroll={(el) => el.scrollIntoView({ behavior: 'auto' })}
                  > Work</HashLink></span>
                <span>< HashLink
                  to="/path#contact"
                  scroll={(el) => el.scrollIntoView({ behavior: 'auto', block: 'end' })}
                >Contact</HashLink></span>
                <button className='btn  btn__resume'><a href="https://drive.google.com/file/d/1qkW28AjLDI7ZLVWRgqLBBkizhP5DSBdm/view?usp=sharing"> Resume</a></button>
              </div>
            </div>
          </div>
          <div className='col-2  m-0 p-0'>
            <div
              orientation="right"
              className="side__StyledSideElement-sc-1duznzb-0 jSIwrL"
            >
              <div className="email__StyledLinkWrapper-sc-2epoq-0 jJFfEJ fade-enter-done">
                <a href="mailto:shikha.thankur2295@gmail.com">
                  shikha.thankur2295@gmail.com
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar;