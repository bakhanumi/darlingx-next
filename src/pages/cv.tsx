import React from 'react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

export default function CV() {
  return (
    <Layout 
      title="CV"
      description="CV - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Curriculum Vitae" animateOnMount={true} />
        </h1>
        
        {/* Здесь будет контент страницы CV */}
        <div className="about-content">
          <p>CV content will be added here.</p>
        </div>
      </div>
    </Layout>
  );
}
