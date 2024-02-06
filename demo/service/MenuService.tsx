import { Demo } from '@/types';

export const MenuService = {
    getMenusSmall() {
        return fetch('/demo/data/menus-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Menu[]);
    },

    getMenus() {
        return fetch('/demo/data/menus.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Menu[]);
    },

    getMenusWithOrdersSmall() {
        return fetch('/demo/data/menus-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Menu[]);
    }
};
