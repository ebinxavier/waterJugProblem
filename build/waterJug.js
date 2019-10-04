"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function calculate() {
  var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  var B = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var O = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  return new Promise(function (resolve, reject) {
    A = Number(document.getElementById('jugA').value);
    B = Number(document.getElementById('jugB').value);
    O = Number(document.getElementById('output').value);
    var pastStates = [];

    var checkPastState = function checkPastState(a, b) {
      var obj = JSON.stringify({
        a: a,
        b: b
      });
      var status = pastStates.some(function (e) {
        return e == obj;
      });
      return status;
    };

    var setPastState = function setPastState(a, b) {
      pastStates.push(JSON.stringify({
        a: a,
        b: b
      }));
    };

    var cycles = Number(document.getElementById('cycles').value);
    console.log(A, B, O, cycles);
    var Q = [{
      a: 0,
      b: 0,
      dir: 2
    }, {
      a: 0,
      b: 0,
      dir: 3
    }];
    var result;

    var pour = function pour(_ref) {
      var a = _ref.a,
          b = _ref.b,
          _ref$dir = _ref.dir,
          dir = _ref$dir === void 0 ? 0 : _ref$dir,
          _ref$trace = _ref.trace,
          trace = _ref$trace === void 0 ? [] : _ref$trace;
      //dir
      // 0 = A=>B
      // 1 = B=>A
      // 2 = A=FILL
      // 3 = B=FILL
      // 4 = A=EMPTY
      // 5 = B=EMPTY
      var traceElement = '';

      switch (dir) {
        case 0:
          if (b < B && a > 0) {
            b = b + a;

            if (b > B) {
              var reminder = b - B;
              b = B;
              a = reminder;
            } else {
              a = 0;
            }
          } else return false;

          traceElement = 'Pour A to B';
          break;

        case 1:
          if (a < A && b > 0) {
            a = b + a;

            if (a > A) {
              var _reminder = a - A;

              a = A;
              b = _reminder;
            } else {
              b = 0;
            }
          } else return false;

          traceElement = 'Pour B to A';
          break;

        case 2:
          if (a == A) return false;
          a = A;
          traceElement = 'Make A Full';
          break;

        case 3:
          if (b == B) return false;
          b = B;
          traceElement = 'Make B full';
          break;

        case 4:
          if (a == 0) return false;
          a = 0;
          traceElement = 'Empty A';
          break;

        case 5:
          if (b == 0) return false;
          b = 0;
          traceElement = 'Empty B';
          break;
      }

      trace.push(traceElement + (";" + a + ";" + b));

      if (a == O || b == O) {
        result = {
          jug: a == O ? 'A' : 'B',
          trace: trace
        };
        return true;
      } else {
        return {
          a: a,
          b: b,
          dir: dir,
          trace: _toConsumableArray(trace)
        };
      }
    };

    do {
      var firstElement = JSON.parse(JSON.stringify(Q.splice(0, 1)));
      var newState = pour(firstElement[0]);

      if (newState === true) {
        break;
      }

      if (newState) {
        if (checkPastState(newState.a, newState.b)) {
          continue;
        } else {
          setPastState(newState.a, newState.b);
        }

        var trace = _toConsumableArray(newState.trace);

        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 0
        }));
        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 1
        }));
        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 2
        }));
        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 3
        }));
        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 4
        }));
        Q.push(_objectSpread({}, newState, {
          trace: trace,
          dir: 5
        }));
      }
    } while (Q.length && Q.length < cycles);

    if (result) {
      resolve(result);
    } else {
      alert("Taking Too much of Queue memory! Consider changing allowed queue size");
      reject(false);
    }
  });
}

var submit = function submit() {
  var oldTime = new Date();
  document.getElementById('progress').style.visibility = "visible";
  document.getElementById('result').style.display = "none";
  setTimeout(function () {
    calculate().then(function (value) {
      if (value) {
        var rows = value.trace.map(function (e, i) {
          var items = e.split(';');
          return "<tr>\n            <th scope=\"row\">".concat(i + 1, "</th>\n            <td>").concat(items[0], "</td>\n            <td ").concat(value.jug == 'A' && i == value.trace.length - 1 ? 'class="red"' : '', ">").concat(items[1], "</td>\n            <td ").concat(value.jug == 'B' && i == value.trace.length - 1 ? 'class="red"' : '', ">").concat(items[2], "</td>\n          </tr>");
        });
        document.getElementById('result').style.display = "block";
        document.getElementById('resultJug').innerHTML = "Got result in " + value.jug + ' after ' + value.trace.length + ' steps';
        document.getElementById('trace').innerHTML = "<table class=\"table\">\n        <thead>\n          <tr>\n            <th scope=\"col\">Step</th>\n            <th scope=\"col\">Action</th>\n            <th scope=\"col\">Jug A (".concat(document.getElementById('jugA').value, ")</th>\n            <th scope=\"col\">Jug B (").concat(document.getElementById('jugB').value, ")</th>\n          </tr>\n        </thead>\n        <tbody>\n       ").concat(rows.join(''), "\n        </tbody>\n      </table>");
      }

      document.getElementById('progress').style.visibility = "hidden";
      var currentTime = new Date();
      var diff = currentTime.getTime() - oldTime.getTime();
      console.log("Time: ", diff, "value:", value);
    })["catch"](function () {
      document.getElementById('progress').style.visibility = "hidden";
    });
  }, 100);
};