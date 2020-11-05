import Vue from 'vue';
import VueRouter from 'vue-router';
import ScavengingManagement from './ScavengingManagement';


const appMain = (resolve) => {
    require(['../page/manage.vue'], resolve);
};
// const appMain = (resolve) => {
//     require(['../page/home.vue'], resolve);
// };
const routes = [{
        path: '/',
        component: appMain,
        meta: {
            title: '概览',
        },
    },
].concat(
    ScavengingManagement,
);

Vue.use(VueRouter);

export default new VueRouter({
    // mode: 'history',
    routes,
});
