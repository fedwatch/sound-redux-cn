import React, {Component, PropTypes} from 'react';
import Link from '../components/Link';
import {GENRES} from '../constants/SongConstants';

const DAYS = [7, 30, 90];
/**
 * 属性验证
 * @type {{dispatch: *, playlist: *, time: (*)}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    playlist: PropTypes.string.isRequired,
    time: PropTypes.number,
};

/**
 * 工具栏
 */
class Toolbar extends Component {
    /**
     * 渲染歌曲类型
     * @returns {Array}
     */
    renderGenres() {
        const {dispatch, playlist, time} = this.props;
        const genre = playlist.split(' - ')[0];

        return GENRES.map(g => {
            const route = {
                path: ['songs'],
                query: {
                    q: g,
                    t: time,
                },
            };

            return (
                <Link
                    className={`toolbar-item toolbar-genre ${(g === genre ? 'active' : '')}`}
                    dispatch={dispatch}
                    key={g}
                    route={route}
                >
                    {g}
                </Link>
            );
        });
    }

    /**
     * 渲染时间
     * @returns {Array}
     */
    renderTimes() {
        const {dispatch, playlist, time} = this.props;
        const genre = playlist.split(' - ')[0];

        return DAYS.map(t => {
            const route = {
                path: ['songs'],
                query: {
                    q: genre,
                    t: (t === time ? null : t),
                },
            };

            return (
                <Link
                    className={`toolbar-time ${(t === time ? 'active' : '')}`}
                    dispatch={dispatch}
                    key={t}
                    route={route}
                >
                    {`${t} days`}
                </Link>
            );
        });
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="toolbar">
                <div className="container">
                    <div className="toolbar-items">
                        {this.renderGenres()}
                        <div className="toolbar-item toolbar-filter toolbar-times">
                            <i className="icon ion-funnel"/>
                            {this.renderTimes()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Toolbar.propTypes = propTypes;

export default Toolbar;
