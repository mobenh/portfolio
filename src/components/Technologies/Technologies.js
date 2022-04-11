import React from 'react';
import { DiFirebase, DiReact, DiZend } from 'react-icons/di';
import { Section, SectionDivider, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import { List, ListContainer, ListItem, ListParagraph, ListTitle } from './TechnologiesStyles';

const Technologies = () =>  (
  <Section id="tech">
    <SectionDivider />
    <br />
    <SectionTitle>Technologies</SectionTitle>
    <SectionText></SectionText>
    <List>
      <ListItem>
        <DiReact size="13rem"/>
        <ListContainer>
          <ListTitle>React</ListTitle>
          <ListParagraph></ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        {/* <DiFirebase size="3rem"/> */}
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" width='130'/>
        <ListContainer>
          <ListTitle>AWS</ListTitle>
          <ListParagraph></ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        {/* <DiZend size="3rem"/> */}
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain.svg" width='130'/>
        <ListContainer>
          <ListTitle>MongoDB</ListTitle>
          <ListParagraph></ListParagraph>
        </ListContainer>
      </ListItem>
    </List>
  </Section>
);

export default Technologies;
