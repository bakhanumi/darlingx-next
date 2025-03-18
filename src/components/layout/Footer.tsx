import React from 'react';

const Footer: React.FC = () => {
  // Вынесем соц. ссылки только на главную страницу
  return (
    <p className="attribution">
      *design inspired by
      <a 
        href="https://cguti.xyz/" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          window.open('https://cguti.xyz/', '_blank');
        }}
      >
        <span className="animate_letters">carmen</span>
      </a>
    </p>
  );
};

export default Footer;
