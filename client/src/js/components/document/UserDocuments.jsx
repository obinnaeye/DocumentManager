import React from 'react';
import DocumentCarousel from './DocumentCarousel';

class UserDocuments extends React.Componets {
  constructor(props, context) {
    super(props, context);
    this.state={
      title: '',
      content: '',
    };

    this.viewCarousel = this.viewCarousel;
  }

  viewCarousel(e) {
    console.log(e.target);
  }

  render() {
    return (
      <DocumentCarousel
        title={this.state.title}
        content={this.state.content}
        viewCarousel={this.openCarousel}
      />
    );
  }
}
