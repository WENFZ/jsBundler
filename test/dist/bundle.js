(function(modules) {
          // here variable modules is a global repository for modules
          function globalRequire(id) {
            const [fn, subDep] = modules[id];
            function localRequire(name) {
              return globalRequire(subDep[name]);
            }
            const module = { exports : {} };
            fn(localRequire, module, module.exports);
            return module.exports;
          }
          globalRequire('0');
        })({
            '0':[function (require,module,exports) {
                "use strict";

var _sentence = _interopRequireDefault(require("./sentence.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_sentence["default"]);
            },{"./sentence.js":"1"}],
          
            '1':[function (require,module,exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _world = _interopRequireDefault(require("./world.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = "hello ".concat(_world["default"]);

exports["default"] = _default;
            },{"./world.js":"2"}],
          
            '2':[function (require,module,exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = 'world';
exports["default"] = _default;
            },{}],
          })