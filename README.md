# LAYRIX — VLSI Physical Design Learning Lab

> **"Learn VLSI by Seeing It."**  
> *From Digital Logic to RTL-to-GDSII and Tapeout*

LAYRIX is a complete, practical, and interactive VLSI Physical Design learning platform designed for students, educators, and engineers. It transforms abstract semiconductor theory into living visual simulations, line-by-line mathematical breakdowns, hands-on practice exercises, and physical design portfolio projects.

---

## 🌟 Key Features

- **22-Level Roadmap (LEVEL 0 to LEVEL 21):** From IC Fundamentals and Digital Logic through Synthesis, Placement, CTS, Routing, STA, and Tapeout. Every level includes detailed explanations, practical VLSI relevance, formulas, examples, common mistakes, mini practice questions, and completion checklists.
- **Six Core Learning Pillars:** Digital Design, CMOS & Circuit Fundamentals, RTL & Verilog, Synthesis & Logic Optimization, Physical Design, and Timing/Verification/Signoff.
- **Interactive Visual Laboratories:**
  - **Flip-Flop Lab:** Live D Flip-Flop simulation with clock edge controls and real-time timing waveform rendering.
  - **FSM Lab:** Interactive Moore & Mealy State Machine simulator with step-through execution, state diagrams, and Verilog RTL generation.
  - **RTL-to-GDSII Flow & Placement/Routing/CTS/Verification Lab:** Interactive visualization of the physical design pipeline.
  - **CMOS Inverter Lab:** Transistor switching, static/dynamic power, and VTC curve visualizer.
  - **Digital Logic Lab:** Interactive gate selection, truth tables, and signal path tracing.
  - **Synthesis Lab:** RTL-to-gate mapping simulation, optimization modes (Area, Timing, Power), and standard cell library inspection.
  - **RTL Verilog Lab:** Interactive 2-to-1 MUX code editor, line-by-line explanation, and simulation.
- **VLSI Equation Lab ("Break the Equation Down"):** 8 interactive calculators for Core Utilization, Cell Density, Dynamic Power ($\alpha C V^2 f$), RC Delay ($t \approx 0.69 RC$), Setup Slack, Hold Slack, Max Clock Frequency ($f_{\max} = 1/T$), and Total Power.
- **Applied Practice Exercises:** Categorized exercises across Beginner, Intermediate, Advanced, and Expert levels with problem statements, hints, step-by-step solutions, and engineering takeaways.
- **Core Path to Tapeout:** 20-stage pipeline from Product Specification to Silicon Bring-Up detailing inputs, processes, outputs, failure modes, tools, and recovery strategies.
- **Hands-On Portfolio Projects:** 6 complete projects including the flagship capstone: **LAYRIX TinyCore — RTL-to-GDSII Physical Design Project**.
- **Progress Tracking System:** LocalStorage-persisted learning progress dashboard with completion metrics.

---

## 🛠️ Technology Stack

- **Core Framework:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Custom Vanilla CSS with semiconductor dark theme (`#07111F`, `#0B172A`, `#2563EB`, `#06B6D4`)
- **Icons & Graphics:** Clean SVG-based chip graphics & dynamic vector renderings
- **State Persistence:** LocalStorage for browser-based progress saving

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamatampadmasree56-ece/LAYRIX.git
   cd LAYRIX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`.

---

## 📦 Build & Verification

Before committing or deploying, run the verification suite:

```bash
# 1. Run ESLint
npm run lint

# 2. Type-check TypeScript
npx tsc -b

# 3. Build production bundle
npm run build
```

---

## 🌐 Production Deployment

The project is configured for continuous deployment on **Vercel** connected to the `main` branch of GitHub repository `kamatampadmasree56-ece/LAYRIX`.

Any push to `main` automatically triggers a fresh deployment.

---

## 🔮 Future Improvements

- OpenROAD / Yosys WASM integration for browser-based real synthesis & layout execution.
- WebAssembly-powered SPICE circuit simulator for transistor-level Transient Analysis.
- Downloadable PDF certificates upon 100% roadmap & capstone project completion.

---

## 📄 License

Created for educational purposes in VLSI & Semiconductor Engineering.
