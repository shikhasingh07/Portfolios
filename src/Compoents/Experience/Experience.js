import React, { useState } from 'react'
import './style.css'
import Reveal from 'react-reveal/Reveal';
const items = [{
  id: 1,
  name: "Front End Engineer",
  company: "Altran (part of capgemini)",
  date: "Oct 8 2020 - Present",
  About: [
    'Part of the SETEL team, responsible for developing the website, development in auth and functions for internals',
    'Write modern, performant, maintainable code for a diverse array of client and internal projects'
    , 'Making functional components with React Hook, Styling Libraries(Material UI, Bootstrap, etc..), Include Typescript, and Test cases from Jest, Mocha'
  ]
}, {
  id: 2,
  name: "Intern",
  date: "Jan 5 2020 - June 30 2020",
  company: "Altran (part of capgemini)",
  About: [
    'I was recruited at Altran in India, Noida campus placements at Amity University(30th Aug).'
    , 'I bagged an Internship and full-time employment with them as a Java intern.',
    'Write some assignments with java and manage to complete',
    'Fixing Bugs  Review Code  Documented and much more'
  ]
}]
const Experience = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);
  const [style, setStyle] = useState(false);
  const handleSubmit = (e) => {
    const j = e.target.id;
    const it = items.filter(e => e.id === parseInt(j));
    setData(it);
    setShow(false);
    setStyle(!style);
  }

  return (
    <>
      <Reveal up>
        <section className='section__mainCon  container__expience p-0' id='Experience'>
          <h2 className="numbered-heading about__heading">Where I’ve Worked</h2>
          <div className='inner__experience '>
            <div className='d-block tab__list'>
              <p onClick={handleSubmit} id="1" className={style === false ? 'd-block btn__tablist plus headData' : 'd-block  btn__tablist headData'}>Altran</p>
              <p onClick={handleSubmit} id="2" className={style === true ? 'd-block  btn__tablist plus headData' : 'd-block  btn__tablist headData'}>Altran</p>
            </div>
            <div>
              {show === true ?
                <div className='data__main ps-2'>
                  <div className='headData d-flex align-items-center'>
                    <h3 className='p-0 m-0'>Front End Engineer</h3>
                    <a
                      href="https://capgemini-engineering.com/in/en/"
                      rel="noopener noreferrer"
                      target="_blank"
                      className='ms-2'
                    >
                      <p className='text-success p-0 m-0'>@Altran(part of Capgemini)</p>
                    </a>
                  </div>
                  <p className='p-0 m-0 d-flex justify-content-start headData'>oct 8 2020 - Present</p>
                  <ul className='ul__list mt-3'>
                    {items[0].About.map((e, i) => {
                      return <li key={i}>{e}</li>
                    })}
                  </ul>
                </div>
                : data.map(e => {
                  return <div className='data__main ps-2 ' key={e.id}>
                    <div className=' headData d-flex align-items-center'>
                      <h3 className='p-0 m-0 '>{e.name}</h3>
                      <a
                        href="https://capgemini-engineering.com/in/en/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className='ms-2'
                      >
                        <p className='text-success  p-0 m-0'>@{e.company}</p>
                      </a>
                    </div>
                    <p className='p-0 m-0 d-flex justify-content-start headData' >{e.date}</p>
                    <ul className='ul__list mt-3'>
                      {e.About.map((e, i) => {
                        return <li key={i}>{e}</li>
                      })}
                    </ul>
                  </div>
                })}
            </div>
          </div>
        </section>
      </Reveal>
    </>
  )
}

export default Experience
