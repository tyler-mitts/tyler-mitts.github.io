import React, { useEffect, useRef, useState } from 'react';
import bossImg from '../assets/martinboss.png';
import bossBg from '../assets/bossbackground.png';
import BossIntro from '../components/BossIntro';
import BossArea from '../components/BossArea';
import BossIDE from '../components/BossIDE';

const customMessage = 'Maiya, will you be my girlfriend?';

const BossScreen = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [typed, setTyped] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [inputActive, setInputActive] = useState(true);
  const [spamming, setSpamming] = useState(false);
  const [lines, setLines] = useState([]);
  const [showError, setShowError] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introFade, setIntroFade] = useState(true);
  const [introTextFadeIn, setIntroTextFadeIn] = useState(false);
  const ideRef = useRef(null);

  //Boss animation
  const [bossY, setBossY] = useState(0);
  useEffect(() => {
    let frame = 0;
    let animId;
    const animate = () => {
      setBossY(10 * Math.sin(frame / 20));
      frame++;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  //Intro effects
  useEffect(() => {
    setShowIntro(true);
    setIntroFade(true);
    setFadeIn(false);
    const fadeTimeout = setTimeout(() => setIntroFade(false), 2500);
    const introTimeout = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setFadeIn(true), 100);
      if (ideRef.current) {
        ideRef.current.focus();
      }
    }, 6000);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(introTimeout);
    };
  }, []);

  useEffect(() => {
    if (showIntro) {
      setIntroTextFadeIn(false);
      setTimeout(() => setIntroTextFadeIn(true), 100); // slight delay for smooth fade
    }
  }, [showIntro]);

  //Types the message :) when any button is pressed
  useEffect(() => {
    if (!inputActive || showIntro) return;
    const handleKeyDown = (e) => {
      if (msgIndex < customMessage.length) {
        setTyped((prev) => prev + customMessage[msgIndex]);
        setMsgIndex((prev) => prev + 1);
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [msgIndex, inputActive, showIntro]);

  //Loops message when fully typed
  useEffect(() => {
    if (msgIndex >= customMessage.length && inputActive) {
      setInputActive(false);
      setSpamming(true);
      setLines([customMessage]);
    }
  }, [msgIndex, inputActive]);

  useEffect(() => {
    if (!spamming) return;
    const maxLines = 30;
    if (lines.length >= maxLines) {
      setSpamming(false);
      setTimeout(() => setShowError(true), 300);
      return;
    }
    const spamTimeout = setTimeout(() => {
      setLines((prev) => [...prev, customMessage]);
    }, 10);
    return () => clearTimeout(spamTimeout);
  }, [spamming, lines]);

  const handleIDEClick = () => {
    if (ideRef.current) ideRef.current.focus();
  };

  if (showIntro) {
    return <BossIntro introFade={introFade} introTextFadeIn={introTextFadeIn} />;
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#181818',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 1s',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <BossArea bossImg={bossImg} bossBg={bossBg} bossY={bossY} />
      <BossIDE
        ideRef={ideRef}
        handleIDEClick={handleIDEClick}
        inputActive={inputActive}
        typed={typed}
        lines={lines}
        showError={showError}
        fadeIn={fadeIn}
        customMessage={customMessage}
      />
    </div>
  );
};

export default BossScreen;