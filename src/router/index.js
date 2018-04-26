import Vue from 'vue'
import Router from 'vue-router'
import register from '@/components/register'
import CreateLower from '@/components/CreateLower'
import bosslist from '@/components/bosslist'
import homePage from '@/components/homePage'
import withdrawalRecord from '@/components/withdrawalRecord'
import accountInformation from '@/components/accountInformation'
import withdrawals from '@/components/withdrawals'
import disciplePartner from '@/components/disciplePartner'
import supperPartner from '@/components/supperPartner'
import mechanism from '@/components/mechanism'
import furtherInformation from '@/components/furtherInformation'
Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [{
      path: '/',
      name: 'register',
      component: register
    },
    {
      path: '/bosslist',
      name: 'bosslist',
      component: bosslist,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/CreateLower',
      name: 'CreateLower',
      component: CreateLower,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/withdrawals',
      name: 'withdrawals',
      component: withdrawals,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/withdrawalRecord',
      name: 'withdrawalRecord',
      component: withdrawalRecord,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/accountInformation',
      name: 'accountInformation',
      component: accountInformation,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/disciplePartner',
      name: 'disciplePartner',
      component: disciplePartner,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/supperPartner',
      name: 'supperPartner',
      component: supperPartner,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/mechanism',
      name: 'mechanism',
      component: mechanism,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/furtherInformation',
      name: 'furtherInformation',
      component: furtherInformation,
      meta: {
        requireAuth: true,
      },
    }
  ]
})
