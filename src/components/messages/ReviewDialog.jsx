import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as mutations from '@/graphql/mutations';

export function ReviewDialog({ isOpen, onClose, revieweeId, reviewerId, conversationId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('評価を選択してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewInput = {
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        conversation_id: conversationId,
        rating: rating,
        comment: comment.trim() || null
      };

      if (useMock) {
        await mockAPIService.mockCreateReview(reviewInput);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.createReview,
          variables: { input: reviewInput }
        });
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Submit review error:', err);
      setError('レビューの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>レビューを投稿</DialogTitle>
          <DialogDescription>
            撮影体験を5段階で評価してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>評価</Label>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && '残念でした'}
                {rating === 2 && 'もう少しでした'}
                {rating === 3 && '良かったです'}
                {rating === 4 && 'とても良かったです'}
                {rating === 5 && '最高でした！'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">コメント（任意）</Label>
            <Textarea
              id="comment"
              placeholder="撮影体験についてのコメントを記入してください"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? '投稿中...' : '投稿'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

