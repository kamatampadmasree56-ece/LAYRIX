import { useState } from 'react'

type Pillar = {
  id: string
  number: number
  title: string
  icon: string
  what: string
  why: string
  whyEngineer: string
  whereInFlow: string
  skills: string[]
  tools: string[]
  output: string
  nextStage: string
  ifIgnored: string
  progression: { level: string; description: string }[]
  color: string
}

const pillars: Pillar[] = [
  {
    id: 'digital-design',
    number: 1,
    title: 'Digital Design',
    icon: '🔲',
    color: '#2563EB',
    what: 'The mathematical and logical foundation of all digital hardware. Covers Boolean algebra, logic gates, truth tables, combinational and sequential circuits, FSMs, and number systems.',
    why: 'Every digital circuit — from a simple adder to a complex CPU — is built from logic gates and flip-flops. Without digital design fundamentals, you cannot understand or verify any hardware.',
    whyEngineer: 'Physical design engineers must understand the circuits they are implementing. You need to know what an FSM or ALU looks like, why timing constraints exist, and how setup/hold time originates from flip-flop behavior.',
    whereInFlow: 'Digital design knowledge underlies every stage from RTL coding through placement and timing analysis. Flip-flop timing properties directly determine STA equations.',
    skills: ['Boolean algebra and logic simplification', 'Truth tables and Karnaugh maps', 'Combinational circuit design (MUX, adder, decoder)', 'Sequential circuit design (DFF, JK-FF, T-FF)', 'FSM design — Moore and Mealy', 'State diagram to Verilog implementation'],
    tools: ['Logisim (educational gate simulation)', 'GTKWave (waveform viewing)', 'ModelSim/Xcelium (simulation)', 'Synopsys Design Compiler (synthesis)'],
    output: 'Correct, synthesizable digital designs with understood timing behavior',
    nextStage: 'CMOS & Circuit Fundamentals — how logic gates are physically implemented in silicon',
    ifIgnored: 'You will not understand timing constraints, cannot debug RTL, and cannot reason about synthesis tradeoffs. Setup and hold time violations will be mysterious rather than understandable.',
    progression: [
      { level: 'Beginner', description: 'Gates, truth tables, Boolean laws, simple combinational circuits' },
      { level: 'Intermediate', description: 'Sequential circuits, timing analysis, FSM design and implementation' },
      { level: 'Advanced', description: 'Multi-clock domain design, metastability, advanced FSM encoding and optimization' },
    ],
  },
  {
    id: 'cmos',
    number: 2,
    title: 'CMOS & Circuit Fundamentals',
    icon: '⚡',
    color: '#7C3AED',
    what: 'The transistor-level foundation of digital circuits. Covers NMOS/PMOS transistors, CMOS logic families, RC delay model, noise margins, and power consumption in CMOS.',
    why: 'All standard cells in a technology library are CMOS circuits. Understanding CMOS explains why cells have the timing and power properties they do, why leakage matters in advanced nodes, and how voltage scaling affects power.',
    whyEngineer: 'Physical design engineers work with characterized standard cells every day. Understanding why a cell has a certain setup time or drive strength requires CMOS knowledge. Power analysis requires understanding dynamic and leakage power.',
    whereInFlow: 'CMOS knowledge applies during synthesis (cell selection), placement (understanding drive strength and fanout), CTS (understanding clock buffer properties), and power analysis.',
    skills: ['NMOS/PMOS transistor operation', 'CMOS inverter and static analysis', 'Pull-up/pull-down network design', 'RC delay calculation', 'Dynamic power: P = αCV²f', 'Leakage power analysis', 'Noise margin calculation'],
    tools: ['SPICE/ngSPICE (circuit simulation)', 'Synopsys HSPICE', 'Cadence Virtuoso (custom circuit design)', 'Liberty (.lib) cell library files'],
    output: 'Understanding of cell-level delay, power, and noise properties',
    nextStage: 'RTL & Verilog — describe circuits at behavioral level using CMOS-derived cells',
    ifIgnored: 'You will not understand why cell sizing matters, why power scales with V², or why leakage dominates in advanced technology nodes. STA and power reports will be numbers without physical meaning.',
    progression: [
      { level: 'Beginner', description: 'NMOS/PMOS behavior, CMOS inverter, pull-up/pull-down networks' },
      { level: 'Intermediate', description: 'RC delay model, dynamic vs static power, noise margins, cell characterization' },
      { level: 'Advanced', description: 'Advanced CMOS topologies, FINFET behavior, near-threshold computing, SRAM cells' },
    ],
  },
  {
    id: 'rtl-verilog',
    number: 3,
    title: 'RTL & Verilog',
    icon: '</> ',
    color: '#0891B2',
    what: 'Hardware description using Verilog or SystemVerilog at the Register-Transfer Level (RTL). Covers modules, ports, data types, always blocks, assignments, FSM coding, and testbench writing.',
    why: 'RTL is the primary input to synthesis. All chips start as RTL. Without RTL skills, you cannot create or understand the design that will be synthesized and physically implemented.',
    whyEngineer: 'Physical design engineers read and sometimes modify RTL to fix timing. Understanding the RTL structure helps predict synthesis quality and interpret the gate-level netlist. Timing constraints (SDC) reference signals defined in RTL.',
    whereInFlow: 'RTL is the very first stage of the design flow. RTL quality directly determines synthesis, floorplan, timing, and routing difficulty.',
    skills: ['Verilog/SystemVerilog module structure', 'Synthesizable RTL coding style', 'Combinational and sequential logic in RTL', 'FSM implementation', 'Testbench writing and simulation', 'SDC timing constraint writing'],
    tools: ['ModelSim/QuestaSim (simulation)', 'Synopsys VCS', 'Cadence Xcelium', 'Xilinx Vivado (FPGA prototyping)', 'Synopsys DC (synthesis)'],
    output: 'Verified, synthesizable RTL netlist and simulation results',
    nextStage: 'Synthesis & Logic Optimization — convert RTL to gate-level netlist',
    ifIgnored: 'You will not be able to write constraints (SDC files), understand the netlist, debug timing paths, or propose RTL fixes when physical timing cannot be closed.',
    progression: [
      { level: 'Beginner', description: 'Basic module structure, assign, simple always blocks, counter, registers' },
      { level: 'Intermediate', description: 'FSM coding, parameterized RTL, testbenches, assertions, verification basics' },
      { level: 'Advanced', description: 'Complex interfaces (AXI, APB), SystemVerilog features, formal verification, coverage-driven verification' },
    ],
  },
  {
    id: 'synthesis',
    number: 4,
    title: 'Synthesis & Logic Optimization',
    icon: '⚙️',
    color: '#059669',
    what: 'The automated process of converting RTL into a gate-level netlist mapped to standard cells from a technology library. Covers synthesis phases, optimization strategies, constraint setup, and report interpretation.',
    why: 'Synthesis is the bridge from abstract RTL to physical implementation. Synthesis quality — meeting timing, minimizing area, managing power — determines how difficult physical design will be.',
    whyEngineer: 'Physical design starts with the synthesis netlist. Understanding synthesis helps diagnose timing issues (is it RTL quality or synthesis optimization?), interpret synthesis timing reports as pre-layout estimates, and communicate with design engineers about fixes.',
    whereInFlow: 'Synthesis follows RTL verification. It feeds the netlist to floorplanning, and synthesis timing reports form the pre-layout timing baseline.',
    skills: ['RTL to netlist transformation understanding', 'Technology library (.lib) interpretation', 'SDC constraint writing', 'Synthesis report interpretation (timing, area, power)', 'Logic optimization techniques', 'Fanout and buffer strategies'],
    tools: ['Synopsys Design Compiler (DC)', 'Cadence Genus', 'Intel Quartus Prime (FPGA)', 'Yosys (open source)'],
    output: 'Gate-level netlist (.v) + SDC file + timing/area/power reports',
    nextStage: 'Physical Design — floorplan, place, route the netlist in silicon',
    ifIgnored: 'Poor synthesis leads to large netlists, bad timing, and routing difficulty. Physical design cannot fix fundamentally broken synthesis. Over-constrained synthesis wastes effort; under-constrained misses targets.',
    progression: [
      { level: 'Beginner', description: 'Run synthesis, read area/timing reports, understand WNS and TNS' },
      { level: 'Intermediate', description: 'SDC constraint writing, optimization mode selection, interpreting critical paths' },
      { level: 'Advanced', description: 'Multi-corner synthesis, clock gating, compile strategies, formal equivalence checking' },
    ],
  },
  {
    id: 'physical-design',
    number: 5,
    title: 'Physical Design',
    icon: '📐',
    color: '#DC2626',
    what: 'The implementation of a chip\'s layout from gate-level netlist to GDSII. Covers floorplanning, power planning, placement, clock tree synthesis, and routing — the complete back-end flow.',
    why: 'Physical design transforms the logical circuit into a real silicon layout. This is where timing, power, and area goals meet reality. Physical design is the most technically complex part of chip implementation.',
    whyEngineer: 'This is the core discipline for a physical design engineer. Every concept from die planning to routing congestion to electromigration is a physical design topic. It is the discipline that makes chips manufacturable.',
    whereInFlow: 'Physical design starts with the synthesis netlist and ends with a verified GDSII ready for tapeout. It is the core of the back-end flow.',
    skills: ['Floorplanning and utilization calculation', 'Power planning (rings, stripes, IR drop)', 'Standard cell placement (global, legalization, detailed)', 'Clock tree synthesis and skew management', 'Global and detailed routing', 'Physical verification concepts'],
    tools: ['Cadence Innovus', 'Synopsys IC Compiler 2 (ICC2)', 'Mentor Calibre (DRC/LVS)', 'OpenROAD (open source PD)', 'Apache/Ansys RedHawk (power analysis)'],
    output: 'GDSII layout file + routed netlist + physical verification clean sign-off',
    nextStage: 'Timing, Verification & Signoff — verify the physical design meets all specifications',
    ifIgnored: 'The chip cannot be manufactured. Physical design is the required transformation from logical description to physical geometry.',
    progression: [
      { level: 'Beginner', description: 'Floorplan setup, basic placement, simple routing, understand congestion maps' },
      { level: 'Intermediate', description: 'Power planning, CTS optimization, timing-driven placement and routing' },
      { level: 'Advanced', description: 'Multi-voltage design, advanced node DFM, full-chip ECO, timing closure at advanced nodes' },
    ],
  },
  {
    id: 'timing-verification',
    number: 6,
    title: 'Timing, Verification & Signoff',
    icon: '✅',
    color: '#D97706',
    what: 'The verification that the completed physical design meets all timing, power, signal integrity, and manufacturing requirements at all operating conditions. Covers STA, DRC, LVS, IR drop, and formal signoff.',
    why: 'Signoff is the final gate before tapeout. Errors caught here cost engineering time. Errors that escape to silicon cost millions in re-spins. Thorough verification is the last line of defense.',
    whyEngineer: 'Timing signoff is a daily activity for physical design engineers throughout the back-end flow. Understanding STA well — path tracing, slack calculation, PVT corners, MMMC — is a fundamental competency.',
    whereInFlow: 'STA runs after synthesis, after placement, after CTS, and after routing. DRC/LVS runs after routing. IR drop analysis runs post-route. All must pass before tapeout.',
    skills: ['Timing path tracing and slack calculation', 'Setup and hold analysis', 'PVT corner analysis', 'MMMC (Multi-Mode Multi-Corner) setup', 'DRC and LVS interpretation', 'IR drop and electromigration concepts', 'Signoff checklist management'],
    tools: ['Synopsys PrimeTime (STA)', 'Cadence Tempus (STA)', 'Mentor Calibre (DRC/LVS)', 'Apache/Ansys RedHawk (power/IR)', 'Synopsys StarRC (parasitic extraction)'],
    output: 'Signoff reports: STA clean, DRC/LVS clean, IR/EM clean → ready for tapeout',
    nextStage: 'Tapeout — submit GDSII to foundry for manufacturing',
    ifIgnored: 'Undetected timing violations cause functional failures in silicon. DRC violations cause manufacturing defects. LVS errors cause the chip to not match the intended schematic. All result in expensive re-spins.',
    progression: [
      { level: 'Beginner', description: 'Read timing reports, understand slack, identify critical paths, interpret DRC output' },
      { level: 'Intermediate', description: 'Multi-corner STA, timing ECO, LVS debugging, IR drop mitigation' },
      { level: 'Advanced', description: 'Full signoff management, MMMC analysis, advanced ECO, statistical timing analysis' },
    ],
  },
]

