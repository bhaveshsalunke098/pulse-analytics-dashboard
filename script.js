
"use strict";

// Pulse Analytics — fictional Indian SaaS demo data

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const transactions = [
  { id: "TX-IND-1048", name: "Aarav Sharma", email: "aarav.sharma@example.com", city: "Mumbai", plan: "Enterprise", date: "2026-10-17", amount: 9999, status: "Paid" },
  { id: "TX-IND-1047", name: "Priya Patel", email: "priya.patel@example.com", city: "Ahmedabad", plan: "Professional", date: "2026-10-16", amount: 2999, status: "Paid" },
  { id: "TX-IND-1046", name: "Rohan Deshmukh", email: "rohan.deshmukh@example.com", city: "Pune", plan: "Starter", date: "2026-10-16", amount: 999, status: "Pending" },
  { id: "TX-IND-1045", name: "Ananya Iyer", email: "ananya.iyer@example.com", city: "Bengaluru", plan: "Professional", date: "2026-10-15", amount: 2999, status: "Paid" },
  { id: "TX-IND-1044", name: "Vikram Singh", email: "vikram.singh@example.com", city: "Delhi", plan: "Enterprise", date: "2026-10-14", amount: 9999, status: "Refunded" },
  { id: "TX-IND-1043", name: "Sneha Kulkarni", email: "sneha.kulkarni@example.com", city: "Nashik", plan: "Starter", date: "2026-10-13", amount: 999, status: "Paid" },
  { id: "TX-IND-1042", name: "Aditya Verma", email: "aditya.verma@example.com", city: "Hyderabad", plan: "Professional", date: "2026-10-12", amount: 2999, status: "Pending" },
  { id: "TX-IND-1041", name: "Meera Nair", email: "meera.nair@example.com", city: "Kochi", plan: "Enterprise", date: "2026-10-11", amount: 9999, status: "Paid" },
  { id: "TX-IND-1040", name: "Rahul Joshi", email: "rahul.joshi@example.com", city: "Jaipur", plan: "Starter", date: "2026-10-10", amount: 999, status: "Paid" },
  { id: "TX-IND-1039", name: "Kavya Reddy", email: "kavya.reddy@example.com", city: "Chennai", plan: "Professional", date: "2026-10-09", amount: 2999, status: "Paid" },
  { id: "TX-IND-1038", name: "Arjun Mehta", email: "arjun.mehta@example.com", city: "Surat", plan: "Enterprise", date: "2026-10-08", amount: 9999, status: "Pending" },
  { id: "TX-IND-1037", name: "Ishita Banerjee", email: "ishita.banerjee@example.com", city: "Kolkata", plan: "Starter", date: "2026-10-07", amount: 999, status: "Refunded" }
];

const revenueSeries = {
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [58000, 72000, 65000, 84000, 79000, 96000, 86000],
    expenses: [31000, 35000, 32000, 42000, 39000, 47000, 41000]
  },
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [480000, 560000, 610000, 836000],
    expenses: [240000, 270000, 290000, 380000]
  },
  year: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    revenue: [1420000, 1680000, 1750000, 1920000, 2140000, 2486000],
    expenses: [710000, 820000, 860000, 930000, 1040000, 1180000]
  }
};

let currentPeriod = "month";
let currentPage = 1;
const pageSize = 5;

let revenueChart = null;
let subscriptionChart = null;

const chartColors = {
  green: "#a8df61",
  darkGreen: "#527b2e",
  gray: "#dce2d5",
  text: "#858b81",
  grid: "#e9ece5"
};

// -------------------- REVENUE CHART --------------------

