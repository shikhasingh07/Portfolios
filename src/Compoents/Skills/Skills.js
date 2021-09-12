import React from 'react'
import './Skills.css';
import Html from '../../Image/skills/html.png';
import css from '../../Image/skills/css.png';
import boot from '../../Image/skills/bootstrap.png';
import js from '../../Image/skills/js.png';
import react from '../../Image/skills/react.png';
import redux from '../../Image/skills/redux.png';
import Reveal from 'react-reveal/Reveal';
const Skill = [
  Html, css, js, boot, react, redux
]
const Skills = () => {
  return (
    <>
      <Reveal up>
        <section className='section__skills p-0'>
          <div className="section__about section__skills__grid m-auto row p-0">
            {Skill.map((e, index) => {
              return <div className=' circule__bar col-2' key={index}>
                <div className='circule__prog'>
                  <div className="sonar-wrapper">
                    <div className='sonar-emitte'>
                      <div className="sonar-wave d-block">
                        <img src={e} alt="skills" width='80px' height='70px' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })}
          </div>
        </section>
      </Reveal>
    </>
  )
}

export default Skills
