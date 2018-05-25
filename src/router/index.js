import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/page/Home'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Home, alias: ['/home'] },

    {
      path: '/console',
      component: () => import('@/page/Console'),
      alias: ['/console/game'],
      children: [
        {
          path: 'game/all',
          component: () => import('@/page/Console/Game/All'),
          alias: ['', 'game']
        },
        {
          path: 'game/create',
          component: () => import('@/page/Console/Game/Create')
        },
        {
          path: 'game/deleted',
          component: () => import('@/page/Console/Game/Create')
        },
        {
          path: 'game/playing',
          component: () => import('@/page/Console/Game/Create')
        },
        {
          path: 'game/ended',
          component: () => import('@/page/Console/Game/Create')
        },
        {
          path: 'game/:id',
          component: () => import('@/page/Console/Game/Info'),
          children: [
            {
              path: ':index/:name',
              component: () => import('@/page/Game/NodeControlPanel')
            }
          ]
        },
        {
          path: 'status',
          component: () => import('@/page/Console/Game/Create')
        },
        {
          path: 'status/logs',
          component: () => import('@/page/Console/Game/Create')
        }
      ]
    },

    {
      path: '/player/login',
      component: () => import('@/page/Player/Login')
    }
    /*
    {
      path: '/boardcast/scoreboard',
      component: () => import('@/page/Scoreboard'),
      alias: ['/boardcast']
    },

    {
      path: '/regist/new',
      component: () => import('@/page/Regist/new'),
      alias: ['/regist']
    },
    { path: '/regist/old', component: () => import('@/page/Regist/old') },
    { path: '/regist/player', component: () => import('@/page/Regist/player') },

    {
      path: '/choose',
      component: () => import('@/page/Choose'),
      children: [
        {
          path: '',
          component: () => import('@/page/Choose/Game'),
          alias: ['game']
        },
        { path: ':gameId/team', component: () => import('@/page/Choose/Team') },
        {
          path: ':gameId/:teamIndex/job',
          component: () => import('@/page/Choose/Job')
        },
        {
          path: ':gameId/:teamIndex/:job/ready',
          component: () => import('@/page/Choose/Ready')
        }
      ]
    },

    {
      path: '/round/:gameId/:teamIndex/',

      component: () => import('@/page/Round'),
      children: [
        { path: 'factory', component: () => import('@/page/Round/Factory') },
        {
          path: 'wholesaler',
          component: () => import('@/page/Round/Wholesaler')
        },
        { path: 'retailer', component: () => import('@/page/Round/Retailer') },
        {
          path: 'guerrilla',
          component: () => import('@/page/Round/Guerrilla'),
          alias: ['keeper']
        },
        {
          path: 'exchanger',
          component: () => import('@/page/Round/Exchanger')
        },
        {
          path: 'transporter',
          component: () => import('@/page/Round/Transporter')
        },
        { path: 'market', component: () => import('@/page/Round/Market') },
        { path: 'consoler', component: () => import('@/page/Round/Consoler') }
      ]
    },

    { path: '/end', component: import('@/page/End') }
    */
  ]
})
