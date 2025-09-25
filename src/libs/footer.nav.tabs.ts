import { logout } from "./utils/auth";

// Tabs for footer navigation
export const tabs = (roomCode: string) => [
  { name: 'dashboard', label: 'Dashboard', path: `/game/${roomCode}` },
  { name: 'history', label: 'Pairing History', path: `/game/${roomCode}/pairing-history` },
  { name: 'partial', label: 'Partial Scores', path: `/game/${roomCode}/partial-scores` },
  { name: 'results', label: 'Final Results', path: `/game/${roomCode}/results` },
  { name: 'how-to-play', label: 'How to Play?', path: `/how-to-play` },
  { name: 'logout', label: '⏻ Logout', act: logout}
]
