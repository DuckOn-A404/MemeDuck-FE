import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MyPage from './pages/MyPage';
import SearchResultPage from './pages/SearchResultPage';
import MemeDetailPage from './pages/MemeDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/upload',
    element: <UploadPage />,
  },
  {
    path: '/mypage',
    element: <MyPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/search/:query',
    element: <SearchResultPage />,
  },
  {
    path: '/memes/:id',
    element: <MemeDetailPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/oauth2/redirect',
    element: <OAuth2RedirectHandler />,
  },
  // {
  //   path: '/tag/:tagName',
  //   element: <TagPage />,
  // },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
