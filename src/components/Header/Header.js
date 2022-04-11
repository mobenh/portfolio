import Link from 'next/link';
import React from 'react';
import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { DiCssdeck } from 'react-icons/di';

import { Container, Div1, Div2, Div3, NavLink, SocialIcons, Span} from './HeaderStyles';

const Header = () =>  (
  <Container>
    <Div1>
        <Link href="/">
          <a style={{ diplay: "flex", alignItems: "center", color:"white", marginBottom: "20px"}}>
            <DiCssdeck size="3rem"/> <span>Portfolio</span>
          </a>
        </Link>
    </Div1>
    <Div2>
      <li>
        <Link href="#projects">
          <NavLink>Projects</NavLink>
        </Link>
      </li>
      <li>
        <Link href="#tech">
          <NavLink>Technologies</NavLink>
        </Link>
      </li>
      <li>
        <Link href="#about">
          <NavLink>About</NavLink>
        </Link>
      </li>
    </Div2>
    <Div3>
      <SocialIcons href="https://www.linkedin.com/in/moben-haq/" target="_blank">
        <AiFillLinkedin size="3rem" />
      </SocialIcons>
      <SocialIcons href="https://github.com/mobenh" target="_blank">
        <AiFillGithub size="3rem" />
      </SocialIcons>
      <SocialIcons href="https://discord.gg/wWabRFT2Wy" target="_blank">
        <img src="data:image/png;base64,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" width= "25"/>
      </SocialIcons>
    </Div3>
  </Container>
);

export default Header;
