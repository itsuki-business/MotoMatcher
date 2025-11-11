import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ConversationActions({ conversation, onComplete, onCancel, currentUserId, appUser }) {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // フォトグラファーの場合はキャンセルボタンを非表示
  const isPhotographer = appUser?.user_type === 'photographer';

  const handleComplete = () => {
    console.log('ConversationActions handleComplete called');
    console.log('conversation:', conversation);
    console.log('onComplete exists:', !!onComplete);
    if (onComplete) {
      onComplete(conversation);
    }
    setShowCompleteDialog(false);
  };

  const handleCancel = () => {
    onCancel?.(conversation);
    setShowCancelDialog(false);
  };

  return (
    <>
      <div className={`flex gap-2 ${isPhotographer ? 'justify-center' : ''}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCompleteDialog(true)}
          className={`${isPhotographer ? 'flex-none px-6' : 'flex-1'} text-green-600 border-green-600 hover:bg-green-50`}
        >
          <Check className="w-4 h-4 mr-1" />
          依頼完了
        </Button>
        {!isPhotographer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-1" />
            依頼キャンセル
          </Button>
        )}
      </div>

      {/* 依頼完了の確認ダイアログ */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>依頼を完了しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作を実行すると、レビュー画面に移動します。
              レビュー投稿後、このトークルームは削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              はい、完了する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 依頼キャンセルの確認ダイアログ */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>依頼をキャンセルしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作を実行すると、トークルームが削除されます。
              この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
              はい、キャンセルする
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