function createRevenueChart() {
  const canvas = $("#revenueChart");

  if (!canvas || typeof Chart === "undefined") {
    console.error("Chart.js did not load. Check your internet connection.");
    return;
  }

  revenueChart = new Chart(canvas, {
    type: "line",

    data: {
      labels: [],
      datasets: [
        {
          label: "Revenue",
          data: [],
          borderColor: chartColors.darkGreen,
          backgroundColor: "rgba(168, 223, 97, 0.18)",
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: chartColors.darkGreen
        },
        {
          label: "Expenses",
          data: [],
          borderColor: "#b9c1b0",
          backgroundColor: "transparent",
          tension: 0.38,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 2
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: "index"
      },

      plugins: {
        legend: {
          position: "bottom",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 7,
            padding: 18,
            color: chartColors.text,
            font: { size: 11 }
          }
        },

        tooltip: {
          backgroundColor: "#20251f",
          padding: 12,
          cornerRadius: 8,

          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${currency.format(context.parsed.y)}`;
            }
          }
        }
      },

      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: chartColors.text,
            font: { size: 10 }
          }
        },

        y: {
          beginAtZero: true,
          border: { display: false, dash: [3, 4] },
          grid: { color: chartColors.grid },

          ticks: {
            color: chartColors.text,
            font: { size: 10 },

            callback(value) {
              const amount = Number(value);

              if (amount >= 100000) {
                return `₹${(amount / 100000).toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 1 }
                )}L`;
              }

              return `₹${(amount / 1000).toLocaleString(
                "en-IN",
                { maximumFractionDigits: 0 }
              )}k`;
            }
          }
        }
      }
    }
  });

  updateRevenueChart();
}

function updateRevenueChart() {
  if (!revenueChart) return;

  const series = revenueSeries[currentPeriod];

  revenueChart.data.labels = series.labels;
  revenueChart.data.datasets[0].data = series.revenue;
  revenueChart.data.datasets[1].data = series.expenses;

  revenueChart.update();
}

// -------------------- SUBSCRIPTION CHART --------------------

function createSubscriptionChart() {
  const canvas = $("#subscriptionChart");

  if (!canvas || typeof Chart === "undefined") return;

  subscriptionChart = new Chart(canvas, {
    type: "doughnut",

    data: {
      labels: ["Starter", "Professional", "Enterprise"],

      datasets: [{
        data: [52, 33, 15],
        backgroundColor: [
          "#a8df61",
          "#527b2e",
          "#dce2d5"
        ],
        borderWidth: 0,
        hoverOffset: 5,
        spacing: 3,
        borderRadius: 4
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",

      plugins: {
        legend: { display: false },

        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    },

    plugins: [{
      id: "centerText",

      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;

        const styles = getComputedStyle(document.body);
        const textColor = styles.getPropertyValue("--text").trim();
        const mutedColor = styles.getPropertyValue("--muted").trim();

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = textColor;
        ctx.font = "800 25px Manrope, sans-serif";
        ctx.fillText("2,430", x, y - 5);

        ctx.fillStyle = mutedColor;
        ctx.font = "11px 'DM Sans', sans-serif";
        ctx.fillText("Subscriptions", x, y + 17);

        ctx.restore();
      }
    }]
  });
}

// -------------------- TRANSACTION SEARCH --------------------

function getFilteredTransactions() {
  const query = ($("#transactionSearch")?.value || "")
    .trim()
    .toLowerCase();

  const status = $("#statusFilter")?.value || "All";

  return transactions.filter(transaction => {
    const searchable = [
      transaction.id,
      transaction.name,
      transaction.email,
      transaction.city,
      transaction.plan
    ].join(" ").toLowerCase();

    return searchable.includes(query) &&
      (status === "All" || transaction.status === status);
  });
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;

  if (className) {
    cell.className = className;
  }

  return cell;
}

function renderTransactions() {
  const tbody = $("#transactionRows");
  if (!tbody) return;

  const filtered = getFilteredTransactions();

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  tbody.replaceChildren();

  if (visible.length === 0) {
    const row = document.createElement("tr");
    const cell = createCell("No transactions match your search.");

    cell.colSpan = 7;
    cell.className = "empty-state";

    row.appendChild(cell);
    tbody.appendChild(row);
  } else {
    visible.forEach(transaction => {
      const row = document.createElement("tr");

      // Customer name and avatar
      const customerCell = document.createElement("td");
      const customer = document.createElement("div");
      customer.className = "customer-cell";

      const avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.setAttribute("aria-hidden", "true");

      avatar.textContent = transaction.name
        .split(" ")
        .map(part => part[0])
        .join("");

      const details = document.createElement("div");

      const name = document.createElement("div");
      name.className = "customer-name";
      name.textContent = transaction.name;

      const email = document.createElement("div");
      email.className = "customer-email";
      email.textContent = transaction.email;

      details.append(name, email);
      customer.append(avatar, details);
      customerCell.appendChild(customer);

      row.appendChild(customerCell);
      row.appendChild(createCell(transaction.city));
      row.appendChild(createCell(transaction.id));
      row.appendChild(createCell(transaction.plan));

      const date = new Date(`${transaction.date}T12:00:00`);

      row.appendChild(createCell(
        date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      ));

      row.appendChild(
        createCell(currency.format(transaction.amount), "amount")
      );

      const statusCell = document.createElement("td");
      const badge = document.createElement("span");

      badge.className = `status ${transaction.status.toLowerCase()}`;
      badge.textContent = transaction.status;

      statusCell.appendChild(badge);
      row.appendChild(statusCell);

      tbody.appendChild(row);
    });
  }

  const from = filtered.length ? start + 1 : 0;
  const to = Math.min(start + pageSize, filtered.length);

  $("#resultCount").textContent =
    `${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`;

  $("#pageInfo").textContent =
    `Showing ${from}–${to} of ${filtered.length}`;

  $("#prevPage").disabled = currentPage <= 1;
  $("#nextPage").disabled = currentPage >= totalPages;
}

// -------------------- DARK MODE --------------------

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark", isDark);

  const button = $("#themeToggle");

  if (button) {
    button.setAttribute("aria-pressed", String(isDark));

    button.innerHTML = isDark
      ? "☀ <span>Light mode</span>"
      : "◐ <span>Dark mode</span>";
  }

  if (revenueChart) {
    const tickColor = isDark ? "#a0a89a" : chartColors.text;

    revenueChart.options.scales.x.ticks.color = tickColor;
    revenueChart.options.scales.y.ticks.color = tickColor;

    revenueChart.options.scales.y.grid.color =
      isDark ? "#333b30" : chartColors.grid;

    revenueChart.options.plugins.legend.labels.color = tickColor;

    revenueChart.update("none");
  }

  if (subscriptionChart) {
    subscriptionChart.update("none");
  }
}

function initTheme() {
  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("pulse-theme") || "light";
  } catch (_) {
    // Theme switching works even when storage is unavailable.
  }

  applyTheme(savedTheme);

  $("#themeToggle")?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("pulse-theme", nextTheme);
    } catch (_) {
      // Continue without persistent theme storage.
    }
  });
}

// -------------------- NAVIGATION --------------------

function initNavigation() {
  $$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href");

      if (
        !targetId ||
        !targetId.startsWith("#") ||
        !$(targetId)
      ) {
        return;
      }

      $$(".nav-link").forEach(item => {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      });

      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    });
  });
}

// -------------------- INITIALIZATION --------------------

function initDashboard() {
  if (typeof Chart !== "undefined") {
    createRevenueChart();
    createSubscriptionChart();
  } else {
    console.error(
      "Chart.js is unavailable. Check your internet connection."
    );
  }

  renderTransactions();
  initTheme();
  initNavigation();

  $("#periodSelect")?.addEventListener("change", event => {
    currentPeriod = event.target.value;
    updateRevenueChart();
  });

  $("#transactionSearch")?.addEventListener("input", () => {
    currentPage = 1;
    renderTransactions();
  });

  $("#statusFilter")?.addEventListener("change", () => {
    currentPage = 1;
    renderTransactions();
  });

  $("#prevPage")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTransactions();
    }
  });

  $("#nextPage")?.addEventListener("click", () => {
    const totalPages = Math.max(
      1,
      Math.ceil(getFilteredTransactions().length / pageSize)
    );

    if (currentPage < totalPages) {
      currentPage++;
      renderTransactions();
    }
  });

  console.info(
    "Pulse Analytics initialized. Customer records are fictional demo data."
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
