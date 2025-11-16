import React, { useState, useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Timer, Play, Pause, RotateCcw, Plus, Edit2, Trash2, Check, X } from "lucide-react";

// Utility formatters
const formatClock = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(
    2,
    "0"
  )}:${String(s % 60).padStart(2, "0")}`;
};

export default function SideDrawer() {
  // Drawer State
  const [open, setOpen] = useState(false);

  // Stopwatch States
  const [sw, setSw] = useState({
    running: false,
    elapsed: 0,
    lastStart: 0,
  });

  // Timers State
  const [timers, setTimers] = useState([]);
  const [newTimerName, setNewTimerName] = useState("");
  const [newTimerSeconds, setNewTimerSeconds] = useState("");

  // Live update stopwatch + timers
  useEffect(() => {
    const interval = setInterval(() => {
      setSw((p) =>
        p.running
          ? { ...p, elapsed: p.elapsed + (Date.now() - p.lastStart), lastStart: Date.now() }
          : p
      );

      setTimers((prev) =>
        prev.map((t) =>
          t.running && t.time > 0
            ? { ...t, time: t.time - 1000 }
            : t
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Stopwatch Controls
  const swStart = () =>
    setSw((p) => ({
      ...p,
      running: true,
      lastStart: Date.now(),
    }));

  const swPause = () =>
    setSw((p) => ({
      ...p,
      running: false,
    }));

  const swReset = () =>
    setSw({
      running: false,
      elapsed: 0,
      lastStart: 0,
    });

  // Add Timer
  const addTimer = () => {
    if (!newTimerName || !newTimerSeconds) return;

    setTimers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newTimerName,
        time: Number(newTimerSeconds) * 1000,
        initialTime: Number(newTimerSeconds) * 1000,
        running: false,
        edit: false,
      },
    ]);

    setNewTimerName("");
    setNewTimerSeconds("");
  };

  // Toggle timer running
  const toggleTimer = (id) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, running: !t.running } : t
      )
    );
  };

  // Reset timer
  const resetTimer = (id, sec) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, time: sec * 1000, initialTime: sec * 1000, running: false } : t
      )
    );
  };

  // Delete timer
  const deleteTimer = (id) =>
    setTimers((prev) => prev.filter((t) => t.id !== id));

  // Edit mode toggle
  const toggleEdit = (id) =>
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, edit: !t.edit } : t
      )
    );

  // Calculate progress for timer
  const getProgress = (timer) => {
    if (!timer.initialTime) return 0;
    return ((timer.initialTime - timer.time) / timer.initialTime) * 100;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button className="fixed right-4 top-4 z-50 shadow-lg hover:shadow-xl transition-shadow">
          <Clock className="w-4 h-4 mr-2" />
          Time Manager
        </Button>
      </SheetTrigger>

      {/* Right Drawer */}
      <SheetContent side="right" className="w-[380px] p-0 bg-gradient-to-b from-slate-50 to-white" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader className="px-6 py-5 border-b bg-white/80">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Time Manager
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] px-6 py-6">

          {/* Stopwatch Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-md mb-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Stopwatch</h2>
            </div>

            <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <div className="text-5xl font-bold text-center font-mono text-slate-800 tracking-tight">
                {formatClock(sw.elapsed)}
              </div>
            </div>

            <div className="flex gap-3">
              {!sw.running ? (
                <Button onClick={swStart} className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button variant="destructive" onClick={swPause} className="flex-1 shadow-sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}

              <Button variant="outline" onClick={swReset} className="px-4 shadow-sm hover:bg-slate-100">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add Timer Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-md mb-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <button onClick={addTimer} className="w-full bg-purple-600 hover:bg-purple-700 shadow-sm">
                   <Plus className="w-5 h-5 text-white"/>  
                </button>
                
              </div>
              <h2 className="text-lg font-bold text-slate-800 ">Study Burst
</h2>
            </div>

            <Input
              placeholder="Timer name"
              value={newTimerName}
              onChange={(e) => setNewTimerName(e.target.value)}
              className="mb-3 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white"
            />

            <Input
              placeholder="Duration (seconds)"
              type="number"
              value={newTimerSeconds}
              onChange={(e) => setNewTimerSeconds(e.target.value)}
              className="mb-4 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white"
            />

            <Button onClick={addTimer} className="w-full bg-purple-600 hover:bg-purple-700 shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Timer
            </Button>
          </div>

          {/* Timers List */}
          {timers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-800">Active Timers</h3>
              </div>
              
              {timers.map((t) => (
                <div
                  key={t.id}
                  className={`relative overflow-hidden border rounded-2xl p-5 shadow-md hover:shadow-lg transition-all ${
                    t.time === 0 
                      ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300' 
                      : t.running 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                        : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Progress bar */}
                  {!t.edit && t.initialTime > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          t.time === 0 ? 'bg-red-500' : t.running ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${getProgress(t)}%` }}
                      />
                    </div>
                  )}

                  {t.edit ? (
                    <div className="space-y-3 mt-1">
                      <Input
                        defaultValue={t.name}
                        placeholder="Timer name"
                        onBlur={(e) =>
                          setTimers((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, name: e.target.value } : x
                            )
                          )
                        }
                        className="font-semibold"
                      />
                      <Input
                        type="number"
                        defaultValue={Math.floor(t.time / 1000)}
                        placeholder="Seconds"
                        onBlur={(e) =>
                          resetTimer(t.id, Number(e.target.value))
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-slate-800">{t.name}</h3>
                        {t.time === 0 && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            DONE
                          </span>
                        )}
                      </div>
                      <div className="bg-white/60 rounded-lg p-4 mb-3">
                        <div className={`text-4xl font-bold font-mono text-center tracking-tight ${
                          t.time === 0 ? 'text-red-600' : t.running ? 'text-green-600' : 'text-slate-800'
                        }`}>
                          {formatClock(t.time)}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => toggleTimer(t.id)}
                      disabled={t.time === 0}
                      className={t.running ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}
                    >
                      {t.running ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                      {t.running ? "Pause" : "Start"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleEdit(t.id)}
                      className="hover:bg-slate-100"
                    >
                      {t.edit ? <Check className="w-3 h-3 mr-1" /> : <Edit2 className="w-3 h-3 mr-1" />}
                      {t.edit ? "Save" : "Edit"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetTimer(t.id, Math.floor(t.initialTime / 1000))}
                      className="px-3 hover:bg-slate-100"
                      disabled={t.edit}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTimer(t.id)}
                      className="px-3"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {timers.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Timer className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No timers yet. Create one above!</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}