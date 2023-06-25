import React, { useState } from 'react'
import './style.css'
import Reveal from 'react-reveal/Reveal';
const items = [{
  id: 1,
  name: "Engineer",
  company: "Target",
  date: "Jan 10 2022 - Present",
  About: `Part of ongoing project CGI`
}, {
    id: 2,
    name: "Front End Engineer",
    company: "Altran (part of capgemini)",
    date: "Oct 8 2020 - Present",
    About: `Part of the SETEL implementation project name Logsitka, responsible for developing the new Layout and 
    Functionality. 
    ▪️Worked with latest UI Tech like React with typescript. 
    ▪️Some of my work includes a login page and a user landing dashboard. , searching, and tracking pages. 
    Tech - React, Javascript, Typescript, Styling Libraries, Jest.
    `
  }, {
    id: 3,
    name: "Intern",
    date: "Jan 5 2020 - June 30 2020",
    company: "Altran (part of capgemini)",
    About: `
      - I was recruited at Altran in India, Noida campus placements at Amity University(30th Aug)
      - I bagged an Internship and full-time employment with them as a Java intern.
      - Write some assignments with java and manage to complete 
      - Fixing Bugs  Review Code  Documented and much more
    `
  }]
const Experience = () => {
  const [indexOfObj, setIndexOfObj] = useState(0);
  const handleClick = (it) => {
    setIndexOfObj(it);
  }
  return (
    <Reveal up>
      <section className='section__mainCon  container__expience ' id='Experience'>
        <h2 className="numbered-heading about__heading">Where I’ve Worked</h2>
        <div className='inner__experience '>
          <div className='d-block tab__list'>
            <p onClick={() => handleClick(0)} id={0} >Target</p>
            <p onClick={() => handleClick(1)} id={1} >Altran</p>
            <p onClick={() => handleClick(2)} id={2} >Altran(Int)</p>
          </div>
          <div className='data__main ps-2 ' key={items + Math.random()}>
            <div className=' headData d-flex align-items-center'>
              <h3 className='p-0 m-0 '>{items[indexOfObj].name}</h3>
              <p className='text-success  p-0 m-0'>@{items[indexOfObj].company}</p>
            </div>
            <p className='p-0 m-0 d-flex justify-content-start headData' >{items[indexOfObj].date}</p>
            <ul className='ul__list mt-3'>
              {items[indexOfObj].About}
            </ul>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

export default Experience

