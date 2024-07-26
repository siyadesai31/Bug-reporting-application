const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/admin', component: () => import('pages/AdminPage.vue') },
      { path: '/tester', component: () => import('pages/TesterPage.vue') },
      { path: '/developer', component: () => import('pages/DeveloperPage.vue') },
      { path: '/admin/task', component: () => import('pages/AdminTaskPage.vue') },
      { path: '/test/task', component: () => import('pages/TesterTaskPage.vue') },
      { path: '/develop/task', component: () => import('pages/DeveloperTaskPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
