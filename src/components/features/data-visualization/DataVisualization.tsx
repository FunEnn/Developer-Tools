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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';

export default function DataVisualization() {
  const [data, setData] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chartType, setChartType] = useState('line');

  // 添加数据模板
  const dataTemplates = {
    销售数据: [
      { name: '一月', value: 4000 },
      { name: '二月', value: 3000 },
      { name: '三月', value: 2000 },
      { name: '四月', value: 2780 },
      { name: '五月', value: 1890 },
      { name: '六月', value: 2390 },
    ],
    人口分布: [
      { name: '0-18岁', value: 2400 },
      { name: '19-35岁', value: 4567 },
      { name: '36-50岁', value: 1398 },
      { name: '51-65岁', value: 9800 },
      { name: '65岁以上', value: 3908 },
    ],
    技能评估: [
      { name: '编程', value: 80 },
      { name: '设计', value: 70 },
      { name: '沟通', value: 90 },
      { name: '团队协作', value: 85 },
      { name: '问题解决', value: 75 },
    ]
  };

  // 加载模板数据
  const loadTemplate = (templateName: keyof typeof dataTemplates) => {
    const templateData = dataTemplates[templateName];
    setData(templateData);
    setInputText(JSON.stringify(templateData, null, 2));
  };

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

  // 渲染图表
  const renderChart = () => {
    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
                   '#D4A5A5', '#9B59B6', '#3498DB', '#2ECC71', '#F1C40F'];

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
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ),
      radar: (
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      ),
      scatter: (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" type="category" />
          <YAxis dataKey="value" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="数据点" data={data} fill="#8884d8" />
        </ScatterChart>
      ),
      radialBar: (
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="10%" 
          outerRadius="80%" 
          barSize={10} 
          data={data}
        >
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            clockWise
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </RadialBar>
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
          <Tooltip />
        </RadialBarChart>
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
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded-md bg-white"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="line">折线图</option>
                <option value="bar">柱状图</option>
                <option value="pie">饼图</option>
                <option value="radar">雷达图</option>
                <option value="scatter">散点图</option>
                <option value="radialBar">玫瑰图</option>
              </select>
            </div>

            <div className="flex gap-2">
              {Object.keys(dataTemplates).map((template) => (
                <button
                  key={template}
                  onClick={() => loadTemplate(template as keyof typeof dataTemplates)}
                  className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                >
                  {template}
                </button>
              ))}
            </div>

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
