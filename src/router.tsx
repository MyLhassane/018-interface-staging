import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Rooms from './pages/Rooms';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'rooms', element: <Rooms /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/game',
    element: <Game />,
  },
  {
    path: '/game/connections',
    element: <Game />,
  },
  {
    path: '/game/factor',
    element: <Game />,
  },
  {
    path: '/game/decode',
    element: <Game />,
  },
  {
    path: '/game/impostor',
    element: <Game />,
  },
  {
    path: '/game/grid',
    element: <Game />,
  },
]);
