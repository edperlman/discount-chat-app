"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChart = exports.drawDoughnutChart = exports.drawLineChart = void 0;
const i18n_1 = require("../../../utils/lib/i18n");
const lineChartConfiguration = ({ legends = false, anim = false, tooltipCallbacks = {}, }) => {
    const config = Object.assign(Object.assign({ layout: {
            padding: {
                top: 10,
                bottom: 0,
            },
        }, legend: {
            display: false,
        }, plugins: {
            tooltip: Object.assign({ usePointStyle: true, enabled: true, mode: 'point', yAlign: 'bottom', displayColors: true }, tooltipCallbacks),
        }, scales: {
            xAxis: {
                title: {
                    display: false,
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.03)',
                },
            },
            yAxis: {
                title: {
                    display: false,
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.03)',
                },
            },
        }, hover: {
            intersect: false, // duration of animations when hovering an item
            mode: 'index',
        }, responsive: true, maintainAspectRatio: false }, (!anim ? { animation: { duration: 0 } } : {})), (legends ? { legend: { display: true, labels: { boxWidth: 20, fontSize: 8 } } } : {}));
    return config;
};
const doughnutChartConfiguration = (title, tooltipCallbacks = {}) => ({
    layout: {
        padding: {
            top: 0,
            bottom: 0,
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'right',
            labels: {
                boxWidth: 20,
            },
        },
        title: {
            display: true,
            text: title,
        },
        tooltip: Object.assign({ enabled: true, mode: 'point', displayColors: true }, tooltipCallbacks),
    },
    // animation: {
    // 	duration: 0 // general animation time
    // },
    hover: {
        intersect: true, // duration of animations when hovering an item
    },
    responsive: true,
    maintainAspectRatio: false,
});
const drawLineChart = (chart_1, chartContext_1, chartLabels_1, dataLabels_1, dataSets_1, ...args_1) => __awaiter(void 0, [chart_1, chartContext_1, chartLabels_1, dataLabels_1, dataSets_1, ...args_1], void 0, function* (chart, chartContext, chartLabels, dataLabels, dataSets, options = {}) {
    if (!chart) {
        throw new Error('No chart element');
    }
    chartContext === null || chartContext === void 0 ? void 0 : chartContext.destroy();
    const colors = ['#2de0a5', '#ffd21f', '#f5455c', '#cbced1'];
    const datasets = [];
    chartLabels.forEach((chartLabel, index) => {
        datasets.push({
            label: (0, i18n_1.t)(chartLabel), // chart label
            data: dataSets[index], // data points corresponding to data labels, x-axis points
            backgroundColor: colors[index],
            borderColor: colors[index],
            borderWidth: 3,
            fill: false,
        });
    });
    const { default: Chart } = yield Promise.resolve().then(() => __importStar(require('chart.js/auto')));
    return new Chart(chart, {
        type: 'line',
        data: {
            labels: dataLabels, // data labels, y-axis points
            datasets,
        },
        options: lineChartConfiguration(options),
    });
});
exports.drawLineChart = drawLineChart;
const drawDoughnutChart = (chart, title, chartContext, dataLabels, dataPoints) => __awaiter(void 0, void 0, void 0, function* () {
    if (!chart) {
        throw new Error('No chart element');
    }
    chartContext === null || chartContext === void 0 ? void 0 : chartContext.destroy();
    const { default: Chart } = yield Promise.resolve().then(() => __importStar(require('chart.js/auto')));
    return new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: dataLabels, // data labels, y-axis points
            datasets: [
                {
                    data: dataPoints, // data points corresponding to data labels, x-axis points
                    backgroundColor: ['#2de0a5', '#cbced1', '#f5455c', '#ffd21f'],
                    borderWidth: 0,
                },
            ],
        },
        options: doughnutChartConfiguration(title),
    });
});
exports.drawDoughnutChart = drawDoughnutChart;
const updateChart = (chart, label, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (((_b = (_a = chart.data) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.indexOf(label)) === -1) {
        // insert data
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset, idx) => {
            dataset.data.push(data[idx]);
        });
    }
    else {
        // update data
        const index = (_d = (_c = chart.data) === null || _c === void 0 ? void 0 : _c.labels) === null || _d === void 0 ? void 0 : _d.indexOf(label);
        if (typeof index === 'undefined') {
            return;
        }
        chart.data.datasets.forEach((dataset, idx) => {
            dataset.data[index] = data[idx];
        });
    }
    chart.update();
});
exports.updateChart = updateChart;
