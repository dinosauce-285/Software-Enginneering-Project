import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronDown } from "react-icons/fi";

export default function DateRangeFilter() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <div className="mb-6 relative w-fit">
            <div
                className="bg-gray-200 rounded-full shadow-sm px-4 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
            >
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-350">Date range</span>
                    <span className="text-orange-500">
                        {selectedDate ? selectedDate.toLocaleDateString() : "Anytime"}
                    </span>
                    <FiChevronDown className="text-orange-500" />
                </div>
            </div>

            {/* Lịch hiển thị khi click */}
            {showCalendar && (
                <div className="absolute z-50 mt-2">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setShowCalendar(false); // tự ẩn sau chọn
                        }}
                        inline
                        calendarClassName="!rounded-xl !border !shadow"
                    />
                </div>
            )}
        </div>
    );
}
