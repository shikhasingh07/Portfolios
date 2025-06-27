import React, { useState } from "react";
import "./style.css";
import Reveal from "react-reveal/Reveal";
const items = [
  {
    id: 1,
    name: "Software Engineer (SDE-I) ",
    company: "Target",
    date: "Jan 10 2022 - Present",
    About: `Projects - [AssetHUB, GGA (EXT + INT), Sandbox, TechMentorHUB]
  • Spearheaded optimization of heavy 3D file handling, enabling multi-version rendering while significantly
reducing package size and improving UI load times and latency.
• Successfully onboarded 7000+ external vendors/National Brands, streamlining feature creation
requests as part of the external-facing team and delivering key features in under 3 months.
• Optimized API latency by 55% by integrating AI-powered asset size comparison and doubling
transcoding speed using Web Workers.
• Built an app for Target’s Elevate team in under 2 months, enabling 500+ users to manage sessions,
attendance, food reservations, and mentorship activities.
• Collaborated with teams to enhance StyleAssist and AI Image Search, improving UX and search
performance.`,
  },
  {
    id: 2,
    name: "Software Engineer (SDE-I) ",
    company: "Altran (part of capgemini)",
    date: "Nov 2020- Jan 2022",
    About: `Projects - [LIC , Logistka]
    • Developed a full application from scratch in React JS, architecting core features and workflows, and
implemented a comprehensive testing setup to ensure code quality and reliability.
• Owned and collaborated on multiple features, delivering solutions for real-time customers up to
6,000+ Workers. Improved and created a new, modern React workflow integrated with a
recommendation model.`,
  },
  {
    id: 3,
    name: "Intern",
    date: "Jan 5 2020 - June 30 2020",
    company: "Altran (part of capgemini)",
    About: `
      - I was recruited at Altran in India, Noida campus placements at Amity University(30th Aug)
      - I bagged an Internship and full-time employment with them as a Java intern.
      - Write some assignments with java and manage to complete 
      - Fixing Bugs  Review Code  Documented and much more
    `,
  },
];
const Experience = () => {
  const [indexOfObj, setIndexOfObj] = useState(0);
  const handleClick = (it) => {
    setIndexOfObj(it);
  };
  return (
    <Reveal up>
      <section
        className="section__mainCon  container__expience "
        id="Experience"
      >
        <h2 className="numbered-heading about__heading">Where I’ve Worked</h2>
        <div className="inner__experience ">
          <div className="d-block tab__list">
            <p onClick={() => handleClick(0)} id={0}>
              Target
            </p>
            <p onClick={() => handleClick(1)} id={1}>
            Capgemini
            </p>
            <p onClick={() => handleClick(2)} id={2}>
              Altran(Int)
            </p>
          </div>
          <div className="data__main ps-2 " key={items + Math.random()}>
            <div className=" headData d-flex align-items-center">
              <h3 className="p-0 m-0 ">{items[indexOfObj].name}</h3>
              <p className="text-success  p-0 m-0">
                @{items[indexOfObj].company}
              </p>
            </div>
            <p className="p-0 m-0 d-flex justify-content-start headData">
              {items[indexOfObj].date}
            </p>
            <ul className="ul__list mt-3">{items[indexOfObj].About}</ul>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default Experience;
