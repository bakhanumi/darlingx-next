import React from 'react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';
import Image from 'next/image';

export default function Home() {
  // Социальные ссылки
  const socialLinks = [
    { href: 'https://t.me/quintessenceofdarling', label: 'x' },
    { href: 'https://t.me/senpaisenpai', label: 'telegram' },
    { href: 'https://instagram.com/suleimanv_', label: 'instagram' },
    { href: 'https://github.com/darlingx1x', label: 'github' },
  ];

  return (
    <Layout 
      title="Home"
      description="AI, SE, Assistive Tech"
      ogImage="/darling.webp"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Suleymanov Bobur" animateOnMount={true} />
        </h1>
        
        <h3 className="about-location">
          <a href="https://www.google.com/maps/place/Uzbekistan" target="_blank" rel="noopener noreferrer">
            <span className="location-emoji">📍</span>
            <MatrixAnimation 
              text="Currently in: Tashkent, UZB" 
              className="animate_letters location-text" 
            />
          </a>
        </h3>
        
        <div className="about-content">
          <div style={{ position: 'relative', width: '410px', height: '300px', marginRight: '2rem' }}>
            <Image
              src="/darling.webp"
              alt="Profile Image"
              className="about-image"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 410px"
              priority
            />
          </div>
          <div className="about-text">
            <p>Hello everyone, I'm not an NPC!</p>
            <p>I am Suleymanov Bobur, originating from the lively city of Ferghana in Uzbekistan.</p>
            <p>My passion for learning began with physics, mathematics, english, and computer science. I enjoy creating new and innovative things, bringing people together around a common goal, and helping others.</p>
            <p>I'm genuinely passionate about artificial intelligence, programming, relationship psychology, and holistic personal and intellectual development.</p>
            <p>On this website, you'll find information about what I do, what I'm reading, and my thoughts and ideas. If our interests align, feel free to reach out—I'm always open to connecting and expanding my network.</p>
          </div>
        </div>
      </div>
      
      <nav className="socials">
        {socialLinks.map((link, index) => (
          <a 
            key={index}
            href={link.href} 
            className="nav-link" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(link.href, '_blank');
            }}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MatrixAnimation text={`[${link.label}]`} />
          </a>
        ))}
      </nav>
    </Layout>
  );
}
