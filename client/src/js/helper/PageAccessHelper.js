import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default (TargetComponent) => {
  class PageAccessHelper extends React.Component {

    componentWillMount() {
      console.log(this.props.user);
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user) {
        this.context.router.push('/signin');
      }
    }

    /**
     * render
     * @method
     * @returns {jsx} - jsx
     */
    render() {
      return (
        <TargetComponent />
      );
    }
  }

  PageAccessHelper.propTypes = {
    user: PropTypes.object.isRequired
  };

  // PageAccessHelper.contextTypes = {
  //   router: PropTypes.object.isRequired
  // };

  const mapStateToProps = state => ({
    user: state
  });
  return connect(mapStateToProps)(PageAccessHelper);
};

