import React from 'react';

import { Section, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import { LeftSection } from './HeroStyles';

const Hero = () => (
  <section row nopading>
    <LeftSection>
      <SectionTitle main center>
        Hi, I am <br />
        Mobenul Haq
      </SectionTitle>
      <SectionText>
        I love software development.
      </SectionText>
      <Button onClick={ () => window.open("https://github.com/mobenh", "_blank")}>My Github</Button>
    </LeftSection>
  </section>
);

export default Hero;