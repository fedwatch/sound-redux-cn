/**
 * 操作类型
 * @type {{NEXT: string, PLAY: string, PREV: string, SHUFFLE: string}}
 */
export const CHANGE_TYPES = {
    NEXT: 'next',
    PLAY: 'play',
    PREV: 'prev',
    SHUFFLE: 'shuffle',
};

/**
 * 歌曲分类
 * @type {[*]}
 */
export const GENRES = [
    'chill',
    'deep',
    'dubstep',
    'house',
    'progressive',
    'tech',
    'trance',
    'tropical',
];


export const GENRES_MAP = GENRES.reduce((obj, genre) =>
    Object.assign({}, obj, {
        [genre]: 1,
    }), {});

/**
 * 图片大小
 * @type {{LARGE: string, XLARGE: string}}
 */
export const IMAGE_SIZES = {
    LARGE: 't300x300',
    XLARGE: 't500x500',
};
