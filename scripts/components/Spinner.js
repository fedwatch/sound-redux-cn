import React, {Component} from 'react';

/**
 * 旋式动画
 */
class Spinner extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="spinner-container">
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div>
        );
    }
}

export default Spinner;
