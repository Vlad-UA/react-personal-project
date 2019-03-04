// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    render () {
        const { isSpinning } = this.props;

        return isSpinning ? <div className = { Styles.spinner } /> : null;
    }
}

Spinner.propTypes = {
    isSpinning: PropTypes.bool.isRequired,
};

Spinner.defaultProps = {
    isSpinning: false,
};
