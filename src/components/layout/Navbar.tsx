import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavLink } from '@/types';
import AuthStatus from '@/components/auth/AuthStatus';

const Navbar: React.FC = () => {
  const router = useRouter();
  
  const navLinks: NavLink[] = [
    { href: '/', label: 'darlingx.com' },
    { href: '/cv', label: 'cv' },
    { href: '/books', label: 'books' },
    { href: '/posts', label: 'posts' },
    { href: '/lists', label: 'lists' },
    { href: '/projects', label: 'projects' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {navLinks.map((link, index) => (
          <Link 
            href={link.href} 
            key={index}
            className={`nav-link ${router.pathname === link.href ? 'active' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="animate_letters">[{link.label}]</span>
          </Link>
        ))}
      </div>
      
      <div className="navbar-right">
        <AuthStatus />
      </div>
    </nav>
  );
};

export default Navbar;
