"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// Global to be (re)set before each rendering
var ongoingPromises;
var counter = 0;
function usePromise(p, deps) {
    if (deps === void 0) { deps = []; }
    if (typeof window !== 'undefined') {
        // Client / browser implementation
        var preloadedState = window.__USE_PROMISE_PRELOADED_STATE__;
        var preloadedDataForPromise_1 = preloadedState.shift();
        var _a = react_1.useState(preloadedDataForPromise_1 || [false, undefined, undefined]), state = _a[0], setState_1 = _a[1];
        react_1.useEffect(function () {
            if (preloadedDataForPromise_1) {
                return;
            }
            else {
                p()
                    .then(function (r) { return setState_1([true, r, undefined]); })
                    .catch(function (e) { return setState_1([true, undefined, e]); });
            }
        }, deps);
        return state;
    }
    else {
        // SSR implementation
        if (!ongoingPromises) {
            throw new Error("\"completedPromises\" not set before entering \"usePromise\"");
        }
        var currentIndex = counter;
        counter++;
        if (!ongoingPromises[currentIndex]) {
            throw p();
        }
        if (ongoingPromises[currentIndex][0] == false) {
            throw new Error('Unexpected state, expected promise to be done');
        }
        return ongoingPromises[currentIndex];
    }
}
exports.usePromise = usePromise;
function renderUntilPromisesAreResolved(f) {
    return __awaiter(this, void 0, void 0, function () {
        var rendered, renderAttempts, _ongoingPromises, renderError_1, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rendered = '';
                    renderAttempts = 0;
                    _ongoingPromises = [];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 11];
                    if (renderAttempts > 10) {
                        throw new Error('Rendering still not finished after 10 renders.');
                    }
                    renderAttempts++;
                    counter = 0;
                    ongoingPromises = _ongoingPromises;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 3, 9, 10]);
                    ongoingPromises = _ongoingPromises;
                    rendered = f();
                    return [3 /*break*/, 11];
                case 3:
                    renderError_1 = _a.sent();
                    ongoingPromises = undefined; // reset before await of Promise
                    if (!(renderError_1 instanceof Promise)) return [3 /*break*/, 8];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, renderError_1];
                case 5:
                    result = _a.sent();
                    _ongoingPromises.push([true, result, null]);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    _ongoingPromises.push([true, null, e_1]);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 1];
                case 8: throw renderError_1;
                case 9:
                    ongoingPromises = undefined;
                    return [7 /*endfinally*/];
                case 10: return [3 /*break*/, 1];
                case 11: return [2 /*return*/, [rendered, _ongoingPromises]];
            }
        });
    });
}
exports.renderUntilPromisesAreResolved = renderUntilPromisesAreResolved;