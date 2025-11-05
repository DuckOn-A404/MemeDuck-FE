import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MyPage from './pages/MyPage';

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
  // {
  //   path: '/meme/:id',
  //   element: <MemeDetailPage />,
  // },
  // {
  //   path: '/tag/:tagName',
  //   element: <TagPage />,
  // },
]);
