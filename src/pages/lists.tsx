import React from 'react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

export default function Lists() {
  return (
    <Layout 
      title="Lists"
      description="Lists - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Lists" animateOnMount={true} />
        </h1>
        
        {/* Здесь будет контент страницы Lists */}
        <div className="about-content">
          <p>Lists content will be added here.</p>
        </div>
      </div>
    </Layout>
  );
}
