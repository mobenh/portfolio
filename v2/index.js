import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import content from './content.json';

const Portfolio = () => {
  return (
    <div className="portfolio">
      <Header />
      <Objective objective={content.objective} />
      <Section title="Languages" items={content.languages} />
      <ScrollableSection title="Projects" items={content.projects} isProject />
      <Section title="Frameworks" items={content.frameworks} />
      <Section title="Infrastructure" items={content.infrastructure} />
      <ScrollableSection title="Certifications" items={content.certifications} isCertification />
      <Contact info={content.contact} />
    </div>
  );
};

const Header = () => (
  <header>
    <h1>Moben Haq's Portfolio</h1>
  </header>
);

const Objective = ({ objective }) => (
  <section className="objective-section">
    <h2>Objective</h2>
    <p>{objective}</p>
  </section>
);

const Section = ({ title, items }) => (
  <section>
    <h2>{title}</h2>
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </section>
);

const ScrollableSection = ({ title, items, isProject, isCertification }) => (
  <section className="scrollable-section">
    <h2>{title}</h2>
    <div className="cards-container">
      {items.map((item, index) => (
        <div className="card" key={index}>
          {isProject && (
            <>
              <h3>{item.name}</h3>
              <p>{item.framework}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Live Demo</a>
              <a href={item.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <p>{item.description}</p>
            </>
          )}
          {isCertification && (
            <>
              <h3>{item.name}</h3>
              <p>Issuer: {item.issuer}</p>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">View Certification</a>}
            </>
          )}
        </div>
      ))}
    </div>
  </section>
);

const Contact = ({ info }) => (
  <section>
    <h2>Contact</h2>
    <ul>
      <li>Name: {info.name}</li>
      <li>Phone: {info.phone}</li>
      <li>Email: <a href={`mailto:${info.email}`}>{info.email}</a></li>
      <li>LinkedIn: <a href={info.linkedin} target="_blank" rel="noopener noreferrer">{info.linkedin}</a></li>
      <li>GitHub: <a href={info.github} target="_blank" rel="noopener noreferrer">{info.github}</a></li>
    </ul>
  </section>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);
