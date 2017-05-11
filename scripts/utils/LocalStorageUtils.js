/**
 * 本地储存工具类
 */
//检测 localStorage 是否可用
const isAvailable = (function isAvailableIffe() {
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}());

const util = {
    get(key) {
        if (isAvailable) {
            return localStorage.getItem(key);
        }
        return null;
    },

    set(key, value) {
        if (isAvailable) {
            return localStorage.setItem(key, value);
        }

        return null;
    },

    clear(){
        if(isAvailable){
            return localStorage.clear();
        }
        return null;
    },

    length(){
        if(isAvailable){
            return localStorage.length;
        }
        return null;
    },
};

export default util;
