import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Navbar, Jumbotron, Button, FormControl } from 'react-bootstrap';
//import { VoicePlayer, VoiceRecognition } from 'react-voice-components'


//import { VoicePlayer, VoiceRecognition } from 'react-voice-components';

class App extends Component {
  constructor() {
    super();
    this.state = {
      conversationSoFar: [],
      conversationPlan: [
        {
          text: "小马和他的妈妈住在小河边。他过的很快乐",
          text_base: "Little Horse and his mother lived by the river.",
          user: 'npc',
          id: '0'
        },
        {
          text: "他过的很快乐，时光飞快地过去了",
          text_base: "He passed his days happily, and time flew by.",
          user: 'npc',
          id: '1'
        },
        {
          text: "有一天，妈妈把小马叫到身边说:",
          text_base: "One day, Mother called little horse to her side and said:",
          user: 'me', 
          id: '2'
        },
        {
          text: "“小马，你已经长大了，可以帮妈妈做事了。",
          user: 'me',
          text_base: "Little Horse, you’re all grown up, you can help mother with a few things.",
          id: '3'
        },
        {
          text: "今天你把这袋粮食送到河对岸的村子里去吧。”",
          user: 'npc',
          text_base: "Today, take that sack of grain and take it to the village on the opposite riverbank.”",
          id: '4'
        },
        {
          text: "声読命新世情出女訪",
          user: 'me',
          text_base: "Freedom is the key to success.",
          id: '5'
        },
        {
          text: "真動購会集。闘地済訃障透比削毎両号品河報指応問茂気。死中同頼総板野優払重機目競。権判産記住記検",
          user: 'npc',
          text_base: "Wow this is such a long sentence.",
          id: '6'
        },
        {
          text: "告円団旅注際陛。千療窓日",
          user: 'me',
          text_base: "What should I saw now?",
          id: '7'
        },
        {
          text: "権判産記住記検断版国変報告県",
          user: 'npc',
          text_base: "This conversation just got awkward",
          id: '8'
        },
        {
          text: "複無著天球式締系次募殺震参伴歩期載渡歓半",
          user: 'me',
          text_base: "What kind of music do you like to listen to?",
          id: '9'
        },
        {
          text: "環球田津霊保予航掲柱区社護。",
          user: 'npc',
          text_base: "Why did you vote for Donald Trump?",
          id: '10'
        }
      ],
      textCount: 0
    };
  }

  computerResponse() {
    this.setState({
      textCount: this.state.textCount + 1
    });
    this.state.conversationSoFar.push({
      text: this.state.conversationPlan[this.state.textCount].text,
      user: 'npc',
      id: this.state.textCount
    });
    if ('speechSynthesis' in window) {
      var msg = new SpeechSynthesisUtterance(this.state.conversationPlan[this.state.textCount].text,);
      msg.lang = 'zh-CN';
      window.speechSynthesis.speak(msg);
    }
  }

  componentDidUpdate() {
    const mandarinspot = window.mandarinspot;
    mandarinspot.annotate(".annotate");
  }

  updateConversation(message) {
    this.setState({
      textCount: this.state.textCount + 1
    }, this.computerResponse);
    this.state.conversationSoFar.push({
      text: message,
      user: 'me',
      id: this.state.textCount
    });
  }

  render() {
    return (
      <div className="outer">
        <Conversation 
          value={this.state.conversationSoFar} 
          onClick={m => this.updateConversation(m)} />
        <div className="suggestion-box">
          <SuggestionBox 
            value={this.state.conversationPlan}
            textCount={this.state.textCount} />
        </div>
      </div>
    );
  }
}

class Conversation extends Component {
  constructor() {
    super();
    this.startRecording();
    this.state = {
      userInput: ''
    };
    this.sendResponse = this.sendResponse.bind(this);
  }

  startRecording() {
    const root = typeof window !== 'undefined' ? window : this
    const BrowserSpeechRecognition = root.SpeechRecognition ||
                                     root.webkitSpeechRecognition ||
                                     root.mozSpeechRecognition ||
                                     root.msSpeechRecognition ||
                                     root.oSpeechRecognition
    if (BrowserSpeechRecognition) {
      const recognition = new BrowserSpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.continuous = true;
      console.log(recognition);
      recognition.start();

      var app = this;
      recognition.onresult = function(event) {
        var result = event.results[event.results.length - 1][0].transcript;
        console.log(result);
        app.updateInput(result);
      }
    }
  }

  updateInput(result) {
    this.setState({
      userInput: this.state.userInput + result
    });
  }


  handleInputChange(e) {
    this.setState({ 
      userInput: e.target.value
    });
  }

  sendResponseKeyboard(e) {
    if (e.key == 'Enter') {
      this.sendResponse();
    }
  }

  sendResponse() {
    this.props.onClick(this.state.userInput);
    this.setState({
      userInput: ''
    });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    ReactDOM.findDOMNode(this.messagesEnd).scrollIntoView(
      {block: 'end', behavior: 'smooth'});
  }

  render() {
    var messages = this.props.value.map(function(message) {
      if (message.user === 'npc') {
        return (<div key={message.id} className="message npc-text annotate">{message.text}</div>);
      } else {
        return (<div key={message.id} className="message user-text">{message.text}</div>)
      }
    });
    return (
      <div>
        <div className="messageWindow">
          {messages}
          <div ref={(el) => { this.messagesEnd = el; }}></div>
        </div>
        <form className="input-group input-group-lg" action="#">
          <FormControl className="message-input" value={this.state.userInput} type="text" onKeyPress={this.sendResponseKeyboard.bind(this)} onChange={this.handleInputChange.bind(this)}></FormControl>
          <Button href="#" className="btn input-group-addon" type="submit" onClick={this.sendResponse}>Send</Button>
        </form>
      </div>
    )
  }
}

class SuggestionBox extends Component {
  constructor() {
    super();
    this.state = {
      show_translation: false
    };
  }

  componentDidUpdate() {
    const mandarinspot = window.mandarinspot;
    mandarinspot.annotate(".annotate-trans");
  }

  showTranslation() {
    if (!this.state.show_translation) {
      this.setState({
        show_translation: true
      });
    } else {
      this.setState({
        show_translation: false
      });
    }
  }

  render() {
    var trySayingMessage = this.props.value[this.props.textCount].text_base;
    var translation = this.props.value[this.props.textCount].text;
    return (
      <div>
        <div className="small-text">Try saying:</div>
        <div>{trySayingMessage}</div>
        <div className="small-text" onClick={this.showTranslation.bind(this)}><a href="#">Show Translation</a></div>
        {this.state.show_translation ? <div className="annotate-trans">{translation}</div> : null }
      </div>)
  }
}

export default App;
