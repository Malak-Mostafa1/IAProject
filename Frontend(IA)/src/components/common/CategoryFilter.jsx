import { useRef, useState, useEffect } from 'react';

const CategoryFilter = ({ categories, selectedId, onChange }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // التحقق من وجود محتوى يمكن تمريره
  const checkForScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // هل هناك محتوى مخفي على اليسار؟
      setShowLeftArrow(container.scrollLeft > 0);
      // هل هناك محتوى مخفي على اليمين؟
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // فحص أولي
      checkForScroll();
      // إضافة مستمع لحدث التمرير
      container.addEventListener('scroll', checkForScroll);
      // إعادة الفحص عند تغيير حجم النافذة
      window.addEventListener('resize', checkForScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkForScroll);
      }
      window.removeEventListener('resize', checkForScroll);
    };
  }, [categories]); // إعادة التشغيل عند تغير التصنيفات

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 250; // مقدار التمرير بالبكسل
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* السهم الأيسر */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all border border-primary-200"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* حاوية التصنيفات القابلة للتمرير */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onChange(null)}
          className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
            selectedId === null
              ? "bg-primary-500 text-white shadow-lg hover:shadow-xl hover:bg-primary-600"
              : "bg-white text-gray-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedId === cat.id
                ? "bg-primary-500 text-white shadow-lg hover:shadow-xl hover:bg-primary-600"
                : "bg-white text-gray-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* السهم الأيمن */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all border border-primary-200"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;