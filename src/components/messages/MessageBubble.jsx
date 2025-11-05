import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import { Check, CheckCheck } from 'lucide-react';

export function MessageBubble({ message, isOwn, senderName }) {
  const [mediaUrl, setMediaUrl] = useState(null);

  useEffect(() => {
    const loadMedia = async () => {
      if (message.media_key) {
        if (useMock) {
          const url = await mockStorageService.getImageUrl(message.media_key);
          setMediaUrl(url);
        } else {
          const { getUrl } = await import('aws-amplify/storage');
          const result = await getUrl({ key: message.media_key });
          setMediaUrl(result.url.href);
        }
      }
    };

    loadMedia();
  }, [message.media_key]);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs text-muted-foreground mb-1 px-2">{senderName}</span>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          {mediaUrl && (
            <div className="mb-2">
              {message.media_type?.startsWith('image/') ? (
                <img
                  src={mediaUrl}
                  alt="Shared media"
                  className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(mediaUrl, '_blank')}
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="rounded-lg max-w-full h-auto"
                />
              )}
            </div>
          )}
          
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-muted-foreground">
            {formatDate(message.createdAt)}
          </span>
          {isOwn && (
            <div className="text-xs">
              {message.is_read ? (
                <CheckCheck className="w-3 h-3 text-blue-600" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

