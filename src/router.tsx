import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  // TODO: 추가 라우트
  // {
  //   path: '/upload',
  //   element: <UploadPage />,
  // },
  // {
  //   path: '/meme/:id',
  //   element: <MemeDetailPage />,
  // },
  // {
  //   path: '/tag/:tagName',
  //   element: <TagPage />,
  // },
]);
