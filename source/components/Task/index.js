// Core
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

// Constants
import { DESCRIPTION_LENGTH_MAX } from "../../constants/task";

// Components
import Star from "../../theme/assets/Star";
import Checkbox from "../../theme/assets/Checkbox";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    constructor (props) {
        super(props);

        const { message } = props;

        this.state = {
            isTaskEditing: false,
            newMessage:    message,
        };

        this.cx = classNames.bind(Styles);

        this.taskInput = React.createRef();
    }

    componentDidUpdate () {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this.taskInput.current.focus();
        }
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({ isTaskEditing });
    };

    _updateNewTaskMessage = (e) => {
        this.setState({ newMessage: e.target.value });
    };

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        this._setTaskEditingState(false);

        if (message !== newMessage) {
            _updateTaskAsync(this._getTaskShape({ message: newMessage }));
        } else {
            return null;
        }
    };

    _updateTaskMessageOnKeyDown = (e) => {
        const { newMessage } = this.state;

        if (newMessage.length > 0) {
            switch (e.key) {
                case 'Enter':
                    this._updateTask();
                    this._setTaskEditingState(false);
                    break;
                case 'Escape':
                    this._cancelUpdatingTaskMessage();
                    this._setTaskEditingState(false);
                    break;
                default:
            }
        } else {
            return null;
        }
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);

    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };

    render () {
        const { completed, favorite } = this.props;

        const { isTaskEditing, newMessage } = this.state;

        const className = this.cx(Styles.task, { completed });

        return (
            <li className = { className }>
                <div className = { Styles.content }>
                    <Checkbox inlineBlock checked = { completed } className = { Styles.toggleTaskCompletedState } color1 = '#3B8EF3' color2 = '#FFF' onClick = { this._toggleTaskCompletedState } />
                    <input disabled = { !isTaskEditing } maxLength = { DESCRIPTION_LENGTH_MAX } ref = { this.taskInput } type = 'text' value = { newMessage } onChange = { this._updateNewTaskMessage } onKeyDown = { this._updateTaskMessageOnKeyDown } />
                </div>
                <div className = { Styles.actions }>
                    <Star inlineBlock checked = { favorite } className = { Styles.toggleTaskFavoriteState } color1 = '#3B8EF3' color2 = '#000' onClick = { this._toggleTaskFavoriteState } />
                    <Edit inlineBlock checked = { isTaskEditing } className = { Styles.updateTaskMessageOnClick } color1 = '#3B8EF3' color2 = '#000' onClick = { this._updateTaskMessageOnClick } />
                    <Remove inlineBlock className = { Styles.removeTask } color1 = '#3B8EF3' color2 = '#000' onClick = { this._removeTask } />
                </div>
            </li>);
    }
}

Task.propTypes = {
    _removeTaskAsync: PropTypes.func.isRequired,
    _updateTaskAsync: PropTypes.func.isRequired,
    completed:        PropTypes.bool.isRequired,
    favorite:         PropTypes.bool.isRequired,
    id:               PropTypes.string.isRequired,
    message:          PropTypes.string.isRequired,
};
