'use client';

import { useState, useEffect } from 'react';

interface Concept {
  slug: string;
  title: string;
  english_title: string;
  cover_image: string;
  category: string;
  status: string;
  contentHtml?: string;
  cover_caption?: string;
}

interface ConceptGridProps {
  initialConcepts: Concept[];
}

export default function ConceptGrid({ initialConcepts }: ConceptGridProps) {
  const [filter, setFilter] = useState('Tất cả');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readConcepts, setReadConcepts] = useState<string[]>([]);

  // Load danh sách đã đọc từ localStorage khi trang vừa mở
  useEffect(() => {
    const saved = localStorage.getItem('read_concepts');
    if (saved) {
      setReadConcepts(JSON.parse(saved));
    }
  }, []);

  // Lấy danh sách các category duy nhất
  const categories = ['Tất cả', ...Array.from(new Set(initialConcepts.map(c => c.category)))];

  const filteredConcepts = filter === 'Tất cả' 
    ? initialConcepts 
    : initialConcepts.filter(c => c.category === filter);

  const openModal = (slug: string) => {
    const concept = initialConcepts.find(c => c.slug === slug);
    if (concept) {
      setSelectedConcept(concept);
      
      // Đánh dấu đã đọc nếu chưa có trong danh sách
      if (!readConcepts.includes(slug)) {
        const newRead = [...readConcepts, slug];
        setReadConcepts(newRead);
        localStorage.setItem('read_concepts', JSON.stringify(newRead));
      }
    }
  };

  const closeModal = () => {
    setSelectedConcept(null);
  };

  // Đóng modal bằng phím Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="container">
      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <h1 className="category-title">{filter === 'Tất cả' ? 'Viral toàn thư' : filter}</h1>
        <div className="card-grid">
          {filteredConcepts.map((concept) => (
            <div 
              key={concept.slug} 
              onClick={() => openModal(concept.slug)}
              className="card-wrapper"
            >
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="title">{concept.english_title}</div>
                    <div className="status">
                      {readConcepts.includes(concept.slug) ? 'Đã đọc' : ''}
                    </div>
                  </div>
                  <div 
                    className="flip-card-back" 
                    style={{ 
                      backgroundImage: concept.cover_image 
                        ? `url(${concept.cover_image})`
                        : `url(https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000)`
                    }}
                  >
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedConcept && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            
            <div className="modal-body">
              {selectedConcept.cover_image && (
                <div className="modal-hero-container">
                  <div 
                    className="modal-hero"
                    style={{ 
                      backgroundImage: `url(${selectedConcept.cover_image})`
                    }}
                  />
                  {selectedConcept.cover_caption && (
                    <p className="modal-hero-caption">{selectedConcept.cover_caption}</p>
                  )}
                </div>
              )}
              
              <div className="modal-text-container">
                <h1 className="modal-title">{selectedConcept.title}</h1>
                <div 
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: selectedConcept.contentHtml || '' }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}

      <style jsx>{`
        /* Giữ nguyên phần Filter-bar và Card cũ, chỉ cập nhật Modal */
        .filter-bar { display: flex; gap: 1rem; margin-bottom: 3rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
        .filter-btn { background: none; border: none; padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; color: #888; transition: all 0.3s ease; font-family: inherit; border-radius: 20px; }
        .filter-btn:hover { color: #333; background-color: #f5f5f5; }
        .filter-btn.active { color: #fff; background-color: #1a1a1a; }
        .category-title { font-family: var(--font-playfair), serif; font-size: 2.5rem; margin-bottom: 2rem; text-transform: capitalize; }
        .card-wrapper { cursor: pointer; }

        /* MODAL CHỈNH SỬA THEO MẪU UX LAGI */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.5); /* Giảm độ mờ, trông trong trẻo hơn */
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1000;
          overflow-y: auto;
          padding: 60px 20px;
          backdrop-filter: blur(10px); /* Giảm độ nhòe để tự nhiên hơn */
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background-color: #eeeeee; /* Tăng độ xám bên trong bài viết */
          width: 100%;
          max-width: 820px;
          border-radius: 4px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.05);
          position: relative;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: fixed; /* Cố định ở góc màn hình */
          top: 30px;
          right: 30px;
          background: none;
          border: none;
          font-size: 2.5rem;
          color: #aaa;
          cursor: pointer;
          z-index: 1100;
          transition: color 0.3s;
        }
        .close-btn:hover { color: #333; }

        .modal-hero-container {
          width: 100%;
          margin-bottom: 2rem;
        }

        .modal-hero {
          width: 100%;
          aspect-ratio: 16/9;
          background-size: cover;
          background-position: center;
        }

        .modal-hero-caption {
          text-align: center;
          font-family: var(--font-inter), sans-serif;
          font-style: italic;
          font-size: 0.95rem;
          color: #666;
          margin-top: 1.5rem;
          padding: 0 10rem; /* Tăng đồng bộ với text */
          line-height: 1.5;
        }

        .modal-text-container {
          padding: 4rem 10rem; /* Tăng lề rộng hơn nữa để tạo sự tập trung */
        }

        .modal-title {
          font-family: var(--font-playfair), serif;
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          text-align: center;
          line-height: 1.2;
          color: #1a1a1a;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255,255,255,0.7);
          z-index: 2000;
        }

        .loader {
          width: 30px;
          height: 30px;
          border: 2px solid #eee;
          border-top: 2px solid #1a1a1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .modal-text-container { padding: 3rem 1.5rem; }
          .modal-title { font-size: 2.2rem; }
          .modal-hero-caption { padding: 0 1.5rem; }
          .modal-overlay { padding: 0; }
          .modal-content { border-radius: 0; }
        }
      `}</style>
    </main>
  );
}
