import React, { useMemo, useState, useRef, useEffect } from 'react';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

function WheelColumn({ values, onSelect, initialValue }) {
    const ITEM_HEIGHT = 40;
    const wheelRef = useRef(null);

    const initialIndex = values.indexOf(initialValue);

    useEffect(() => {
        if (wheelRef.current && initialIndex > -1) {
            wheelRef.current.scrollTop = initialIndex * ITEM_HEIGHT;
        }
    }, [initialIndex, ITEM_HEIGHT, values]);

    const handleScroll = useMemo(
        () =>
            debounce((e) => {
                const scrollTop = e.target.scrollTop;
                const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
                const selectedValue = values[selectedIndex];

                e.target.scrollTop = selectedIndex * ITEM_HEIGHT;
                
                if (selectedValue !== undefined) {
                    onSelect(selectedValue);
                }
            }, 150),
        [onSelect, values, ITEM_HEIGHT]
    );

    return (
        <div
            ref={wheelRef}
            onScroll={handleScroll}
            className="h-48 w-20 overflow-y-scroll scroll-smooth snap-y snap-mandatory no-scrollbar"
            style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
            }}
        >
            <div className="h-full relative" style={{ height: `${values.length * ITEM_HEIGHT}px` }}>
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }}></div>
                {values.map((value, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center text-2xl font-semibold text-gray-800 dark:text-gray-200 snap-center"
                        style={{ height: `${ITEM_HEIGHT}px` }}
                    >
                        {String(value).padStart(2, '0')}
                    </div>
                ))}
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }}></div>
            </div>
        </div>
    );
}

export default function TimeWheelPicker({ initialTime = "09:00", onTimeChange }) {
    const [hour, setHour] = useState(parseInt(initialTime.split(':')[0], 10));
    const [minute, setMinute] = useState(parseInt(initialTime.split(':')[1], 10));

    useEffect(() => {
        onTimeChange({ hour, minute });
    }, [hour, minute, onTimeChange]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className="relative flex justify-center items-center bg-gray-100/50 dark:bg-gray-900/60 p-4 rounded-xl">
            <div className="absolute inset-x-4 h-10 top-1/2 -translate-y-1/2 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg  dark:border-blue-400 pointer-events-none"></div>

            <WheelColumn values={hours} onSelect={setHour} initialValue={hour} />
            <span className="text-4xl font-bold text-gray-700 dark:text-gray-300 pb-2">:</span>
            <WheelColumn values={minutes} onSelect={setMinute} initialValue={minute} />
        </div>
    );
}