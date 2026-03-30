"use client";

import { useEffect, useRef } from "react";

export default function ElevationChart({ routeData }: { routeData: [number, number, number][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !routeData || routeData.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Padding for axes and labels
    const paddingLeft = 45;
    const paddingBottom = 30;
    const paddingTop = 20;
    const paddingRight = 10;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // 1. Calculate Distances
    const distances: number[] = [0];
    let totalDist = 0;
    for (let i = 1; i < routeData.length; i++) {
        const p1 = routeData[i - 1];
        const p2 = routeData[i];
        const dx = (p2[1] - p1[1]) * Math.cos(p1[0] * Math.PI / 180);
        const dy = (p2[0] - p1[0]);
        const dist = Math.sqrt(dx * dx + dy * dy) * 111.32; // km approx
        totalDist += dist;
        distances.push(totalDist);
    }

    // 2. Find Elevation Extents
    let minEle = Infinity;
    let maxEle = -Infinity;
    routeData.forEach(p => {
        if (p[2] < minEle) minEle = p[2];
        if (p[2] > maxEle) maxEle = p[2];
    });

    const elePadding = (maxEle - minEle) * 0.15 || 20;
    const scaleMin = Math.max(0, minEle - elePadding);
    const scaleMax = maxEle + elePadding;
    const eleRange = scaleMax - scaleMin;

    ctx.clearRect(0, 0, width, height);

    // Helpers
    const getX = (dist: number) => paddingLeft + (dist / totalDist) * chartWidth;
    const getY = (ele: number) => paddingTop + chartHeight - ((ele - scaleMin) / eleRange) * chartHeight;

    // 3. Draw Grid lines & Labels
    ctx.lineWidth = 1;
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // Horizontal grid (elevation)
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const eleValue = scaleMin + (eleRange * i / yTicks);
        const y = getY(eleValue);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText(Math.round(eleValue).toString(), paddingLeft - 8, y);
    }

    // Vertical grid (distance)
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const xTicks = 6;
    for (let i = 0; i <= xTicks; i++) {
        const distValue = totalDist * i / xTicks;
        const x = getX(distValue);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(x, paddingTop);
        ctx.lineTo(x, paddingTop + chartHeight);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText(`${distValue.toFixed(1)} km`, x, paddingTop + chartHeight + 8);
    }

    // 4. Draw Elevation Slope Paths
    for (let i = 1; i < routeData.length; i++) {
        const x1 = getX(distances[i-1]);
        const y1 = getY(routeData[i-1][2]);
        const x2 = getX(distances[i]);
        const y2 = getY(routeData[i][2]);

        const distKm = distances[i] - distances[i-1];
        const eleDiff = routeData[i][2] - routeData[i-1][2];
        const runM = distKm * 1000;
        const grade = runM > 0 ? (eleDiff / runM) * 100 : 0;

        let strokeColor = "#22c55e"; // Easy
        if (grade > 8) strokeColor = "#b4000f";
        else if (grade > 4) strokeColor = "#ef4444";
        else if (grade > 2) strokeColor = "#f59e0b";

        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = strokeColor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // 5. Fill Area Underneath
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop + chartHeight);
    for (let i = 0; i < routeData.length; i++) {
        ctx.lineTo(getX(distances[i]), getY(routeData[i][2]));
    }
    ctx.lineTo(paddingLeft + chartWidth, paddingTop + chartHeight);
    ctx.closePath();
    
    const fillGradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
    fillGradient.addColorStop(0, "rgba(180, 0, 15, 0.3)");
    fillGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // 6. Draw Axes Labels
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 8px Arial";
    ctx.fillText("WYSOKOŚĆ (m n.p.m.)", -(paddingTop + chartHeight/2), 12);
    ctx.restore();

  }, [routeData]);

  if (!routeData || routeData.length === 0) return null;

  return (
    <div className="w-full bg-[#1e1e1e] rounded-2xl border border-white/5 p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Profil Trasy LGR</span>
            <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]"></span> PŁASKO</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]"></span> PODJAZD</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#b4000f]"></span> STROMO</span>
            </div>
        </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-[180px] md:h-[240px]"
      />
    </div>
  );
}
