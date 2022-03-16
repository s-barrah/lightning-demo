/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils } from '@lightningjs/sdk'

import Splash from './Splash.js'
import Main from './Main.js'
import Game from './Game.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      Logo: {
        x: 100,
        y: 100,
        text: { text: 'TicTacToe', fontFace: 'Regular' },
      },
      rect: true,
      color: 0xff000000,
      w: window.innerWidth,
      h: window.innerHeight,
      Splash: {
        type: Splash,
        signals: { loaded: true },
        alpha: 0,
      },
      Main: {
        type: Main,
        alpha: 0,
        signals: { select: 'menuSelect' },
      },
      Game: {
        type: Game,
        alpha: 0,
      },
    }
  }

  _setup() {
    this._setState('Splash')
  }

  static _states() {
    return [
      class Splash extends this {
        $enter() {
          this.tag('Splash').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Splash').setSmooth('alpha', 0)
        }
        // because we have defined 'loaded'
        loaded() {
          this._setState('Main')
        }
      },
      class Main extends this {
        $enter() {
          this.tag('Main').patch({
            smooth: { alpha: 1, y: 0 },
          })
        }
        $exit() {
          this.tag('Main').patch({
            smooth: { alpha: 0, y: 100 },
          })
        }

        menuSelect({ item }) {
          console.log('MENU SELECT ---- ITEM: ', item)
          if (this._hasMethod(item.action)) {
            return this[item.action]()
          }
        }

        start() {
          this._setState('Game')
        }

        // change focus path to main
        // component which handles the remotecontrol
        _getFocused() {
          return this.tag('Main')
        }
      },
      class Game extends this {
        $enter() {
          this.tag('Game').setSmooth('alpha', 1)
        }

        $exit() {
          this.tag('Game').setSmooth('alpha', 0)
        }

        _getFocused() {
          return this.tag('Game')
        }
      },
    ]
  }
}
