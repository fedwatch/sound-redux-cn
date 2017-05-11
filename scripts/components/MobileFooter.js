import React, {Component} from 'react';

/**
 * 移动页脚
 */
class MobileFooter extends Component {
    /**
     * 构造器
     */
    constructor(){
        super();
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return <div>
            <span className="playlist-footer">
                XDuo
            </span>
        </div>;
    }
}

export default MobileFooter;
