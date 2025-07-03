import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
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
  const chartRef = useRef<HTMLDivElement>(null);

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

  // 编辑数据
  const editData = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
    setInputText(JSON.stringify(newData, null, 2));
  };

  // 删除数据点
  const deleteDataPoint = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    setInputText(JSON.stringify(newData, null, 2));
  };

  // 添加数据点
  const addDataPoint = () => {
    const newData = [...data, { name: `数据点 ${data.length + 1}`, value: 0 }];
    setData(newData);
    setInputText(JSON.stringify(newData, null, 2));
  };

  // 导入数据
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          setData(parsedData);
          setInputText(content);
        } catch (error) {
          alert('文件格式错误，请确保是有效的JSON格式');
        }
      };
      reader.readAsText(file);
    }
  };

  // 导出数据
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart-data-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
        <PieChart data={data}>
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
        <ScatterChart data={data}>
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
          data={data}
          cx="50%" 
          cy="50%" 
          innerRadius="10%" 
          outerRadius="80%" 
          barSize={10} 
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff' }}
            background
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

  // 导出图表
  const exportChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        
        const link = document.createElement('a');
        link.download = `chart-${chartType}-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('导出图表失败:', error);
        alert('导出图表失败，请重试');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">数据可视化工具</h2>
          {data.length > 0 && (
            <button
              onClick={exportChart}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              导出图表
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">图表配置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图表类型</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数据模板</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(dataTemplates).map((template) => (
                      <button
                        key={template}
                        onClick={() => loadTemplate(template as keyof typeof dataTemplates)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">数据管理</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <label className="flex-1">
                    <span className="sr-only">导入数据</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </label>
                  <button
                    onClick={addDataPoint}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    添加数据点
                  </button>
                </div>

                <div className="space-y-2">
                  {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-md border">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => editData(index, 'name', e.target.value)}
                        className="flex-1 p-1 border rounded"
                        placeholder="名称"
                      />
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => editData(index, 'value', parseFloat(e.target.value))}
                        className="w-24 p-1 border rounded"
                        placeholder="数值"
                      />
                      <button
                        onClick={() => deleteDataPoint(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <textarea
                  className="w-full p-3 border rounded-md h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
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
                  className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  生成图表
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">图表预览</h3>
            <div className="flex-1" ref={chartRef}>
              {data.length > 0 ? (
                <div className="h-full">
                  {renderChart()}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>请输入数据并点击生成图表</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
