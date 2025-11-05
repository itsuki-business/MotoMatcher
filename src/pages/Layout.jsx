import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, MessageCircle, User, Star, LogOut, Menu, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import { useUnreadCount } from '@/contexts/UnreadContext';
import * as queries from '@/graphql/queries';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { unreadCount } = useUnreadCount();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      if (currentUser) {
        setUser(currentUser);

        // Load app user data
        const userId = currentUser.userId || currentUser.sub;
        let userData;
        if (useMock) {
          userData = await mockAPIService.mockGetUser(userId);
        } else {
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          const result = await client.graphql({
            query: queries.getUser,
            variables: { id: userId }
          });
          userData = result.data.getUser;
        }

        if (userData) {
          setAppUser(userData);

          // Load profile image
          if (userData.profile_image) {
            if (useMock) {
              const url = await mockStorageService.getImageUrl(userData.profile_image);
              setProfileImageUrl(url);
            } else {
              const { getUrl } = await import('aws-amplify/storage');
              const result = await getUrl({ key: userData.profile_image });
              setProfileImageUrl(result.url.href);
            }
          }
        }
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (useMock) {
        await mockAuthService.signOut();
      } else {
        const { signOut } = await import('aws-amplify/auth');
        await signOut();
      }
      
      setUser(null);
      setAppUser(null);
      navigate('/home-for-non-register');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show layout on certain pages
  const hideLayout = ['/first-time-profile-setup'].includes(location.pathname);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/home-for-register' : '/home-for-non-register'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">BikeMatch</span>
          </Link>

          {/* Desktop Navigation */}
          {user && appUser && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/home-for-register"
                className={`flex items-center gap-2 transition-colors ${
                  isActive('/home-for-register')
                    ? 'text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>ホーム</span>
              </Link>

              <Link
                to={`/messages/${user.userId || user.sub}`}
                className={`flex items-center gap-2 transition-colors relative ${
                  location.pathname.startsWith('/messages')
                    ? 'text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold pointer-events-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>メッセージ</span>
              </Link>

              <Link
                to="/reviews"
                className={`flex items-center gap-2 transition-colors ${
                  isActive('/reviews')
                    ? 'text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>レビュー</span>
              </Link>

              {appUser?.user_type === 'photographer' && (
                <Link
                  to="/portfolio-management"
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/portfolio-management')
                      ? 'text-blue-600'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>ポートフォリオ</span>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profileImageUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {appUser.nickname?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{appUser.nickname}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.userId || user.sub}`)}>
                    <User className="w-4 h-4 mr-2" />
                    プロフィール
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {user && appUser && (
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && appUser && mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container py-4 space-y-2">
              <Link
                to="/home-for-register"
                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                  isActive('/home-for-register')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-muted-foreground hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>ホーム</span>
              </Link>

              <Link
                to={`/messages/${user.userId || user.sub}`}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors relative ${
                  location.pathname.startsWith('/messages')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-muted-foreground hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold pointer-events-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>メッセージ</span>
              </Link>

              <Link
                to="/reviews"
                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                  isActive('/reviews')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-muted-foreground hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Star className="w-5 h-5" />
                <span>レビュー</span>
              </Link>

              {appUser?.user_type === 'photographer' && (
                <Link
                  to="/portfolio-management"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                    isActive('/portfolio-management')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-muted-foreground hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="w-5 h-5" />
                  <span>ポートフォリオ</span>
                </Link>
              )}

              <Link
                to={`/profile/${user.userId || user.sub}`}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                  location.pathname.startsWith('/profile')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-muted-foreground hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>プロフィール</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>ログアウト</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold mb-1">BikeMatch</p>
              <p className="text-sm text-gray-400">
                バイク × フォトグラファーマッチングプラットフォーム
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/how-to-use" className="hover:text-gray-300 transition-colors">
                使い方ガイド
              </Link>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">
                利用規約
              </Link>
              <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
                プライバシーポリシー
              </Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 mt-6">
            © 2025 BikeMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

