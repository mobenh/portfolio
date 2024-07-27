import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import content from './content.json';

const { languages, projects, frameworks, infrastructure, certifications, contact, objective } = content;

const RoadmapItem = ({ title, content }) => (
  <div className="roadmap-item">
    <div className="roadmap-item-content">
      <h3>{title}</h3>
      {content}
    </div>
    <div className="roadmap-dot"></div>
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

const Portfolio = () => (
  <div className="portfolio">
    <header className="header">
      <h1>{contact.name}'s Portfolio Roadmap</h1>
      <p>{objective}</p>
    </header>
    <div className="roadmap">
      <RoadmapItem title="Languages" content={<ul>{languages.map((lang, index) => <li key={index}>{lang}</li>)}</ul>} />
      <RoadmapItem title="Projects" content={<div className="projects">{projects.map((project, index) => <ProjectCard key={index} project={project} />)}</div>} />
      <RoadmapItem title="Frameworks" content={<ul>{frameworks.map((framework, index) => <li key={index}>{framework}</li>)}</ul>} />
      <RoadmapItem title="Infrastructure" content={<ul>{infrastructure.map((tech, index) => <li key={index}>{tech}</li>)}</ul>} />
      <RoadmapItem title="Certifications" content={<div className="certifications">{certifications.map((cert, index) => <CertificationCard key={index} certification={cert} />)}</div>} />
      <RoadmapItem title="Contact" content={
        <div>
          <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p>Phone: {contact.phone}</p>
          <p>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
            <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
        </div>
      } />
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);
