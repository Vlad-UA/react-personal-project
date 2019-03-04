// Core
import React, { Component } from "react";

// Components
import Task from "../Task";
import Spinner from "../Spinner";
import Checkbox from "../../theme/assets/Checkbox";

// Constants
import { DESCRIPTION_LENGTH_MAX } from "../../constants/task";

// Instruments
import FlipMove from 'react-flip-move';
import Styles from "./styles.m.css";
import { sortTasksByGroup } from "../../instruments";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    constructor (props) {
        super(props);

        this.state = {
            tasks:           [],
            newTaskMessage:  '',
            tasksFilter:     '',
            isTasksFetching: false,
        };
    }

    async componentDidMount () {
        await this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({ tasks });

        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;

        if (this._getAllCompleted()) {
            return null;
        }

        this._setTasksFetchingState(true);

        await api.completeAllTasks(tasks);

        this.setState((currentState) => ({
            tasks: currentState.tasks.map((task) => ({ ...task, completed: true })),
        }));

        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        if (newTaskMessage.length > 0) {
            event.preventDefault();

            this._setTasksFetchingState(true);

            const response = await api.createTask(newTaskMessage);

            this.setState((stateCurrent) => ({
                tasks:          [...stateCurrent.tasks, { ...response }],
                newTaskMessage: '',
            }));
            this._setTasksFetchingState(false);
        } else {
            return null;
        }
    };

    _updateNewTaskMessage = (event) => {
        const newTaskMessage = event.target.value;

        this.setState({ newTaskMessage });
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);

        this.setState((stateCurrent) => ({
            tasks: stateCurrent.tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (task) => {
        this._setTasksFetchingState(true);

        const response = await api.updateTask(task);

        // this.setState((currentState) => ({
        //     tasks: [...currentState.tasks.filter((task2) => task2.id !== task.id), ...response],
        // }));

        this._setTasksFetchingState(false);
    };

    _updateTasksFilter = (e) => {
        this.setState({ tasksFilter: e.target.value.toLowerCase() });
    };

    _getFilteredTasks = (tasks, tasksFilter) => {
        return tasks.filter((task) => task.message.includes(tasksFilter));
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    _setTasksFetchingState=(isTasksFetching) => {
        this.setState({ isTasksFetching });
    };

    render () {
        const { tasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' value = { tasksFilter } onChange = { this._updateTasksFilter } />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input className = 'createTask' maxLength = { DESCRIPTION_LENGTH_MAX } placeholder = 'Описaние моей новой задачи' type = 'text' value = { newTaskMessage } onChange = { this._updateNewTaskMessage } />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>
                                <FlipMove
                                    delay = { 0 }
                                    disableAllAnimations = { false }
                                    duration = { 400 }
                                    easing = 'ease-in-out'
                                    enterAnimation = 'elevator'
                                    leaveAnimation = 'elevator'
                                    maintainContainerHeight = { false }
                                    staggerDelayBy = { 0 }
                                    staggerDurationBy = { 0 }
                                    typeName = 'div'
                                    verticalAlignment = 'top'>
                                    {sortTasksByGroup(this._getFilteredTasks(tasks, tasksFilter)).map(({ id, completed, favorite, message }) => (
                                        <Task
                                            _removeTaskAsync = { this._removeTaskAsync }
                                            _updateTaskAsync = { this._updateTaskAsync }
                                            completed = { completed }
                                            favorite = { favorite }
                                            id = { id }
                                            key = { id }
                                            message = { message }
                                        />
                                    ))}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
