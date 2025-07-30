import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { CustomDateInput, ChevronDownIcon, PrevIcon, NextIcon } from '../../components/Search'; // Giả sử các icon này được export từ Search.jsx
import DatePicker from 'react-datepicker';
import { getYear, getMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../../components/datePicker.css'; // File CSS tùy chỉnh của bạn cho DatePicker

// Import các thư viện cần thiết
import { getEmotionReport } from '../../services/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Component hiển thị khi đang tải dữ liệu
const LoadingState = () => (
    <div className="text-center p-10 text-gray-500">
        Generating your report, please wait...
    </div>
);

// Component hiển thị khi không có dữ liệu
const NoDataState = () => (
    <div className="text-center p-10 text-gray-500">
        No memories found for the selected period. Let's write some more!
    </div>
);


export default function EmotionReport() {
    // --- STATE MANAGEMENT ---
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
    const [toDate, setToDate] = useState(endOfMonth(new Date()));
    const [activeFilter, setActiveFilter] = useState('month');
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIC GỌI API ---
    const handleGenerateReport = async (start, end) => {
        setError(null);
        setIsLoading(true);
        setReportData(null);
        try {
            // Đảm bảo gửi đi giờ chuẩn (bắt đầu ngày và kết thúc ngày)
            const startDate = new Date(start.setHours(0, 0, 0, 0));
            const endDate = new Date(end.setHours(23, 59, 59, 999));
            const data = await getEmotionReport(startDate.toISOString(), endDate.toISOString());
            setReportData(data);
        } catch (err) {
            setError(err.message || "Failed to generate report.");
        } finally {
            setIsLoading(false);
        }
    };

    const setDateRangeAndFetch = (start, end, filterName) => {
        setFromDate(start);
        setToDate(end);
        setActiveFilter(filterName);
        setShowCustomRange(false);
        handleGenerateReport(start, end);
    };
    
    // Tự động fetch dữ liệu cho "This month" khi component được load lần đầu
    useEffect(() => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        handleGenerateReport(start, end);
    }, []);

    // --- CHUẨN BỊ DỮ LIỆU CHO BIỂU ĐỒ ---
    const chartData = {
        labels: reportData?.emotionBreakdown.map(e => `${e.symbol} ${e.name}`) || [],
        datasets: [{
            data: reportData?.emotionBreakdown.map(e => e.count) || [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8D6E63'],
            borderWidth: 0,
        }],
    };
    const chartOptions = {
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
    };

    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <AppLayout>
            <div className="w-full bg-white p-6">
                <h2 className="text-2xl font-semibold mb-4">Emotion Report</h2>
                <div className="flex items-center space-x-2 mb-4">
                    <button onClick={() => setDateRangeAndFetch(startOfMonth(new Date()), endOfMonth(new Date()), 'month')}
                        className={`px-3 py-1 rounded-md font-medium ${activeFilter === 'month' ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        This month
                    </button>
                    <button onClick={() => setDateRangeAndFetch(startOfWeek(new Date()), endOfWeek(new Date()), 'week')}
                        className={`px-3 py-1 rounded-md font-medium ${activeFilter === 'week' ? 'bg-gray-200 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        This week
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowCustomRange(!showCustomRange)}
                            className={`px-3 py-1 border rounded-md flex items-center space-x-1 ${activeFilter === 'custom' ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}>
                            <span>Custom Range</span>
                            <ChevronDownIcon />
                        </button>
                        {showCustomRange && (
                            <div className="absolute z-10 mt-2 bg-white border rounded-md shadow p-4 space-y-2 w-[400px]">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} selectsStart startDate={fromDate} endDate={toDate} dateFormat="dd/MM/yyyy" isClearable customInput={<CustomDateInput placeholder="From" />} popperClassName="new-datepicker-theme-popper" renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (<div className="new-datepicker-theme"><div className="datepicker-header"><button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button><div className="datepicker-select-wrapper"><select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">{months.map(option => (<option key={option} value={option}>{option}</option>))}</select><select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="datepicker-select">{years.map(option => (<option key={option} value={option}>{option}</option>))}</select></div><button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button></div></div>)} />
                                    </div>
                                    <div className="flex-1">
                                        <DatePicker selected={toDate} onChange={(date) => setToDate(date)} selectsEnd startDate={fromDate} endDate={toDate} minDate={fromDate} dateFormat="dd/MM/yyyy" isClearable customInput={<CustomDateInput placeholder="To" />} popperClassName="new-datepicker-theme-popper" renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (<div className="new-datepicker-theme"><div className="datepicker-header"><button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button><div className="datepicker-select-wrapper"><select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">{months.map(option => (<option key={option} value={option}>{option}</option>))}</select><select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="datepicker-select">{years.map(option => (<option key={option} value={option}>{option}</option>))}</select></div><button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button></div></div>)} />
                                    </div>
                                </div>
                                <button onClick={() => setDateRangeAndFetch(fromDate, toDate, 'custom')} className="w-full mt-2 px-3 py-1 bg-gray-800 text-white rounded-md">Apply</button>
                            </div>
                        )}
                    </div>
                </div>

                {isLoading && <LoadingState />}
                {error && <div className="text-center p-4 text-red-500 bg-red-100 rounded-md">{error}</div>}
                
                {reportData && !isLoading && (
                    <>
                        {reportData.emotionBreakdown.length === 0 ? (
                            <NoDataState />
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row items-center justify-center mt-8">
                                    <div className="w-80 h-80 flex items-center justify-center mb-6 md:mb-0 md:mr-12">
                                        <Pie data={chartData} options={chartOptions} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                        {reportData.emotionBreakdown.map((e, index) => (
                                            <div key={e.emotionID} className="flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length] }}></span>
                                                {e.name} ({e.percentage}%)
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                                    <p className="text-gray-700">{reportData.summary}</p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}