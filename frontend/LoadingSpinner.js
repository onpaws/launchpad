/* @flow */

import classnames from 'classnames';
import React from 'react';

import './LoadingSpinner.less';

const TICK_COUNTS = { small: 16, medium: 24, large: 32 };

const LoadingSpinner = ({
  size,
  className,
}: {
  size: 'small' | 'medium' | 'large',
  className?: string,
}) => {
  const ticks = [];
  for (var i = 0; i < (TICK_COUNTS[size] || 16); i++) {
    ticks.push(<div key={i} className="spinner-tick" />);
  }
  return (
    <div className={classnames('loading-spinner', size, className)}>
      <div className="spinner-wheel" />
      <div className="spinner-ticks">{ticks}</div>
    </div>
  );
};

export { LoadingSpinner };
