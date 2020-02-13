import React from 'react';
import CanvasDraw from "react-canvas-draw";
import './App.css';
import { Menu, Icon, Divider, Popover, Slider } from 'antd';
import { SketchPicker } from 'react-color';

import share from './assets/share.png';
import donate from './assets/donate.png';

import fullscreen from './assets/fullscreen.png';
import pencil from './assets/pencil.png';
import remove from './assets/remove.png';
import save from './assets/export.png';
import undo from './assets/undo.png';
import font from './assets/font.png';
import color from './assets/color.png';
import history from './assets/history.png';


class OptionPanel extends React.Component {

  state = {
    isFullScreen: false,
    current: 'mail',
    background: '#fff',

  }

  componentDidMount() {
    this.watchFullScreen()
  }

  preventDefault = e => {
    e.preventDefault();
  }

  fullScreen = () => {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
    } else {
      this.exitFullscreen();
    }
  };

  //进入全屏
  requestFullScreen = () => {
    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
    this.setState({
      isFullScreen: true
    })
  };

  //退出全屏
  exitFullscreen = () => {
    var de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
    this.setState({
      isFullScreen: false
    })
  };

  //监听fullscreenchange事件
  watchFullScreen = () => {
    const _self = this;
    document.addEventListener(
      "webkitfullscreenchange",
      function () {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen
        });
      },
      false
    );
  };

  handleClick = e => {
    switch (e.key) {
      case 'edit': {
        break;
      }
      case 'undo': {
        this.props.undo();
        break;
      }
      case 'clear': {
        this.props.clear();

        break;
      }
      case 'save': {
        this.props.save();

        break;
      }
      case 'fullscreen': {
        if (this.state.isFullScreen) {
          this.exitFullscreen();
        }
        else {
          this.fullScreen();
        }
        break;
      }
      default: {

      }
    }
  };

  handleChangeComplete = (color) => {
    this.props.colorChange(color.hex);
  };

  render() {
    const colorContent = (
      <SketchPicker
        color={this.state.background}
        onChangeComplete={this.handleChangeComplete}
      />
    );

    const progressBar = (
      <div style={{ width: '200px' }}>
        <Slider defaultValue={0} min={0} max={5} step={0.1} tooltipVisible onChange={this.props.fontChange} />
      </div>
    );

    return <div
      className="option_panel">
      <div className="pad_menus">
        <Menu onClick={this.handleClick} mode="horizontal" subMenuKey={[this.state.current]}>
          <Menu.Item key="edit">
            <img src={pencil} className='menu_icon' alt='' />
          </Menu.Item>
          <Menu.Item key="color">
            <Popover content={colorContent} title={null} trigger="click">
              <img src={color} className='menu_icon' alt='' />
            </Popover>
          </Menu.Item>
          <Menu.Item key="size">
            <Popover content={progressBar} title={null} trigger="click">
              <img src={font} className='menu_icon' alt='' />
            </Popover>
          </Menu.Item>
          <Menu.Item key="undo">
            <img src={undo} className='menu_icon' alt='' />
          </Menu.Item>
          <Menu.Item key="clear">
            <img src={remove} className='menu_icon' alt='' />
          </Menu.Item>
          <Menu.Item key="save">
            <img src={save} className='menu_icon' alt='' />
          </Menu.Item>

          <Menu.Item key="history">
            <img src={history} className='menu_icon' alt='' />
          </Menu.Item>


          <Menu.Item key="fullscreen">
            {this.state.isFullScreen ? (<Icon type={'fullscreen-exit'} />) : <img src={fullscreen} className='menu_icon' alt='' />}
          </Menu.Item>

          <Divider type="vertical" />

          <Menu.Item key="share">
            <img src={share} className='menu_icon' alt='' />
          </Menu.Item>

          <Menu.Item key="donate">
            <img src={donate} className='menu_icon' alt='' />
          </Menu.Item>
        </Menu>
      </div>

    </div>
  }
}

class App extends React.Component {
  state = {
    color: "#cc2636",
    width: 400,
    height: 400,
    brushRadius: 1,
    lazyRadius: 0,
  };

  componentDidMount() {
    this.screenChange();
    this.resize();
  }

  resize() {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }

  screenChange() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  undo = () => {
    this.saveableCanvas.undo();
  }

  saveFile = (data, filename) => {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
  };

  exportToPic = (dataUrl) => {
    this.saveFile(dataUrl.replace("image/jpeg", "image/octet-stream"), new Date().getTime() + ".jpeg");
  }

  save = () => {
    let dataUrl = this.saveableCanvas.canvas.drawing.toDataURL('image/png');
    this.exportToPic(dataUrl);
  }

  clear = () => {
    this.saveableCanvas.clear();
  }

  onChange = e => {
    console.log('onChange', e);
  }

  colorChange = color => {
    this.setState({
      color
    })
  }

  fontChange = size => {
    console.log('size: ', size);
    this.setState({
      brushRadius: size
    })
  }

  render() {
    return (
      <div className='main_box'>
        <OptionPanel
          colorChange={this.colorChange}
          fontChange={this.fontChange}
          save={this.save}
          clear={this.clear}
          undo={this.undo} />
        <CanvasDraw
          ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
          onChange={this.onChange}
          brushColor={this.state.color}
          brushRadius={this.state.brushRadius}
          lazyRadius={this.state.lazyRadius}
          canvasWidth={this.state.width}
          canvasHeight={this.state.height}
          hideInterface
        />
      </div>
    );
  }
}
export default App;
