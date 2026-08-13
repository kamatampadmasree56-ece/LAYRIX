import { useState } from 'react'

type ProjectDetail = {
  id: string
  title: string
  subtitle: string
  isFlagship?: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Capstone'
  estimatedTime: string
  overview: string
  problemStatement: string
  learningObjectives: string[]
  prerequisites: string[]
  architectureText: string
  blockDiagramText: string
  designRequirements: string[]
  implementationSteps: string[]
  verificationPlan: string[]
  expectedResults: string[]
  tools: string[]
  skillsLearned: string[]
  portfolioDescription: string
}

const projects: ProjectDetail[] = [
  {
    id: 'proj-1',
    title: 'Project 1: 8-bit ALU — RTL to Gate-Level',
    subtitle: 'Combinational & Arithmetic Logic Design',
    difficulty: 'Beginner',
    estimatedTime: '8–10 hours',
    overview: 'Design an 8-bit Arithmetic Logic Unit (ALU) supporting addition, subtraction, AND, OR, XOR, and shift operations. Synthesize the RTL and analyze gate-level netlists.',
    problemStatement: 'Modern microprocessors require execution units capable of high-speed arithmetic and bitwise logic operations. Build an 8-bit ALU and verify its performance post-synthesis.',
    learningObjectives: [
      'Write parameterized synthesizable Verilog for arithmetic operations',
      'Implement opcode decoding using case statements',
      'Simulate the ALU with self-checking testbenches',
      'Synthesize RTL to a standard cell library and evaluate area/delay',
    ],
    prerequisites: ['Level 1 & 3 Digital Logic', 'Level 8 Verilog Basics'],
    architectureText: 'Inputs: 8-bit A, 8-bit B, 3-bit Opcode (ALU_CTRL). Outputs: 8-bit Result, Zero Flag, Carry Flag, Overflow Flag.',
    blockDiagramText: '[A, B, Opcode] ──► [Decoder & MUX] ──► [Adder / Logic / Shifter Unit] ──► [Result & Flags]',
    designRequirements: [
      'Opcode 3b000: ADD (A + B)',
      'Opcode 3b001: SUB (A − B)',
      'Opcode 3b010: AND (A & B)',
      'Opcode 3b011: OR (A | B)',
      'Opcode 3b100: XOR (A ^ B)',
      'Opcode 3b101: Shift Left Logical (A << 1)',
      'Opcode 3b110: Shift Right Logical (A >> 1)',
      'Opcode 3b111: Set on Less Than (SLT)',
    ],
    implementationSteps: [
      'Write `alu_8bit.v` in Verilog with parameterized bit-width.',
      'Write `tb_alu_8bit.v` applying random and corner-case test vectors.',
      'Run simulation in GTKWave / ModelSim to verify arithmetic flags.',
      'Run logic synthesis using technology library (e.g. 45nm/28nm).',
      'Analyze area and critical path timing in synthesis reports.',
    ],
    verificationPlan: [
      'Self-checking testbench comparing ALU output against behavioral reference model.',
      '100% statement and branch coverage in simulation.',
    ],
    expectedResults: ['Passing simulation suite with 0 errors.', 'Synthesized netlist with ~150-200 standard cells.'],
    tools: ['Verilog HDL', 'GTKWave / ModelSim', 'Synopsys DC / Yosys'],
    skillsLearned: ['RTL Design', 'ALU Architecture', 'Testbench Development', 'Logic Synthesis'],
    portfolioDescription: 'Designed and synthesized an 8-bit ALU in 28nm technology, achieving 100% verification coverage and analyzing post-synthesis gate count and critical path delay.',
  },
  {
    id: 'proj-2',
    title: 'Project 2: UART Transmitter — RTL to Physical Design',
    subtitle: 'Serial Communication Protocol & Physical Flow',
    difficulty: 'Intermediate',
    estimatedTime: '15–20 hours',
    overview: 'Implement a complete UART (Universal Asynchronous Receiver-Transmitter) module, synthesize it, and run physical placement and routing.',
    problemStatement: 'Serial communication protocols require precise baud rate timing and robust FSM control. Design a UART transmitter and take it through place-and-route.',
    learningObjectives: [
      'Design baud rate generators using counter dividers',
      'Implement a shift-register based serial transmitter FSM',
      'Floorplan, place, and route the UART module',
      'Perform static timing analysis on the placed layout',
    ],
    prerequisites: ['Level 5 FSM Design', 'Level 14-17 Physical Design'],
    architectureText: 'Baud Rate Generator → Transmitter Control FSM → Shift Register → TX Pin.',
    blockDiagramText: '[System Clock] ──► [Baud Rate Generator] ──► [FSM] ──► [Shift Register] ──► [TX Pin]',
    designRequirements: [
      'Support standard baud rates (9600, 115200 bps) from 50 MHz clock',
      '8 data bits, 1 stop bit, no parity',
      'TX_BUSY status signal during transmission',
    ],
    implementationSteps: [
      'Implement `baud_gen.v` and `uart_tx.v` in SystemVerilog.',
      'Simulate serial frame transmission in ModelSim.',
      'Synthesize design with clock constraints (SDC).',
      'Floorplan core with 70% utilization target.',
      'Place standard cells and run CTS to balance clock tree.',
      'Route signal wires and run DRC/LVS checks.',
    ],
    verificationPlan: ['Simulate serial bitstream timing against ideal baud period.', 'Post-route STA signoff.'],
    expectedResults: ['Clean DRC/LVS layout.', 'WNS >= 0 at 100 MHz operating frequency.'],
    tools: ['SystemVerilog', 'Synopsys DC', 'Cadence Innovus / OpenROAD', 'PrimeTime'],
    skillsLearned: ['UART Protocol', 'Baud Generators', 'Place & Route', 'CTS & STA'],
    portfolioDescription: 'Implemented a UART TX module in SystemVerilog and closed physical design layout in OpenROAD/Innovus with zero DRC violations.',
  },
  {
    id: 'proj-3',
    title: 'Project 3: Traffic Light FSM',
    subtitle: 'Sequential Controller Design & Waveform Analysis',
    difficulty: 'Beginner',
    estimatedTime: '6–8 hours',
    overview: 'Design a 4-way traffic light intersection controller using a Moore State Machine.',
    problemStatement: 'Intersection safety relies on fail-safe FSM controllers with emergency vehicle override capabilities.',
    learningObjectives: [
      'Construct state transition diagrams for multi-way traffic',
      'Implement Moore FSM in Verilog using two-block style',
      'Verify timing behavior with simulation waveforms',
    ],
    prerequisites: ['Level 4 Sequential Logic', 'Level 5 FSM Design'],
    architectureText: 'States: NS_GREEN, NS_YELLOW, EW_GREEN, EW_YELLOW, EMERGENCY_ALL_RED.',
    blockDiagramText: '[Timer & Sensors] ──► [FSM Controller] ──► [North-South Lights & East-West Lights]',
    designRequirements: [
      'NS Green: 10 cycles, Yellow: 3 cycles',
      'EW Green: 10 cycles, Yellow: 3 cycles',
      'Emergency sensor forces ALL_RED state within 1 cycle',
    ],
    implementationSteps: [
      'Draw state transition table and encoding chart.',
      'Write `traffic_fsm.v` in Verilog.',
      'Simulate emergency override scenarios in GTKWave.',
      'Synthesize to verify state flip-flop count.',
    ],
    verificationPlan: ['Verify state sequence in waveform.', 'Assert emergency override safety.'],
    expectedResults: ['Clean state transitions without glitching.'],
    tools: ['Verilog', 'GTKWave', 'Yosys'],
    skillsLearned: ['State Encoding', 'Moore FSM', 'Waveform Debugging'],
    portfolioDescription: 'Designed a 4-way traffic light FSM with emergency override logic and verified timing in simulation.',
  },
  {
    id: 'proj-4',
    title: 'Project 4: 8-bit Synchronous & Asynchronous FIFO',
    subtitle: 'Memory Buffering & Clock Domain Crossing',
    difficulty: 'Intermediate',
    estimatedTime: '12–15 hours',
    overview: 'Build a First-In-First-Out (FIFO) buffer with read/write pointers and full/empty flag logic.',
    problemStatement: 'Data transfer between blocks operating at different speeds requires reliable FIFO buffering.',
    learningObjectives: [
      'Design dual-port RAM memory arrays',
      'Implement circular read and write pointers',
      'Generate Full, Empty, Almost-Full, Almost-Empty flags',
      'Understand Gray code pointer synchronization for asynchronous FIFOs',
    ],
    prerequisites: ['Level 8 Verilog', 'Level 9 RTL Design'],
    architectureText: 'Dual-Port RAM + Write Pointer Logic + Read Pointer Logic + Flag Generator.',
    blockDiagramText: '[Write Data] ──► [Dual-Port RAM Array] ──► [Read Data]\n  [Wr Ptr] ──► [Flag Logic] ◄── [Rd Ptr]',
    designRequirements: [
      'Depth: 16 words, Width: 8 bits',
      'Synchronous read/write on clk',
      'Full and Empty flags must prevent overflow/underflow',
    ],
    implementationSteps: [
      'Write `fifo_mem.v` and pointer control logic.',
      'Implement pointer comparison for flag generation.',
      'Simulate full burst writes and reads.',
      'Synthesize design and inspect memory cell mapping.',
    ],
    verificationPlan: ['Test read-after-write integrity.', 'Verify Full/Empty flag assertions.'],
    expectedResults: ['Data written matches data read in exact order.'],
    tools: ['Verilog', 'ModelSim', 'Synopsys DC'],
    skillsLearned: ['FIFO Buffers', 'Pointer Arithmetic', 'Memory Interfaces'],
    portfolioDescription: 'Designed an 8-bit synchronous FIFO with full/empty detection logic and verified data integrity under burst conditions.',
  },
  {
    id: 'proj-5',
    title: 'Project 5: Mini RISC Processor Core',
    subtitle: 'CPU Architecture & RTL Datapath',
    difficulty: 'Advanced',
    estimatedTime: '25–30 hours',
    overview: 'Design a single-cycle 8-bit RISC processor core with instruction fetch, decode, ALU execution, and register file.',
    problemStatement: 'Understand how software instructions execute on physical CPU hardware by building a mini RISC core.',
    learningObjectives: [
      'Implement Program Counter (PC) and Instruction Memory',
      'Build a Register File (8 registers × 8 bits)',
      'Design Control Unit to decode opcodes into control signals',
      'Execute arithmetic, memory load/store, and branch instructions',
    ],
    prerequisites: ['Project 1 ALU', 'Level 9 RTL Design'],
    architectureText: 'PC → Instruction Memory → Control Unit + Register File → ALU → Data Memory.',
    blockDiagramText: '[PC] ──► [Instr Mem] ──► [Control Unit] ──► [Reg File] ──► [ALU] ──► [Data Mem]',
    designRequirements: [
      'Support 8 instructions: ADD, SUB, AND, OR, LW, SW, BEQ, JMP',
      'Single-cycle execution per instruction',
      '32-byte Data Memory interface',
    ],
    implementationSteps: [
      'Write individual sub-modules: `pc.v`, `regfile.v`, `control.v`, `alu.v`.',
      'Top-level assembly in `cpu_top.v`.',
      'Write machine code assembly program to calculate Fibonacci numbers.',
      'Simulate execution in ModelSim.',
      'Synthesize core and analyze maximum clock frequency.',
    ],
    verificationPlan: ['Run Fibonacci test program and inspect register R1 output.'],
    expectedResults: ['Fibonacci sequence correctly computed in register file.'],
    tools: ['Verilog HDL', 'ModelSim', 'Synopsys DC'],
    skillsLearned: ['CPU Architecture', 'Datapath & Control', 'Assembly Simulation'],
    portfolioDescription: 'Designed a single-cycle 8-bit RISC processor core in Verilog, executed sample programs, and evaluated post-synthesis Fmax.',
  },
  {
    id: 'proj-6',
    title: 'Project 6 — FLAGSHIP CAPSTONE: LAYRIX TinyCore',
    subtitle: 'Complete RTL-to-GDSII Physical Design Project',
    isFlagship: true,
    difficulty: 'Capstone',
    estimatedTime: '40–50 hours',
    overview: 'Build a complete digital core (LAYRIX TinyCore) and take it through the full RTL-to-GDSII physical design flow: specification, RTL, simulation, synthesis, floorplanning, placement, CTS, routing, STA, DRC/LVS, and GDSII tapeout signoff.',
    problemStatement: 'The ultimate test of a VLSI physical design engineer is taking a raw design from Verilog RTL to a DRC/LVS-clean, timing-closed GDSII layout ready for tapeout.',
    learningObjectives: [
      'Write synthesizable RTL for LAYRIX TinyCore (ALU + Timer + Peripheral Bus)',
      'Perform logic synthesis with SDC timing constraints',
      'Floorplan core, define utilization, place IO pins, build power mesh',
      'Run global and detailed placement with timing-driven optimization',
      'Perform Clock Tree Synthesis (CTS) and balance clock tree',
      'Route all metal layers and perform parasitic RC extraction (SPEF)',
      'Achieve physical closure: WNS >= 0, Hold Slack >= 0, 0 DRC errors, 0 LVS errors',
      'Generate final GDSII file for tapeout signoff',
    ],
    prerequisites: ['Projects 1-5', 'Roadmap Levels 0-21', 'Six Learning Pillars'],
    architectureText: 'LAYRIX TinyCore incorporates an 8-bit Processing Unit, 256-byte RAM, Timer/Counter Peripheral, and Bus Arbiter.',
    blockDiagramText: '[Core Processing Unit] ◄──► [Bus Arbiter] ◄──► [256B RAM Block]\n                                  ▲\n                                  └──► [Timer Peripheral]',
    designRequirements: [
      'Target Frequency: 200 MHz (T_clk = 5.0 ns)',
      'Target Technology: 28nm / 45nm Open-Source PDK',
      'Target Core Utilization: 65% – 70%',
      'Max IR Drop: < 4% VDD',
      'DRC / LVS Violations: Exactly ZERO',
    ],
    implementationSteps: [
      'Stage 1: RTL Coding & Linting (`tinycore_top.v`).',
      'Stage 2: Testbench Simulation & 100% Functional Verification.',
      'Stage 3: Logic Synthesis in Design Compiler / Genus / Yosys.',
      'Stage 4: Floorplanning (Die Sizing, IO Pin Placement, Power Ring & Stripe Mesh).',
      'Stage 5: Standard Cell Placement (Global, Legalization, Detailed).',
      'Stage 6: Clock Tree Synthesis (CTS) & Post-CTS Hold Fixing.',
      'Stage 7: Detailed Routing & Parasitic SPEF Extraction.',
      'Stage 8: Signoff STA (PrimeTime / Tempus) across SS, TT, FF corners.',
      'Stage 9: Signoff Physical Verification (Calibre DRC & LVS).',
      'Stage 10: GDSII Export & Final Signoff Review Package Assembly.',
    ],
    verificationPlan: [
      'Pre-synthesis RTL simulation: 100% functional pass.',
      'Gate-level netlist simulation with SDF timing delays.',
      'Post-route Multi-Corner STA: WNS >= 0, TNS = 0.',
      'Calibre DRC: 0 errors.',
      'Calibre LVS: Netlist matches layout exactly.',
    ],
    expectedResults: [
      'Clean GDSII file (tinycore.gds).',
      'Zero DRC/LVS violations.',
      'Timing closed at 200 MHz across all PVT corners.',
    ],
    tools: ['Verilog', 'Synopsys DC / Genus', 'Cadence Innovus / OpenROAD', 'PrimeTime', 'Calibre DRC/LVS'],
    skillsLearned: [
      'Full RTL-to-GDSII Flow',
      'Floorplanning & Power Mesh Design',
      'Timing-Driven Placement',
      'CTS & Skew Balancing',
      'Detailed Routing & SPEF',
      'Signoff STA & Multi-Corner Verification',
      'DRC/LVS Debugging',
      'Tapeout Preparation',
    ],
    portfolioDescription: 'Successfully designed and physically implemented LAYRIX TinyCore (28nm technology node), taking the core from Verilog RTL to a 200 MHz timing-closed, DRC/LVS-clean GDSII layout ready for foundry tapeout.',
  },
]

