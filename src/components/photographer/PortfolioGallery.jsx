import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';

export function PortfolioGallery({ portfolios }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        portfolios.map(async (portfolio) => {
          let imageUrl = null;
          if (portfolio.image_key) {
            if (useMock) {
              imageUrl = await mockStorageService.getImageUrl(portfolio.image_key);
            } else {
              const { getUrl } = await import('aws-amplify/storage');
              const result = await getUrl({ key: portfolio.image_key });
              imageUrl = result.url.href;
            }
          }
          return { ...portfolio, imageUrl };
        })
      );
      setPortfolioImages(images);
    };

    if (portfolios && portfolios.length > 0) {
      loadImages();
    }
  }, [portfolios]);

  const handlePrevious = (e) => {
    e.stopPropagation();
    const currentIndex = portfolioImages.findIndex(p => p.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioImages.length - 1;
    setSelectedImage(portfolioImages[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = portfolioImages.findIndex(p => p.id === selectedImage.id);
    const nextIndex = currentIndex < portfolioImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(portfolioImages[nextIndex]);
  };

  if (!portfolioImages || portfolioImages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>まだポートフォリオがありません</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolioImages.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedImage(portfolio)}
          >
            <img
              src={portfolio.imageUrl || '/placeholder-image.jpg'}
              alt={portfolio.title || 'Portfolio image'}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white font-semibold text-center px-4">
                {portfolio.title || '写真を表示'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
              {(selectedImage.title || selectedImage.description) && (
                <div className="bg-white p-4 rounded-b-lg">
                  {selectedImage.title && (
                    <h3 className="text-lg font-semibold mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-muted-foreground">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

