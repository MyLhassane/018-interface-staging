import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Game from './pages/Game';
import Factor from './pages/Factor';
import Decode from './pages/Decode';
import Impostor from './pages/Impostor';
import Grid from './pages/Grid';
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
    element: <Game gameType="connections" />,
  },
  {
    path: '/game/connections',
    element: <Game gameType="connections" />,
  },
  {
    path: '/game/factor',
    element: <Factor />,
  },
  {
    path: '/game/decode',
    element: <Decode />,
  },
  {
    path: '/game/impostor',
    element: <Impostor />,
  },
  {
    path: '/game/grid',
    element: <Grid />,
  },
]);