export default function ProjectsSection() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-6')
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ARCHITECTURE' | 'STEPS' | 'VERIFICATION'>('OVERVIEW')

  const toggleProjectComplete = (id: string) => {
    setCompletedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const currentProj = projects.find((p) => p.id === selectedProjectId) || projects[5]

  return (
    <section className="section projects-section" id="projects-section">
      <div className="section-heading">
        <p className="section-eyebrow">Hands-on Portfolio Projects</p>
        <h2>Build Real VLSI Projects</h2>
        <p className="section-description">
          From basic ALU synthesis to the flagship <strong>LAYRIX TinyCore RTL-to-GDSII Capstone</strong>. Build, simulate, synthesize, place, route, and tape out complete chip blocks.
        </p>
      </div>

      <div className="projects-grid">
        <div className="projects-sidebar">
          <span className="eyebrow">Select Project</span>
          <div className="project-menu-list">
            {projects.map((p) => {
              const isCompleted = completedProjects.has(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`project-menu-item ${selectedProjectId === p.id ? 'active' : ''} ${p.isFlagship ? 'flagship' : ''}`}
                  onClick={() => {
                    setSelectedProjectId(p.id)
                    setActiveTab('OVERVIEW')
                  }}
                >
                  <div className="p-menu-top">
                    {p.isFlagship && <span className="flagship-badge">⭐ FLAGSHIP CAPSTONE</span>}
                    {isCompleted && <span className="p-done-check">✓</span>}
                  </div>
                  <div className="p-menu-title">{p.title}</div>
                  <div className="p-menu-meta">
                    <span>{p.difficulty}</span> • <span>⏱ {p.estimatedTime}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="project-main-content">
          <div className="project-header-card">
            <div className="p-header-top">
              <span className={`diff-tag ${currentProj.difficulty.toLowerCase()}`}>{currentProj.difficulty}</span>
              <span className="p-time">⏱ Estimated Time: {currentProj.estimatedTime}</span>
              {completedProjects.has(currentProj.id) && (
                <span className="p-status-completed">✓ Project Completed</span>
              )}
            </div>

            <h3>{currentProj.title}</h3>
            <p className="p-subtitle">{currentProj.subtitle}</p>

            <div className="project-tab-bar">
              <button
                type="button"
                className={`p-tab ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
                onClick={() => setActiveTab('OVERVIEW')}
              >
                Project Overview
              </button>
              <button
                type="button"
                className={`p-tab ${activeTab === 'ARCHITECTURE' ? 'active' : ''}`}
                onClick={() => setActiveTab('ARCHITECTURE')}
              >
                Architecture & Block Diagram
              </button>
              <button
                type="button"
                className={`p-tab ${activeTab === 'STEPS' ? 'active' : ''}`}
                onClick={() => setActiveTab('STEPS')}
              >
                Implementation Steps
              </button>
              <button
                type="button"
                className={`p-tab ${activeTab === 'VERIFICATION' ? 'active' : ''}`}
                onClick={() => setActiveTab('VERIFICATION')}
              >
                Verification & Deliverables
              </button>
            </div>
          </div>

          <div className="project-body-card">
            {activeTab === 'OVERVIEW' && (
              <div className="p-tab-content">
                <div className="p-section">
                  <h4>Overview</h4>
                  <p>{currentProj.overview}</p>
                </div>

                <div className="p-section">
                  <h4>Problem Statement</h4>
                  <p>{currentProj.problemStatement}</p>
                </div>

                <div className="p-two-col">
                  <div className="p-section">
                    <h4>Learning Objectives</h4>
                    <ul>
                      {currentProj.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                  <div className="p-section">
                    <h4>Prerequisites</h4>
                    <ul>
                      {currentProj.prerequisites.map((pre, i) => <li key={i}>{pre}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="p-section">
                  <h4>Skills Learned</h4>
                  <div className="tool-tags">
                    {currentProj.skillsLearned.map((s) => <span key={s} className="tool-tag">{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ARCHITECTURE' && (
              <div className="p-tab-content">
                <div className="p-section">
                  <h4>System Architecture</h4>
                  <p>{currentProj.architectureText}</p>
                </div>

                <div className="p-section">
                  <h4>Block Diagram Representation</h4>
                  <pre className="block-diagram-box">{currentProj.blockDiagramText}</pre>
                </div>

                <div className="p-section">
                  <h4>Design Requirements & Specifications</h4>
                  <ul>
                    {currentProj.designRequirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>

                <div className="p-section">
                  <h4>Required Tools</h4>
                  <div className="tool-tags">
                    {currentProj.tools.map((t) => <span key={t} className="tool-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'STEPS' && (
              <div className="p-tab-content">
                <div className="p-section">
                  <h4>Step-by-Step Implementation Guide</h4>
                  <ol className="p-steps-list">
                    {currentProj.implementationSteps.map((step, i) => (
                      <li key={i}>
                        <strong>Step {i + 1}:</strong> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'VERIFICATION' && (
              <div className="p-tab-content">
                <div className="p-section">
                  <h4>Verification Plan</h4>
                  <ul>
                    {currentProj.verificationPlan.map((v, i) => <li key={i}>{v}</li>)}
                  </ul>
                </div>

                <div className="p-section">
                  <h4>Expected Outputs & Results</h4>
                  <ul>
                    {currentProj.expectedResults.map((r, i) => <li key={i}>✓ {r}</li>)}
                  </ul>
                </div>

                <div className="p-section portfolio-box">
                  <h4>Resume / Portfolio Description</h4>
                  <p className="portfolio-text">"{currentProj.portfolioDescription}"</p>
                </div>
              </div>
            )}

            <div className="project-action-footer">
              <button
                type="button"
                className={`button ${completedProjects.has(currentProj.id) ? 'secondary' : 'success'}`}
                onClick={() => toggleProjectComplete(currentProj.id)}
              >
                {completedProjects.has(currentProj.id) ? 'Unmark Project Complete' : 'Mark Project Complete ✓'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
