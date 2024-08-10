import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import content from './content.json';

const Portfolio = () => {
  const { languages, projects, frameworks, infrastructure, certifications, contact, objective } = content;

  return (
    <div className="portfolio">
      <header>
        <h1>{contact.name}</h1>
        <p>{objective}</p>
        <div className="contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </header>
      <section className="languages">
        <h2>Languages</h2>
        <ul>
          {languages.map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
      </section>
      <section className="projects">
        <h2>Projects</h2>
        {projects.map((project, index) => (
          <div key={index} className="project">
            <h3><a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a></h3>
            <p>{project.description}</p>
            <p><strong>Framework:</strong> {project.framework}</p>
            <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub Repo</a>
          </div>
        ))}
      </section>
      <section className="frameworks">
        <h2>Frameworks</h2>
        <ul>
          {frameworks.map((framework, index) => (
            <li key={index}>{framework}</li>
          ))}
        </ul>
      </section>
      <section className="infrastructure">
        <h2>Infrastructure</h2>
        <ul>
          {infrastructure.map((infra, index) => (
            <li key={index}>{infra}</li>
          ))}
        </ul>
      </section>
      <section className="certifications">
        <h2>Certifications</h2>
        <ul>
          {certifications.map((certification, index) => (
            <li key={index}>
              <strong>{certification.name}</strong> - {certification.issuer}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);
