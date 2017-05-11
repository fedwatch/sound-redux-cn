/**
 * 用户工具类
 */
import {CLIENT_ID} from '../constants/Config';


/**
 * 构造用户跟随
 * @param userId
 * @returns {string}
 */
export function constructUserFollowingsUrl(userId) {
    return `//api.soundcloud.com/users/${userId}/followings?client_id=${CLIENT_ID}`;
}

/**
 * 构造用户介绍
 * @param userId
 * @returns {string}
 */
export function constructUserProfilesUrl(userId) {
    return `//api.soundcloud.com/users/${userId}/web-profiles?client_id=${CLIENT_ID}`;
}

/**
 * 构造用户轨道
 * @param userId
 * @returns {string}
 */
export function constructUserTracksUrl(userId) {
    return `//api.soundcloud.com/users/${userId}/tracks?client_id=${CLIENT_ID}`;
}

/**
 * 构造用户URL
 * @param userId
 * @returns {string}
 */
export function constructUserUrl(userId) {
    return `//api.soundcloud.com/users/${userId}?client_id=${CLIENT_ID}`;
}

/**
 * 获取用户位置
 * @param user
 * @returns {*}
 */
export function getUserLocation(user) {
    if (user.city && user.country) {
        return `${user.city}, ${user.country}`;
    } else if (user.city) {
        return user.city;
    } else if (user.country) {
        return user.country;
    }

    return 'Earth';
}
