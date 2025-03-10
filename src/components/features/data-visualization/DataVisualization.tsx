import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function DataVisualization() {
  const [data, setData] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chartType, setChartType] = useState('line');

  // 解析输入数据
  const parseData = () => {
    try {
      let parsedData;
      // 尝试解析JSON
      if (inputText.trim().startsWith('[')) {
        parsedData = JSON.parse(inputText);
      } else {
        // 尝试解析CSV
        parsedData = inputText
          .trim()
          .split('\n')
          .map(line => {
            const [name, value] = line.split(',');
            return { name: name.trim(), value: parseFloat(value.trim()) };
          });
      }
      setData(parsedData);
    } catch (error) {
      alert('数据格式错误，请检查输入');
    }
  };

  // 渲染不同类型的图表
  const renderChart = () => {
    const ChartComponents = {
      line: (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      ),
      bar: (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      ),
      pie: (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {
              data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={[
                    '#FF6B6B', // 红色
                    '#4ECDC4', // 青色
                    '#45B7D1', // 蓝色
                    '#96CEB4', // 绿色
                    '#FFEEAD', // 黄色
                    '#D4A5A5', // 粉色
                    '#9B59B6', // 紫色
                    '#3498DB', // 深蓝
                    '#2ECC71', // 深绿
                    '#F1C40F'  // 金色
                  ][index % 10]}
                />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ),
      area: (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      ),
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        {ChartComponents[chartType as keyof typeof ChartComponents]}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">数据可视化工具</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <select
              className="w-full p-2 border rounded-md bg-white"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">折线图</option>
              <option value="bar">柱状图</option>
              <option value="pie">饼图</option>
              <option value="area">面积图</option>
            </select>

            <textarea
              className="w-full p-2 border rounded-md h-[200px]"
              placeholder={`输入数据 (JSON 数组或 CSV 格式)
示例 JSON: [{"name": "A", "value": 10}, {"name": "B", "value": 20}]
示例 CSV:
A, 10
B, 20`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <button
              onClick={parseData}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              生成图表
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg min-h-[400px]">
            {data.length > 0 ? renderChart() : (
              <div className="h-full flex items-center justify-center text-gray-500">
                请输入数据并点击生成图表
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
