import { useState } from "react";
import "./App.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [selectedBill, setSelectedBill] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paidMessage, setPaidMessage] = useState(false);
  const [search, setSearch] = useState("");

  const bills = [
    { month: "January", units: 120, rate: 4 },
    { month: "February", units: 150, rate: 4.5 },
    { month: "March", units: 130, rate: 5 }
  ];

  const calculateBill = (bill) => {
    const base = bill.units * bill.rate;
    const tax = base * 0.1;
    const total = base + tax;
    return { base, tax, total };
  };

  const chartData = {
    labels: bills.map(b => b.month),
    datasets: [
      {
        label: "Units Consumed",
        data: bills.map(b => b.units),
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: dark ? "#fff" : "#000" }
      }
    },
    scales: {
      x: { ticks: { color: dark ? "#fff" : "#000" } },
      y: { ticks: { color: dark ? "#fff" : "#000" } }
    }
  };

  const filteredBills = bills.filter(b =>
    b.month.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogin = () => {
    if (username && password) setLoggedIn(true);
    else alert("Enter username & password");
  };

  // ================= LOGIN =================
  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="login-box fade-in">
          <h2>⚡ Login</h2>

          <input
            placeholder="Username"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className={dark ? "app dark fade-in" : "app fade-in"}>

      {/* HEADER */}
      <div className="header">
        <h1>⚡ Electricity Dashboard</h1>

        <div className="header-right">
          <span className="user">👤 {username}</span>

          <button onClick={() => setDark(!dark)}>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          <button className="logout" onClick={() => setLoggedIn(false)}>
            Logout
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search bill..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* BILLS */}
      <div className="grid">
        {filteredBills.map((bill, i) => {
          const { total } = calculateBill(bill);

          return (
            <div className="card fade-in" key={i}>
              <h2>{bill.month}</h2>
              <p>💰 ₹{total.toFixed(2)}</p>
              <p>⚡ Units: {bill.units}</p>

              <button
                className="button details-btn"
                onClick={() => setSelectedBill(bill)}
              >
                View Breakdown
              </button>

              <button
                className="button"
                onClick={() => setShowPayment(true)}
              >
                Pay Now
              </button>
            </div>
          );
        })}
      </div>

      {/* BILL BREAKDOWN */}
      {selectedBill && (() => {
        const { base, tax, total } = calculateBill(selectedBill);

        return (
          <div className="popup fade-in">
            <div className="popup-box">
              <h2>{selectedBill.month} Bill</h2>
              <p>Units: {selectedBill.units}</p>
              <p>Rate: ₹{selectedBill.rate}</p>
              <p>Base: ₹{base.toFixed(2)}</p>
              <p>Tax: ₹{tax.toFixed(2)}</p>
              <h3>Total: ₹{total.toFixed(2)}</h3>

              <button onClick={() => setSelectedBill(null)}>
                Close
              </button>
            </div>
          </div>
        );
      })()}

      {/* PAYMENT */}
      {showPayment && (
        <div className="popup fade-in">
          <div className="popup-box">
            <h2>💳 Payment</h2>
            <input placeholder="Card Number" className="input" />
            <input placeholder="Expiry Date" className="input" />
            <input placeholder="CVV" className="input" />

            <button
              onClick={() => {
                setShowPayment(false);
                setPaidMessage(true);
              }}
            >
              Pay
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {paidMessage && (
        <div className="popup fade-in">
          <div className="popup-box">
            <h2>✅ Payment Successful</h2>
            <button onClick={() => setPaidMessage(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
