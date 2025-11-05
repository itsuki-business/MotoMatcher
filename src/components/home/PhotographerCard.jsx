import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';

export function PhotographerCard({ photographer, index = 0 }) {
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (photographer.profile_image) {
        if (useMock) {
          const url = await mockStorageService.getImageUrl(photographer.profile_image);
          setProfileImageUrl(url);
        } else {
          // AWS S3 implementation
          const { getUrl } = await import('aws-amplify/storage');
          const result = await getUrl({ key: photographer.profile_image });
          setProfileImageUrl(result.url.href);
        }
      }
    };

    loadProfileImage();
  }, [photographer.profile_image]);

  const handleClick = () => {
    navigate('/photographer-detail', { state: { photographer } });
  };

  const averageRating = photographer.averageRating || 0;
  const reviewCount = photographer.reviewCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profileImageUrl} alt={photographer.nickname} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {photographer.nickname?.[0] || photographer.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1 truncate">
                {photographer.nickname || 'フォトグラファー'}
              </h3>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {photographer.prefecture && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{photographer.prefecture}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                {averageRating > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({reviewCount}件)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">レビューなし</span>
                )}
              </div>

              {photographer.genres && photographer.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photographer.genres.slice(0, 3).map((genre, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <Camera className="w-3 h-3 mr-1" />
                      {genre}
                    </Badge>
                  ))}
                  {photographer.genres.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{photographer.genres.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {photographer.bio && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {photographer.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

