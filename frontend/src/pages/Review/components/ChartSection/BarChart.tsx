import React from "react";

interface BarChartProps {
  data: number[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels }) => {
  const maxValue = Math.max(...data, 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: "80px",
        gap: "6px",
        padding: "4px 8px",
      }}
    >
      {data.map((value, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Столбик */}
          <div
            style={{
              height: `${(value / maxValue) * 100}%`,
              background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
              borderRadius: "4px",
              transition: "height 0.3s ease, transform 0.2s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Подпись */}
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "6px",
              color: "#ccc",
              whiteSpace: "nowrap",
            }}
          >
            {labels[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
