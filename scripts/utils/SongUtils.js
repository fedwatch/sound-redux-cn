/**
 * 歌曲工具类
 */
import moment from 'moment';
import {CLIENT_ID} from '../constants/Config';
import {GENRES_MAP, IMAGE_SIZES} from '../constants/SongConstants';

/**
 * 构造URL
 * @param cat
 * @returns {string}
 */
export function constructUrl(cat) {
    const catArr = cat.split(' - ');
    let category = catArr[0];
    let result = '//api.soundcloud.com/tracks?linked_partitioning=1&client_id=' +
        `${CLIENT_ID}&limit=50&offset=0`;

    if (category in GENRES_MAP) {
        if (category !== 'house'
            && category !== 'trance'
            && category !== 'dubstep') {
            category = `${category} house`;
        }

        result += `&tags=${category}`;
    } else {
        result += `&q=${category}`;
    }

    if (catArr.length > 1) {
        const formattedTime = moment().subtract(catArr[1], 'days').format('YYYY-MM-DD%2012:00:00');
        result += `&created_at[from]=${formattedTime}`;
    }

    return result;
}

/**
 * 构造歌曲评论URL
 * @param songId
 * @returns {string}
 */
export function constructSongCommentsUrl(songId) {
    return `//api.soundcloud.com/tracks/${songId}/comments?client_id=${CLIENT_ID}`;
}

/**
 * 构造歌曲URL
 * @param songId
 * @returns {string}
 */
export function constructSongUrl(songId) {
    return `//api.soundcloud.com/tracks/${songId}?client_id=${CLIENT_ID}`;
}

/**
 * 构造用户歌曲URL
 * @param userId
 * @returns {string}
 */
export function constructUserSongsUrl(userId) {
    return `//api.soundcloud.com/users/${userId}/tracks?client_id=${CLIENT_ID}`;
}

/**
 * 从数据中抓取JSON
 * @param waveformUrl
 * @returns {Promise.<TResult>}
 */
export function fetchWaveformData(waveformUrl) {
    return fetch(waveformUrl)
        .then(response => response.json())
        .then(json => json.samples)
        .catch(err => {
            throw err;
        });
}

/**
 * 获取图片URL
 * @param s
 * @param size
 * @returns {*}
 */
export function getImageUrl(s, size = null) {
    let str = s;
    if (!str) {
        return '';
    }

    str = str.replace('http:', '');

    switch (size) {
        case IMAGE_SIZES.LARGE:
            return str.replace('large', IMAGE_SIZES.LARGE);
        case IMAGE_SIZES.XLARGE:
            return str.replace('large', IMAGE_SIZES.XLARGE);
        default:
            return str;
    }
}
