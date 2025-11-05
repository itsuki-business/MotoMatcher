import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnreadProvider } from './contexts/UnreadContext';
import { Layout } from './pages/Layout';
import { HomeForNonRegister } from './pages/HomeForNonRegister';
import { HomeForRegister } from './pages/HomeForRegister';
import { FirstTimeProfileSetup } from './pages/FirstTimeProfileSetup';
import { Profile } from './pages/Profile';
import { PhotographerDetail } from './pages/PhotographerDetail';
import { MessageList } from './pages/MessageList';
import { UserMessage } from './pages/UserMessage';
import { Reviews } from './pages/Reviews';
import { Terms } from './pages/Terms';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Contact } from './pages/Contact';
import { HowToUse } from './pages/HowToUse';
import { ReviewComplete } from './pages/ReviewComplete';
import { PortfolioManagement } from './pages/PortfolioManagement';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UnreadProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Navigate to="/home-for-non-register" replace />} />
              <Route path="home-for-non-register" element={<HomeForNonRegister />} />
              
              {/* Authenticated Routes */}
              <Route path="home-for-register" element={<HomeForRegister />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="photographer-detail" element={<PhotographerDetail />} />
              <Route path="messages/:myUserId" element={<MessageList />} />
              <Route path="messages/:myUserId/:otherUserId" element={<UserMessage />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="contact" element={<Contact />} />
              <Route path="how-to-use" element={<HowToUse />} />
              <Route path="review-complete" element={<ReviewComplete />} />
              <Route path="portfolio-management" element={<PortfolioManagement />} />
            </Route>

            {/* Special routes without layout */}
            <Route path="first-time-profile-setup" element={<FirstTimeProfileSetup />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/home-for-non-register" replace />} />
          </Routes>
        </BrowserRouter>
      </UnreadProvider>
    </QueryClientProvider>
  );
}

export default App;

