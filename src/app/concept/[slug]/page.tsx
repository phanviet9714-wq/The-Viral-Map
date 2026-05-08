import Link from 'next/link';
import { getConceptData, getAllConcepts } from '@/lib/markdown';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const concepts = await getAllConcepts();
  return concepts.map((concept) => ({
    slug: concept.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ConceptPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = await getConceptData(slug);

  return (
    <article className="post-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} style={{ marginRight: '6px' }} />
        Quay lại
      </Link>

      <header style={{ marginBottom: '3rem' }}>
        <h1 className="post-title">{concept.title} ({concept.english_title})</h1>
      </header>

      <div 
        className="main-cover" 
        style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundImage: concept.cover_image 
            ? `url(${concept.cover_image})`
            : `url(https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      />
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '0.95rem', 
        color: '#666', 
        fontStyle: 'italic',
        marginTop: '1.5rem',
        marginBottom: '4rem',
        padding: '0 1rem',
        lineHeight: '1.6'
      }}>
        {concept.cover_caption}
      </p>

      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: concept.contentHtml }} 
      />

      <footer style={{ marginTop: '6rem', borderTop: '1px solid #eee', paddingTop: '2rem', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
        © 2026 Phan Viet Concept Vault • Conan School
      </footer>
    </article>
  );
}
