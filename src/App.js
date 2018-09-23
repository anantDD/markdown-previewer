import React from "react";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import marked from "marked";
import "./App.css";

const defaultText = `
# Welcome to my React Markdown Previewer!

## This is a sub-heading...

There's also [links](https://www.freecodecamp.com), and

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == 'a' && lastLine == 'b') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
> Block Quotes!

![React Logo w/ Text](https://goo.gl/Umyytc)
`;

const ADD = "ADD";

const showPreview = markup => {
  return {
    type: ADD,
    markup: markup
  };
};

function previewReducer(state = defaultText, action) {
  switch (action.type) {
    case ADD:
      return action.markup;
      break;
  }
  return state;
}

const store = createStore(previewReducer);

function mapStateToProps(state) {
  return { markup: state };
}
function mapDispatchToProps(dispatch) {
  return {
    showAndTell: newMarkup => {
      dispatch(showPreview(newMarkup));
    }
  };
}
// Get reference from marked.js library
const renderer = new marked.Renderer();

// Override function
renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank">${text}</a>`;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    // let k= defaultText;
    // this.state={
    //   input: defaultText
    // }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    event.preventDefault();
    // console.log(this.state.input, event.target.value);

    // this.setState( {
    //   input: event.target.value
    // });
    this.props.showAndTell(event.target.value);
  }

  render() {
    return (
      <div>
        <TextInput
          handleChange={this.handleChange}
          textValue={this.props.markup}
        />
        {<Previewer markdown={this.props.markup} />}
      </div>
    );
  }
}

const ConnectedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="editorC" className="">
        <div className="editorHeading">EDITOR</div>
        <textarea
          id="editor"
          onChange={this.props.handleChange}
          value={this.props.textValue}
        />
      </div>
    );
  }
}

class Previewer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let markdown = marked(this.props.markdown, { renderer: renderer });
    return (
      <div id="previewC" className="">
        <div className="previewerHeading">PREVIEWER</div>
        <div id="preview" dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>
    );
  }
}
class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedContainer />
      </Provider>
    );
  }
}

export default AppWrapper;
