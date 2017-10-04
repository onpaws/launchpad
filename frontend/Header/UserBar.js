/* @flow */

import React, { Component } from 'react';
import type { User } from '../types';
import HeaderDropdownButton from './HeaderDropdownButton';
import HeaderDropdown from './HeaderDropdown';
import HeaderButton from './HeaderButton';
import './UserBar.less';

export default class UserBar extends Component {
  props: {|
    user: ?User,
    onLogin: () => any,
    onLogout: () => any,
  |};

  state: {|
    userDropdownOpen: boolean,
  |};

  constructor() {
    super();
    this.state = {
      userDropdownOpen: false,
    };
  }

  handleLogin = (e: Event) => {
    e.preventDefault();
    this.props.onLogin();
  };

  handleLogout = (e: Event) => {
    e.preventDefault();
    this.props.onLogout();
  };

  handleOpenUserDropdown = (e: Event) => {
    e && e.preventDefault();

    this.setState({
      userDropdownOpen: true,
    });
  };

  handleCloseUserDropdown = (e?: Event) => {
    e && e.preventDefault();

    this.setState({
      userDropdownOpen: false,
    });
  };

  renderButton(): React$Element<*> {
    let onClick;
    if (this.state.userDropdownOpen) {
      onClick = this.handleCloseUserDropdown;
    } else {
      onClick = this.handleOpenUserDropdown;
    }
    return (
      <HeaderButton active={this.state.userDropdownOpen} onClick={onClick}>
        <span className="icon-user" />
        <span>
          {(this.props.user && this.props.user.githubUsername) || 'no-username'}
        </span>
        <span className="UserBar-Arrow">▾</span>
      </HeaderButton>
    );
  }

  render() {
    if (this.props.user) {
      return (
        <div className="UserBar">
          <HeaderDropdown
            open={this.state.userDropdownOpen}
            onClose={this.handleCloseUserDropdown}
            button={this.renderButton()}
          >
            <HeaderDropdownButton onClick={this.handleLogout}>
              Sign out
            </HeaderDropdownButton>
            <HeaderDropdownButton>
              <a href="/list">Pads you created</a>
            </HeaderDropdownButton>
          </HeaderDropdown>
        </div>
      );
    } else {
      return (
        <div className="UserBar">
          <HeaderButton onClick={this.handleLogin}>
            <span className="icon-github" />
            <span>Sign in</span>
          </HeaderButton>
        </div>
      );
    }
  }
}
