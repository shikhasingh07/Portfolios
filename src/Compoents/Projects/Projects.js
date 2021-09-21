import React from "react";
import "./style.css";
import project2 from "../../Image/pro2.JPG";
import project from "../../Image/project3.JPG";
import github from '../../Image/icons/github.png';
import Reveal from 'react-reveal/Reveal';
const data = [
  {
    projectTitle: `SETEL (LOGISTIKA)`,
    projectSummary:
      "A Logistics website where users can fill in delivery details and get their real-time Updates.",
    Tech: ["React", "JS(ES6)", "NodeJS", "ExpressJS", "MongoDB"],
    picture: project
  },
  {
    projectTitle: "MEMORIES",
    projectSummary:
      "The App is called Memories and it is a simple social media app that allows users to post interesting events that happened in their lives.",
    Tech: ["React", "Redux", "MATERIAL-UI", "JS(ES6)", "NodeJS", "ExpressJS", "MongoDB", "JWT", "OAUTH"],
    Link: "https://github.com/shikhasingh07/memories",
    picture: project2
  },
];
const Projects = () => {
  return (
    <>
      <Reveal up>
        <section className='section__mainCon pt-2' id='Build'>
          <div className="mt-2" >
            <h2 className="numbered-heading about__heading" >What i build </h2>
          </div>

          {data.map((e, index) => {
            return (
              <div className="project__main " key={index + e.Link}>
                <div className="project__content">
                  <div>
                    <p className="project-overline m-0 p-0 ">Featured Project</p>
                    <h3 className="project-title">{e.projectTitle}</h3>
                    <div className="project-description">
                      <p className='text-success p-0 m-0'>{e.projectSummary}</p>
                    </div>
                    <ul className="tech__used">
                      {e.Tech.map((e, i) => {
                        return <li key={i}>{e}</li>
                      })}
                    </ul>
                    {e.Link && <div className="project-links">
                      <a href={e.Link}>
                        <img src={github} alt="github__Img" width='50' />
                      </a>
                    </div>}
                  </div>
                </div>
                <div className="project__Image m-auto">
                  <img src={e.picture} alt="Project__Image" />
                </div>
              </div>
            );
          })}
        </section>
      </Reveal>
    </>

  );
};

export default Projects;
