import React, { Component } from 'react';
import { connect } from 'react-redux';
import SortIcon from '@material-ui/icons/Sort';
import PopupMenu from './matrix/PopupMenu';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../core/actions';

const mapStateToProps = (state) => {
  const { tasks } = state;
  const props = {
    sort: tasks.sort,
  };
  return props;
};

const actionCreators = {
  setTaskSort: actions.setTaskSort,
};

const styles = {
  sortContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  sortIcon: {
    marginRight: '10px',
  },
};

class Sort extends Component {
  state = {
    anchorEl: null,
    actions: [
      {
        label: 'По умлочанию',
        value: 'createdAt:desc',
        action: () => this.setSort('createdAt:desc'),
      },
      {
        label: 'Сроку исполнения',
        value: 'executionDate:desc',
        action: () => this.setSort('executionDate:desc'),
      },
      {
        label: 'Приоритету',
        value: 'priority:asc',
        action: () => this.setSort('priority:asc'),
      },
    ]
  };

  handleClickPopupMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClosePopupMenu = () => {
    this.setState({ anchorEl: null });
  };

  setSort = async (sort) => {
    const { setTaskSort, syncTasks, history } = this.props;
    await setTaskSort({sort});
    history.push({ search: `?sort=${sort}` });
    syncTasks();
  };

  labelSort = () => {
    const { sort } = this.props;
    const { actions } = this.state;
    const action = actions.find(itm => itm.value === sort);
    return action.label;
  };

  render() {
    const { classes, sort } = this.props;
    const { anchorEl, actions } = this.state;
    const filteredActions = actions.filter(itm => itm.value !== sort);

    return (
      <div>
        <div onClick={this.handleClickPopupMenu} className={classes.sortContainer}>
          <SortIcon className={classes.sortIcon}/>
          <div>{this.labelSort()}</div>
        </div>
        <PopupMenu anchorEl={anchorEl} actions={filteredActions} handleClose={this.handleClosePopupMenu}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Sort));