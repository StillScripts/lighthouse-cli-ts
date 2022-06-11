#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = require("commander");
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var utils_1 = require("./utils");
var lighthouse = require.resolve("lighthouse/lighthouse-cli");
// For simplicity, we use require here because lighthouse doesn't provide type declaration.
var computeMedianRun = require("lighthouse/lighthouse-core/lib/median-run.js").computeMedianRun;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var program, url, options, results, i, _a, status_1, stdout, median, primaryMatrices;
        return __generator(this, function (_b) {
            program = new commander_1.Command();
            program
                .argument("<url>", "Lighthouse will run the analysis on the URL.")
                .option("-i, --iteration <type>", "How many times Lighthouse should run the analysis per URL", "5")
                .parse();
            url = program.args[0];
            options = program.opts();
            console.log("\uD83D\uDDFC Running Lighthouse for ".concat(url, ". It will take a while, please wait..."));
            results = [];
            for (i = 0; i < options.iteration; i++) {
                _a = cross_spawn_1.default.sync(process.execPath, [
                    lighthouse,
                    url,
                    "--output=json",
                    "--chromeFlags=--headless",
                    "--only-categories=performance",
                ]), status_1 = _a.status, stdout = _a.stdout;
                if (status_1 !== 0) {
                    continue;
                }
                results.push(JSON.parse(stdout.toString()));
            }
            median = computeMedianRun(results);
            console.log("\n".concat(chalk_1.default.green("✔"), " Report is ready for ").concat(median.finalUrl));
            console.log("\uD83D\uDDFC Median performance score: ".concat((0, utils_1.draw)(median.categories.performance.score, median.categories.performance.score * 100)));
            primaryMatrices = [
                "first-contentful-paint",
                "interactive",
                "speed-index",
                "total-blocking-time",
                "largest-contentful-paint",
                "cumulative-layout-shift",
            ];
            primaryMatrices.map(function (matrix) {
                var _a = median.audits[matrix], title = _a.title, displayValue = _a.displayValue, score = _a.score;
                console.log("\uD83D\uDDFC Median ".concat(title, ": ").concat((0, utils_1.draw)(score, displayValue)));
            });
            return [2 /*return*/];
        });
    });
}
run();
