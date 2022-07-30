export default [
  {
    path: "/",
    meta: {
      title: "云宣讲",
    },
    component: () => import("@/views/pc/ceshi.vue"),
  },
  
  {
    path: '/double/video/check',
    name: 'video-check',
    component: () => import('@/views/pc/double/video/video_check.vue')
  },
  {
    path: '/double/video/wait',
    name: 'video-wait',
    component: () => import('@/views/pc/double/video/video_wait.vue')
  },
];
