import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as mutations from '@/graphql/mutations';

export function ReviewComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversation, otherUserId, myUserId, returnTo } = location.state || {};
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!conversation || !otherUserId || !myUserId) {
      navigate('/');
    }
  }, [conversation, otherUserId, myUserId, navigate]);

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
        reviewer_id: myUserId,
        reviewee_id: otherUserId,
        conversation_id: conversation.id,
        rating: rating,
        comment: comment.trim() || null
      };

      if (useMock) {
        await mockAPIService.mockCreateReview(reviewInput);
        
        // 会話から自分を完了済みとしてマーク（削除はしない）
        const data = JSON.parse(localStorage.getItem('mockAPIData') || '{}');
        const convIndex = data.conversations.findIndex(c => c.id === conversation.id);
        if (convIndex !== -1) {
          if (!data.conversations[convIndex].completed_by) {
            data.conversations[convIndex].completed_by = [];
          }
          if (!data.conversations[convIndex].completed_by.includes(myUserId)) {
            data.conversations[convIndex].completed_by.push(myUserId);
          }
          
          // 両方が完了した場合のみ削除
          const completedBy = data.conversations[convIndex].completed_by;
          if (completedBy.length >= 2) {
            data.conversations = data.conversations.filter(c => c.id !== conversation.id);
            data.messages = data.messages.filter(m => m.conversationID !== conversation.id);
          }
        }
        localStorage.setItem('mockAPIData', JSON.stringify(data));
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.createReview,
          variables: { input: reviewInput }
        });
        
        // 会話の completed_by を更新
        const completedBy = conversation.completed_by || [];
        if (!completedBy.includes(myUserId)) {
          completedBy.push(myUserId);
        }
        
        // 両方が完了した場合のみ削除
        if (completedBy.length >= 2) {
          await client.graphql({
            query: mutations.deleteConversation,
            variables: { input: { id: conversation.id } }
          });
        } else {
          await client.graphql({
            query: mutations.updateConversation,
            variables: { 
              input: { 
                id: conversation.id,
                completed_by: completedBy
              } 
            }
          });
        }
      }

      setSubmitted(true);
      
      // 2秒後にメッセージ一覧に戻る
      setTimeout(() => {
        navigate(returnTo || `/messages/${myUserId}`);
      }, 2000);
    } catch (err) {
      console.error('Submit review error:', err);
      setError('レビューの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const otherUserName = conversation?.biker_id === myUserId 
    ? conversation?.photographer_name 
    : conversation?.biker_name;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">レビューを投稿しました</h2>
          <p className="text-muted-foreground">
            ご協力ありがとうございました
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>依頼完了レビュー</CardTitle>
              <CardDescription>
                {otherUserName}さんとの撮影はいかがでしたか？
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>評価 *</Label>
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
                          className={`w-12 h-12 ${
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

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(returnTo || `/messages/${myUserId}`)}
                    disabled={loading}
                    className="flex-1"
                  >
                    後で投稿
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || rating === 0}
                    className="flex-1"
                  >
                    {loading ? '投稿中...' : '投稿して完了'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

