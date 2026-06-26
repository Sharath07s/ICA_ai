"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CommandWallHeader from "@/components/CommandWall/CommandWallHeader";
import ThreatLevelPanel from "@/components/CommandWall/ThreatLevelPanel";
import ActiveAlertsPanel from "@/components/CommandWall/ActiveAlertsPanel";
import CrimeHotspotsPanel from "@/components/CommandWall/CrimeHotspotsPanel";
import NetworkIntelligencePanel from "@/components/CommandWall/NetworkIntelligencePanel";
import LiveCrimeMap from "@/components/CommandWall/LiveCrimeMap";
import OfficerActivityPanel from "@/components/CommandWall/OfficerActivityPanel";
import InvestigationActivityPanel from "@/components/CommandWall/InvestigationActivityPanel";
import TimelineActivityPanel from "@/components/CommandWall/TimelineActivityPanel";
import AIIntelligenceFeed from "@/components/CommandWall/AIIntelligenceFeed";
import { RealtimeProvider, useRealtime } from "@/components/Providers/RealtimeProvider";
import EventNotificationCenter from "@/components/Predictive/EventNotificationCenter";

function CommandWallContent() {
  const { lastEvent } = useRealtime();
  const [data, setData] = useState<any>({
    threatLevel: null,
    alerts: [],
    hotspots: [],
    networks: [],
    officers: null,
    investigations: null,
    timeline: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threat, alerts, hotspots, nets, officers, invs, timeline] = await Promise.all([
          fetch("http://localhost:8000/api/v1/command-wall/threat-level").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/alerts").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/hotspots").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/networks").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/officers").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/investigations").then(r => r.json()),
          fetch("http://localhost:8000/api/v1/command-wall/timeline").then(r => r.json()),
        ]);
        
        setData({
          threatLevel: threat,
          alerts,
          hotspots,
          networks: nets,
          officers,
          investigations: invs,
          timeline
        });
      } catch (err) {
        console.warn("Failed to fetch command wall data", err);
      }
    };

    fetchData();
    // Replaced interval with realtime websocket trigger
  }, []);

  useEffect(() => {
    if (lastEvent) {
      console.log("[Command Wall] Realtime Event Received:", lastEvent);
      // Fast refresh on any event
      fetch("http://localhost:8000/api/v1/command-wall/threat-level").then(r => r.json()).then(t => setData((prev: any) => ({ ...prev, threatLevel: t })));
      fetch("http://localhost:8000/api/v1/command-wall/alerts").then(r => r.json()).then(a => setData((prev: any) => ({ ...prev, alerts: a })));
      fetch("http://localhost:8000/api/v1/command-wall/hotspots").then(r => r.json()).then(h => setData((prev: any) => ({ ...prev, hotspots: h })));
    }
  }, [lastEvent]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col text-slate-200">
      <CommandWallHeader />
      
      {/* 
        The Command Wall is designed for large displays. 
        We use a highly compressed grid layout to maximize data density.
      */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-3 p-3 min-h-0">
        
        {/* Row 1: Top KPIs */}
        <div className="col-span-3 row-span-1 min-h-0">
          <ThreatLevelPanel data={data.threatLevel} />
        </div>
        <div className="col-span-3 row-span-1 min-h-0">
          <ActiveAlertsPanel alerts={data.alerts} />
        </div>
        <div className="col-span-3 row-span-1 min-h-0">
          <CrimeHotspotsPanel hotspots={data.hotspots} />
        </div>
        <div className="col-span-3 row-span-1 min-h-0">
          <NetworkIntelligencePanel networks={data.networks} />
        </div>

        {/* Rows 2-4: Map & AI Feed */}
        <div className="col-span-8 row-span-4 min-h-0">
          <LiveCrimeMap />
        </div>
        <div className="col-span-4 row-span-4 min-h-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <TimelineActivityPanel timeline={data.timeline} />
          </div>
          <div className="h-1/3 min-h-[120px]">
            <AIIntelligenceFeed />
          </div>
        </div>

        {/* Row 6: Operational Stats */}
        <div className="col-span-6 row-span-1 min-h-0">
          <OfficerActivityPanel data={data.officers} />
        </div>
        <div className="col-span-6 row-span-1 min-h-0">
          <InvestigationActivityPanel data={data.investigations} />
        </div>

      </div>
    </div>
  );
}

export default function CommandWallPage() {
  return (
    <RealtimeProvider channel="command-wall">
      <CommandWallContent />
      <EventNotificationCenter />
    </RealtimeProvider>
  );
}
