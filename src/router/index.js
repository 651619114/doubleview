/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import testRecord from '@/views/pc/double/video/video_wait.vue'
import supervision from '@/views/pc/double/video/video_check.vue'
import waitMore from '@/views/pc/ceshi.vue'


const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router)

const router = new Router({
    mode: 'hash',
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    routes: [
        // 进入等待区 一对多
        {
            path: '/',
            name: 'Waitmore',
            component: waitMore,
        },

        // 监察员
        {
            path: '/double/video/index',
            name: 'video-check',
            component: supervision
        },
        //忘记密码
        {
            path: '/double/video/wait',
            name: 'video-wait',
            component: testRecord,
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    console.log('to', to)
    console.log('from', from)
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.name == 'scene') {
        document.title = localStorage.getItem('btn_name')
    }

    next()
})

export default router