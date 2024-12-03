import React from 'react'
import { MdComputer } from 'react-icons/md'
import logo from "../assets/high_res_logo.png";

const Thinking = () => {
  return (
    <div className='message'>
      <div className='message__wrapper flex'>
        <div className='message__pic__bot'>
            <span className='w-16 h-16'>
                <img src={logo} alt='' />
            </span>
        </div>
          <div className="text-left message__createdAt">
              <div className="message__thinking">
                  <span className="mr-2"><span>thinking </span><span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></span>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Thinking