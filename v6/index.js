import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import content from './content.json';

const { languages, projects, frameworks, infrastructure, certifications, contact, objective } = content;

const RoadmapItem = ({ title, content, side }) => (
  <div className={`roadmap-item ${side}`}>
    <div className={`roadmap-connector ${side}`}></div>
    <div className="roadmap-item-content">
      <h3>{title}</h3>
      {content}
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="project-card">
    <h4>{project.name}</h4>
    <p>{project.description}</p>
    <a href={project.url} target="_blank" rel="noopener noreferrer">View Project</a>
    <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub Repo</a>
  </div>
);

const CertificationCard = ({ certification }) => (
  <div className="certification-card">
    <h4>{certification.name}</h4>
    <p>{certification.issuer}</p>
    <a href={certification.link} target="_blank" rel="noopener noreferrer">View Certification</a>
  </div>
);

const RoadmapLine = () => (
  <div className="roadmap-line"></div>
);

const Portfolio = () => (
  <div className="portfolio">
    <header className="header">
      <h1>{contact.name}</h1>
      <p>{objective}</p>
    </header>
    <div className="roadmap">
      <RoadmapLine />
      {[
        { title: "Languages", content: <ul>{languages.map((lang, index) => <li key={index}>{lang}</li>)}</ul> },
        { title: "Projects", content: <div className="projects">{projects.map((project, index) => <ProjectCard key={index} project={project} />)}</div> },
        { title: "Frameworks", content: <ul>{frameworks.map((framework, index) => <li key={index}>{framework}</li>)}</ul> },
        { title: "Infrastructure", content: <ul>{infrastructure.map((tech, index) => <li key={index}>{tech}</li>)}</ul> },
        { title: "Certifications", content: <div className="certifications">{certifications.map((cert, index) => <CertificationCard key={index} certification={cert} />)}</div> },
        { title: "Contact", content: 
          <div>
            <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            <p>Phone: {contact.phone}</p>
            <p>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
              <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>
          </div>
        }
      ].map((item, index) => (
        <RoadmapItem 
          key={index} 
          title={item.title} 
          content={item.content} 
          side={index % 2 === 0 ? 'left' : 'right'} 
        />
      ))}
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);
