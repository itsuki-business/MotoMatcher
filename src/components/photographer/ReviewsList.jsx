import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';

export function ReviewsList({ reviews }) {
  const [reviewsWithImages, setReviewsWithImages] = useState([]);

  useEffect(() => {
    const loadReviewImages = async () => {
      const reviewsWithUrls = await Promise.all(
        reviews.map(async (review) => {
          let profileImageUrl = null;
          if (review.reviewer?.profile_image) {
            if (useMock) {
              profileImageUrl = await mockStorageService.getImageUrl(review.reviewer.profile_image);
            } else {
              const { getUrl } = await import('aws-amplify/storage');
              const result = await getUrl({ path: review.reviewer.profile_image });
              profileImageUrl = result.url.href;
            }
          }
          return { ...review, profileImageUrl };
        })
      );
      setReviewsWithImages(reviewsWithUrls);
    };

    if (reviews && reviews.length > 0) {
      loadReviewImages();
    } else {
      setReviewsWithImages([]);
    }
  }, [reviews]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  if (!reviewsWithImages || reviewsWithImages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>まだレビューがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviewsWithImages.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.profileImageUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {review.reviewer?.nickname?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">
                        {review.reviewer?.nickname || '匿名ユーザー'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

