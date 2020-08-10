import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { useGraphQL } from '../hooks/Fetch';
import Background from '../components/Background';
import BigTitle from '../components/BigTitle';
import Title from '../components/Title';
import TypewriterTitle from '../components/TypewriterTitle';
import TextBlock from '../components/TextBlock';
import { Github, LinkedIn } from '../components/Icons';

import '../../assets/images/photo.jpg';

const StyledPage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: rgb(0, 0, 0);
`;

const StyledBackground = styled.div`
  position: absolute;
  top: -20%;
  @media only screen and (min-device-width: 769px) {
    top: -5%;
    left: -30%;
  }
`;

const Header = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
  align-items: end;
  padding-bottom: 50px;
  box-sizing: border-box;
  @media only screen and (min-device-width: 769px) {
    align-items: center;
    padding-bottom: 0;
  }
`;

const Body = styled.div`
  position: relative;
  top: 100vh;
`;

const Content = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
  box-sizing: border-box;
  @media only screen and (min-device-width: 768px) {
    width: 700px;
    padding-left: 90px;
    padding-right: 90px;
  }
  @media only screen and (min-device-width: 1024px) {
    width: 800px;
  }
  @media only screen and (min-device-width: 1200px) {
    width: 1024px;
  }
  @media only screen and (min-device-width: 1400px) {
    width: 1200px;
  }
`;

const Section = styled.div`
  text-align: ${(props) => props.textAlign};
`;

const FullHeight = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  min-height: 100vh;
`;

const Social = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 20px;
  right: 20px;
  z-index: 4;
  @media only screen and (min-device-width: 768px) {
    top: 40px;
    right: 40px;
  }
`;

const Anchor = styled.a`
  width: 20px;
  height: 20px;
  margin-left: 20px;
  opacity: 0.6;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;

const Footer = styled.div`
  opacity: 0.6;
  text-align: center;
  transition: opacity 0.3s;
  padding-top: 50px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 50px;
  &:hover {
    opacity: 1;
  }
`;

export default function Page() {
  const bgRef = useRef(null);
  const background = useRef(null);
  const [path] = useState('/'); // we bring the home page for now.
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState(<div />);
  const data = useGraphQL('pages', {
    type: 'page',
    params: `path: "${path}"`,
    body: ['title', 'subtitle'],
  });
  const sections = useGraphQL('sections', {
    type: 'sections',
    params: `pagePath: "${path}"`,
    body: ['_id', 'title', 'text'],
  });

  // build a section for the page body.
  const bodySection = (el, titleAlign) => {
    const elements = [];

    if (el.title !== '' && el.title !== null) {
      elements.push(
        <TypewriterTitle key={`${el._id}-title`} textAlign={titleAlign}>
          {el.title}
        </TypewriterTitle>
      );
    }
    if (el.text !== '' && el.text !== null) {
      elements.push(
        <TextBlock key={`${el._id}-textblock`} textAlign={titleAlign}>
          {el.text}
        </TextBlock>
      );
    }

    if (elements.length) {
      return (
        <FullHeight key={`section-${el._id}`}>
          <Section>{elements}</Section>
        </FullHeight>
      );
    }

    return <div />;
  };

  useEffect(() => {
    // set the backgrond (WebGL). We use a reference
    // to not re-render and to use WebGL with pure Javascript.
    if (bgRef.current !== null) {
      background.current = new Background(bgRef.current, {
        threshold: parseFloat(34),
        color: {
          r: 255.0,
          g: 255.0,
          b: 255.0,
          a: 0.82,
        },
        duration: 8000 * 0.25,
      });

      background.current.draw('photo.jpg', {});
      background.current.init();
      background.current.play();
    }
  }, []);

  useEffect(() => {
    if (data) {
      if ('err' in data) {
        console.log('Ups... you know what this mean young padawan.');
      } else {
        setTitle(data.title);
        setSubtitle(data.subtitle);
      }
    }
  }, [data, title, subtitle]);

  useEffect(() => {
    if (sections) {
      if ('err' in sections) {
        console.log('Ups... you know what this mean young padawan.');
      } else if (sections.length) {
        setBody(
          sections.map((section, index) => {
            const titleAlign = index % 2 ? 'right' : 'left';

            return bodySection(section, titleAlign);
          })
        );
      }
    }
  }, [sections]);

  return (
    <StyledPage>
      <StyledBackground ref={bgRef} />
      <Social>
        <Anchor href="https://github.com/iantrisc" target="_blank">
          <Github fill="#fff" />
        </Anchor>
        <Anchor
          href="https://www.linkedin.com/in/cristian-araya-ram%C3%ADrez-85a5361a0/"
          target="_blank">
          <LinkedIn fill="#fff" />
        </Anchor>
      </Social>
      <Header>
        <Content>
          <Section textAlign="right">
            <BigTitle textAlign="right">{title}</BigTitle>
            {subtitle !== '' ? (
              <Title typewriter textAlign="right">
                {subtitle}
              </Title>
            ) : (
              <div />
            )}
          </Section>
        </Content>
      </Header>
      <Body>
        <Content>{body}</Content>
        <Footer>
          Copyright © 2020 Iantrisc. Todos los derechos reservados.
        </Footer>
      </Body>
    </StyledPage>
  );
}
