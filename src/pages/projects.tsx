import React from 'react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

export default function Projects() {
  return (
    <Layout 
      title="Projects"
      description="Projects - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Projects" animateOnMount={true} />
        </h1>
        
        {/* Здесь будет контент страницы Projects */}
        <div className="about-content">
          <p>Projects content will be added here.</p>
        </div>
      </div>
    </Layout>
  );
}
