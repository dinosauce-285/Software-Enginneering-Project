
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { CustomDateInput, ChevronDownIcon, CalendarIcon, PrevIcon, NextIcon } from '../../components/Search';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../../components/datePicker.css';

export default function EmotionReport() {
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return (
        <AppLayout>
            <div className="w-full bg-white p-6">
                {/* Title */}
                <h2 className="text-2xl font-semibold mb-4">Emotion Report</h2>

                {/* Filter buttons */}
                <div className="flex items-center space-x-2 mb-4">
                    <button className="px-3 py-1 rounded-md bg-gray-200 font-medium">
                        Past month
                    </button>
                    <button className="px-3 py-1 rounded-md hover:bg-gray-100">
                        Past week
                    </button>

                    {/* Custom Range */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCustomRange(!showCustomRange)}
                            className="px-3 py-1 border rounded-md flex items-center space-x-1"
                        >
                            <span>Custom Range</span>
                            <ChevronDownIcon />
                        </button>

                        {showCustomRange && (
                            <div className="absolute z-10 mt-2 bg-white border rounded-md shadow p-4 space-y-2 w-[400px]">
                                <div className="flex space-x-2">
                                    {/* From Date */}
                                    <div className="flex-1">
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={(date) => setFromDate(date)}
                                            selectsStart
                                            startDate={fromDate}
                                            endDate={toDate}
                                            dateFormat="dd/MM/yyyy"
                                            isClearable
                                            customInput={<CustomDateInput placeholder="From" />}
                                            popperClassName="new-datepicker-theme-popper"
                                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                                <div className="new-datepicker-theme">
                                                    <div className="datepicker-header">
                                                        <button onClick={decreaseMonth} type="button" className="datepicker-nav-button">
                                                            <PrevIcon />
                                                        </button>
                                                        <div className="datepicker-select-wrapper">
                                                            <select
                                                                value={months[getMonth(date)]}
                                                                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                                className="datepicker-select"
                                                            >
                                                                {months.map(option => (
                                                                    <option key={option} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                value={getYear(date)}
                                                                onChange={({ target: { value } }) => changeYear(Number(value))}
                                                                className="datepicker-select"
                                                            >
                                                                {years.map(option => (
                                                                    <option key={option} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <button onClick={increaseMonth} type="button" className="datepicker-nav-button">
                                                            <NextIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>

                                    {/* To Date */}
                                    <div className="flex-1">
                                        <DatePicker
                                            selected={toDate}
                                            onChange={(date) => setToDate(date)}
                                            selectsEnd
                                            startDate={fromDate}
                                            endDate={toDate}
                                            minDate={fromDate}
                                            dateFormat="dd/MM/yyyy"
                                            isClearable
                                            customInput={<CustomDateInput placeholder="To" />}
                                            popperClassName="new-datepicker-theme-popper"
                                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                                <div className="new-datepicker-theme">
                                                    <div className="datepicker-header">
                                                        <button onClick={decreaseMonth} type="button" className="datepicker-nav-button">
                                                            <PrevIcon />
                                                        </button>
                                                        <div className="datepicker-select-wrapper">
                                                            <select
                                                                value={months[getMonth(date)]}
                                                                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                                className="datepicker-select"
                                                            >
                                                                {months.map(option => (
                                                                    <option key={option} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                value={getYear(date)}
                                                                onChange={({ target: { value } }) => changeYear(Number(value))}
                                                                className="datepicker-select"
                                                            >
                                                                {years.map(option => (
                                                                    <option key={option} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <button onClick={increaseMonth} type="button" className="datepicker-nav-button">
                                                            <NextIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie chart + legend center aligned */}
                <div className="flex flex-col md:flex-row items-center justify-center mt-8">
                    {/* Pie chart */}
                    <div className="w-80 h-80 bg-gray-100 rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-12">
                        <span className="text-gray-500">Pie Chart (Past month)</span>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {["Happy", "Sad", "Angry", "Nostalgic", "Loved", "Tired"].map((emotion, index) => (
                            <div key={index} className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${[
                                    "bg-yellow-400", "bg-blue-400", "bg-red-400",
                                    "bg-amber-400", "bg-pink-400", "bg-purple-400"
                                ][index]}`}></span>
                                {emotion}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-auto flex justify-center">
                    <p >
                        You've spent most of your week in a happy place — keep nurturing that joy 🌱.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