export default function SixPillars() {
  const [activePillar, setActivePillar] = useState<string | null>(null)

  return (
    <section className="section six-pillars-section" id="six-pillars">
      <div className="section-heading">
        <p className="section-eyebrow">Learning Framework</p>
        <h2>Six Learning Pillars of LAYRIX</h2>
        <p className="section-description">
          LAYRIX is structured around six foundational pillars that together form the complete VLSI engineer skill set. Each pillar builds on the previous and feeds the next.
        </p>
      </div>

      <div className="pillars-flow-row">
        {pillars.map((p, i) => (
          <div key={p.id} className="pillar-flow-step">
            <div
              className="pillar-flow-badge"
              style={{ background: p.color }}
              onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActivePillar(activePillar === p.id ? null : p.id)}
            >
              <span className="pillar-icon">{p.icon}</span>
              <span className="pillar-num">0{p.number}</span>
            </div>
            <div className="pillar-flow-label">{p.title}</div>
            {i < pillars.length - 1 && <div className="pillar-flow-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="pillars-detail-grid">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className={`pillar-detail-card ${activePillar === pillar.id ? 'active' : ''}`}
            style={{ '--pillar-color': pillar.color } as React.CSSProperties}
          >
            <button
              type="button"
              className="pillar-card-header"
              onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
              aria-expanded={activePillar === pillar.id}
            >
              <div className="pillar-card-badge" style={{ background: pillar.color }}>
                <span>{pillar.icon}</span>
                <span>0{pillar.number}</span>
              </div>
              <div className="pillar-card-title">
                <h3>{pillar.title}</h3>
                <p className="pillar-card-preview">{pillar.what.slice(0, 80)}…</p>
              </div>
              <span className="pillar-chevron">{activePillar === pillar.id ? '▲' : '▼'}</span>
            </button>

            {activePillar === pillar.id && (
              <div className="pillar-detail-body">
                <div className="pillar-section">
                  <h4>What Is It?</h4>
                  <p>{pillar.what}</p>
                </div>

                <div className="pillar-two-col">
                  <div className="pillar-section">
                    <h4>Why It Matters</h4>
                    <p>{pillar.why}</p>
                  </div>
                  <div className="pillar-section">
                    <h4>Why Every VLSI Engineer Needs It</h4>
                    <p>{pillar.whyEngineer}</p>
                  </div>
                </div>

                <div className="pillar-section">
                  <h4>Where It Appears in the Chip Design Flow</h4>
                  <p>{pillar.whereInFlow}</p>
                </div>

                <div className="pillar-skills-tools">
                  <div className="pillar-section">
                    <h4>Skills You Gain</h4>
                    <ul>
                      {pillar.skills.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="pillar-section">
                    <h4>Commonly Used Tools</h4>
                    <div className="tool-tags">
                      {pillar.tools.map((t) => <span key={t} className="tool-tag">{t}</span>)}
                    </div>
                  </div>
                </div>

                <div className="pillar-flow-cards">
                  <div className="pillar-flow-card">
                    <div className="flow-card-label">Output</div>
                    <p>{pillar.output}</p>
                  </div>
                  <div className="pillar-flow-arrow-v">↓</div>
                  <div className="pillar-flow-card">
                    <div className="flow-card-label">Next Stage</div>
                    <p>{pillar.nextStage}</p>
                  </div>
                </div>

                <div className="pillar-section warning-section">
                  <h4>⚠ What Happens If This Pillar Is Ignored?</h4>
                  <p>{pillar.ifIgnored}</p>
                </div>

                <div className="pillar-section">
                  <h4>Learning Progression</h4>
                  <div className="progression-track">
                    {pillar.progression.map((p) => (
                      <div key={p.level} className="progression-step">
                        <div className="progression-level">{p.level}</div>
                        <div className="progression-desc">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
