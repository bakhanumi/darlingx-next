import React from 'react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

export default function Posts() {
  return (
    <Layout 
      title="Posts"
      description="Posts - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Posts" animateOnMount={true} />
        </h1>
        
        {/* Здесь будет контент страницы Posts */}
        <div className="about-content">
          <p>Posts content will be added here.</p>
        </div>
      </div>
    </Layout>
  );
}
