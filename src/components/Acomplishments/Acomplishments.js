import React from 'react';
import Link from 'next/link';

import { Section, SectionDivider, SectionTitle } from '../../styles/GlobalComponents';
import { Box, Boxes, BoxNum, BoxText } from './AcomplishmentsStyles';

const data = [
  { number: 'AWS Cloud Practitioner', text: <a href="https://www.credly.com/badges/15126f58-f26b-4410-9a44-a1497b352e6a/public_url" target='_blank'>Link</a>},
  { number: 'C++ Certified', text: <a href="https://www.credly.com/badges/5c9b7eda-6fd8-4290-a72c-62cec971beb9/public_url" target='_blank'>Link</a>},
  { number: 'CompTIA A+', text: <a href="https://www.credly.com/badges/1af12b15-3394-4a18-92f6-9471c4987f04/public_url" target='_blank'>Link</a>},
  { number: 'CompTIA Network+', text: <a href="https://www.credly.com/badges/e9073a45-bada-41cf-bc9b-27feb88816c1/public_url" target='_blank'>Link</a>}
];

const Acomplishments = () => (
  <Section>
    <SectionTitle>Certifications</SectionTitle>
    <Boxes>
      {data.map((card, index) => (
        <Box key={index}>
          <BoxNum>{card.number}</BoxNum>
          <BoxText>{card.text}</BoxText>
        </Box>
      ))}
    </Boxes>
  </Section>
);

export default Acomplishments;
