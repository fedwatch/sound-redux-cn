import React, {Component, PropTypes} from 'react';
import SidebarContent from '../components/SidebarContent';
import UserCard from '../components/UserCard';

/**
 * 属性验证
 * @type {{dispatch: *, height: *, users: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
};

/**
 * 跟随展示组件
 */
class Followings extends Component {
    /**
     * 渲染跟随
     */
    renderFollowings() {
        const {dispatch, users} = this.props;
        return users.map(user => <UserCard dispatch={dispatch} key={user.id} user={user}/>);
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {height, users} = this.props;

        return (
            <div className="followings">
                <div className="followings-header">
                    <div className="followings-title">
                        {`Following ${users.length} Users`}
                    </div>
                </div>
                <SidebarContent height={height - 220}>
                    {this.renderFollowings()}
                </SidebarContent>
            </div>
        );
    }
}

Followings.propTypes = propTypes;

export default Followings;
