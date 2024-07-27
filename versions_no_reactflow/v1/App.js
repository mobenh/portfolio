import React, { useMemo } from 'react';
import './App.css';

const NodeDiagram = ({ content, width = 1200, height = 1000, xMid = 600, yScale = 100 }) => {
    const generatePositions = useMemo(() => {
        const keys = Object.keys(content);
        const positions = [
            { key: keys[0], x: xMid, y: 0 },            // Languages
            { key: keys[1], x: xMid - 300, y: yScale },       // Projects
            { key: keys[2], x: xMid - 150, y: yScale * 2 },   // Frameworks
            { key: keys[3], x: xMid + 150, y: yScale * 2 },   // Infrastructure
            { key: keys[4], x: xMid + 300, y: yScale * 3 },   // Certifications
            { key: keys[5], x: xMid + 150, y: yScale * 4 },   // Contact
            { key: keys[6], x: xMid - 150, y: yScale * 4 },   // Add1
            { key: keys[7], x: xMid - 300, y: yScale * 5 },   // Add2
            { key: keys[8], x: xMid - 150, y: yScale * 6 },   // Add3
            { key: keys[9], x: xMid + 150, y: yScale * 6 },   // Add4
            { key: keys[10], x: xMid + 300, y: yScale * 7 },   // Add5
            { key: keys[11], x: xMid, y: yScale * 8 },   // Add6
        ];
        return positions;
    }, [content, xMid, yScale]);

    const lines = useMemo(() => {
        return generatePositions.slice(0, -1).map((pos, index) => {
            const nextPos = generatePositions[index + 1];
            return <line key={index} x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y} stroke="#ccc" strokeWidth="2" />
        });
    }, [generatePositions]);

    return (
        <svg width={width} height={height}>
            {lines}
            {generatePositions.map(({ key, x, y }) => (
                <g key={key}>
                    <circle cx={x} cy={y} r="30" fill="#4CAF50" />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill="white" fontSize="14">
                        {key.slice(0, 3)}
                    </text>
                    <text x={x} y={y + 50} textAnchor="middle" fill="black" fontSize="14">
                        {key}
                    </text>
                </g>
            ))}
        </svg>
    );
};

const App = () => {
    const content = {
        languages: [],
        projects: [],
        frameworks: [],
        infrastructure: [],
        certifications: [],
        contact: [],
        Add1: [],
        Add2: [],
        Add3: [],
        Add4: [],
        Add5: [],
        Add6: []
    };

    return (
        <div className="App">
            <h1>Node Diagram</h1>
            <NodeDiagram content={content} />
        </div>
    );
};

export default App;
