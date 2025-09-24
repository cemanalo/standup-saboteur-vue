import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateGameView from '@/views/CreateGameView.vue'
import LobbyView from '@/views/LobbyView.vue'
import JoinGameView from '@/views/JoinGameView.vue'
import GameView from '@/views/GameView.vue'
import PairingHistoryView from '@/views/PairingHistoryView.vue'
import PartialScoresView from '@/views/PartialScoresView.vue'
import ResultsView from '@/views/ResultsView.vue'
import HowToPlayView from '@/views/HowToPlayView.vue'
import { isAuthenticated } from '@/libs/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/lobby/:roomCode',
      name: 'lobby',
      component: LobbyView,
      meta: { requiresAuth: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateGameView,
    },
    {
      path: '/join',
      name: 'join',
      component: JoinGameView,
    },
    {
      path: '/game/:roomCode',
      name: 'game',
      component: GameView,
      meta: { requiresAuth: true },
    },
    {
      path: '/game/:roomCode/pairing-history',
      name: 'pairing-history',
      component: PairingHistoryView,
      meta: { requiresAuth: true },
    },
    {
      path: '/game/:roomCode/partial-scores',
      name: 'partial-scores',
      component: PartialScoresView,
    },
    {
      path: '/game/:roomCode/results',
      name: 'results',
      component: ResultsView,
    },
    {
      path: '/how-to-play',
      name: 'how-to-play',
      component: HowToPlayView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    console.log('Not authenticated, redirecting to home')
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
