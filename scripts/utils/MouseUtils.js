// 鼠标移动工具类
/**
 * 获取鼠标移动偏移量
 * @param element
 * @returns {Number|number}
 */
export function offsetLeft(element) {
    let el = element;
    let x = el.offsetLeft;

    while (el.offsetParent) {
        x += el.offsetParent.offsetLeft;
        el = el.offsetParent;
    }

    return x;
}
