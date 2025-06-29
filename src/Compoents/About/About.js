import React from "react";
import Reveal from "react-reveal/Reveal";
import { HashLink } from "react-router-hash-link";
import "./about.css";

const About = () => {
  return (
    <>
      <div
        orientation="left"
        className="side__StyledSideElement-sc-1duznzb-0 hOvuuP"
      >
        <ul className="social__StyledSocialList-anu6nt-0 dVLQAC fade-enter-done">
          <li className="mt-2">
            <a
              href="https://github.com/shikhasingh07"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-github"
              >
                <title>GitHub</title>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </li>

          <li className="mt-2">
            <a
              href="https://www.linkedin.com/in/shikha-singh-b027a7179/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-linkedin"
              >
                <title>LinkedIn</title>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </li>
          <li className="mt-2 mb-2">
            <a
              href="mailto:shikha.thakur2295"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-external-link"
              >
                <title>External Link</title>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <main>
        <section className="section__mainCon " id="data__mainScreen">
          <div className="m-auto main__con pt-2">
            <p className="heading__para mt-5 p-0">Hi, my name is</p>
            <h3 className="heading__h p-0 m-0">Shikha Singh</h3>
            <div className="fadeup-enter-dones">
              <p className="pheading ">
                I’m a software engineer specializing in creating exceptional
                digital experiences, with occasional involvement in design.
                Currently, I focus on developing accessible, human-centered
                products at
                <a
                  href="https://india.target.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="text-success p-0 m-0"> @Target</p>
                </a>
                .
              </p>
            </div>
            <HashLink
              to="/path#skills__list"
              scroll={(el) =>
                el.scrollIntoView({ behavior: "auto", block: "end" })
              }
            >
              <div className="fadeup-enter-done mt-3">
                <p className="email__link">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Check out my Skills!
                </p>
              </div>
            </HashLink>
          </div>
        </section>
        <Reveal up>
          <section className="m-auto section__mainCon" id="main__about">
            <div className="section__about m-auto ">
              <h2 className="numbered-heading about__heading ">About Me</h2>
              <div className="inner">
                <div className=" kNIdQM">
                  <div className="paaraa___heading ">
                    <p>
                      Myself Shikha, UI Engineer with 4+ years of experience
                      building scalable web and mobile solutions using React.js,
                      TypeScript, JavaScript, and Three.js. Delivered
                      high-performance 3D UIs and real-time dashboards,
                      including a full 3D home platform that improved processing
                      by 35% and reduced latency by 60%. Recognized with
                      Target’s Quarterly Excellence Award for launching a full
                      learning platform in under 20 days. Passionate about clean
                      code, fast execution, and user-first design.
                    </p>
                    <p>
                      Fast-forward to today, and I’ve had the privilege of
                      working at{" "}
                      <a
                        href="https://india.target.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Target
                      </a>
                      , where I continue to grow and contribute to impactful
                      projects.
                    </p>
                    <ul className="skills-list" id="skills__list">
                      <li>JavaScript (ES6+)</li>
                      <li>React</li>
                      <li>Redux</li>
                      <li>Styling Libries</li>
                      <li>Jest</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </>
  );
};

export default About;
