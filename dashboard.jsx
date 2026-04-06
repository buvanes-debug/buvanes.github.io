import React, { useState, useEffect } from "react";
import "./dashbords.css";

const stats = [
  { label: "Tasks Completed", value: "75%", note: "Up 8% from last week" },
  { label: "Team Online", value: "8/12", note: "3 on break, 1 absent" },
  { label: "Overdue Tasks", value: "3", note: "Needs attention today" },
  { label: "Active Projects", value: "5", note: "2 due this week" },
];

const tasks = [
  { title: "Inspect Building A lighting", status: "In Progress", owner: "John", due: "Today" },
  { title: "Approve maintenance request #204", status: "Pending", owner: "Supervisor", due: "2 PM" },
  { title: "Review shift report", status: "Completed", owner: "Mary", due: "Done" },
];

const team = [
  { name: "John", role: "Technician", status: "Working" },
  { name: "Mary", role: "Cleaner", status: "Working" },
  { name: "Brian", role: "Driver", status: "On Break" },
  { name: "Tendai", role: "Assistant", status: "Absent" },
];

export default function Dashboards() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="supervisor-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">FFIMS</p>
          <h1>Supervisor Dashboard</h1>
          <p className="subtitle">
            Monitor tasks, team performance, and project progress • April 6, 2026
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={() => alert('New task modal')}>
            + New Task
          </button>
          <button 
            className="theme-toggle action-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((item) => (
          <div className="card stat-card" key={item.label}>
            <p>{item.label}</p>
            <h2>{item.value}</h2>
            <span>{item.note}</span>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <div className="card panel">
          <h3>Today's Tasks</h3>
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task.title}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.owner} • Due {task.due}</p>
                </div>
                <span className={`badge ${task.status.toLowerCase().replace(/ /g, "-")}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel">
          <h3>Team Status</h3>
          <div className="team-list">
            {team.map((person) => (
              <div className="team-item" key={person.name}>
                <div>
                  <strong>{person.name}</strong>
                  <p>{person.role}</p>
                </div>
                <span className={`badge ${person.status.toLowerCase().replace(/ /g, "-")}`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card panel">
        <h3>Project Progress</h3>
        <div className="progress-block">
          <label>Maintenance Schedule</label>
          <div className="progress-bar">
            <div style={{ width: "68%" }} />
          </div>
          <span>68%</span>
        </div>
        <div className="progress-block">
          <label>Daily Inspections</label>
          <div className="progress-bar">
            <div style={{ width: "84%" }} />
          </div>
          <span>84%</span>
        </div>
        <div className="progress-block">
          <label>Report Review</label>
          <div className="progress-bar">
            <div style={{ width: "52%" }} />
          </div>
          <span>52%</span>
        </div>
      </section>
    </div>
  );
}
