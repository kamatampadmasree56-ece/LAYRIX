import { useState } from 'react'

type TapeoutStage = {
  num: number
  title: string
  category: 'Front-End' | 'Back-End' | 'Signoff & Manufacturing'
  input: string
  process: string
  output: string
  mainConcern: string
  commonFailure: string
  tools: string[]
  whatHappensNext: string
  ifFailedFix: string
}

const tapeoutStages: TapeoutStage[] = [
  {
    num: 1,
    title: 'Product Specification',
    category: 'Front-End',
    input: 'Market requirements, feature requests, target power/performance envelope',
    process: 'Define system specs: throughput, clock speed, area limit, power budget, interface protocols',
    output: 'System Architecture Specification Document',
    mainConcern: 'Over-specifying performance or under-budgeting power',
    commonFailure: 'Unrealistic target frequency or impossible power envelope',
    tools: ['Confluence', 'DOORS', 'Python / Excel modeling'],
    whatHappensNext: 'Pass specs to architects to design system block hierarchy.',
    ifFailedFix: 'Renegotiate specs with system architects before writing any code.',
  },
  {
    num: 2,
    title: 'Architecture & Modeling',
    category: 'Front-End',
    input: 'System Architecture Specification',
    process: 'Design block diagram, instruction set (if CPU), bus structure, cache sizes, memory map',
    output: 'High-level C++/SystemC executable model',
    mainConcern: 'Latency bottlenecks and memory bandwidth constraints',
    commonFailure: 'Bus contention causes throughput starvation',
    tools: ['SystemC', 'Gem5', 'QEMU', 'MATLAB'],
    whatHappensNext: 'RTL designers implement the microarchitecture in Verilog/SystemVerilog.',
    ifFailedFix: 'Adjust cache sizes, bus widths, or pipeline depth in the high-level model.',
  },
  {
    num: 3,
    title: 'RTL Design',
    category: 'Front-End',
    input: 'Microarchitecture specification & C++ model',
    process: 'Write synthesizable Verilog/SystemVerilog hardware descriptions for all blocks',
    output: 'Synthesizable RTL source code (.v / .sv)',
    mainConcern: 'Writing non-synthesizable code or creating unintentional latches',
    commonFailure: 'Latch creation from incomplete if/case statements',
    tools: ['VS Code', 'Vim', 'SpyGlass Lint', 'Verator'],
    whatHappensNext: 'Verification team simulates RTL against testbenches.',
    ifFailedFix: 'Fix RTL syntax, eliminate latches, rewrite logic for better pipeline balance.',
  },
  {
    num: 4,
    title: 'Functional Verification',
    category: 'Front-End',
    input: 'RTL code + testbench stimulus + assertions',
    process: 'Run simulation, regression suites, formal verification, coverage collection',
    output: '100% Code & Functional Coverage Signoff',
    mainConcern: 'Undetected corner-case functional bugs',
    commonFailure: 'Deadlock in bus arbitration under heavy traffic',
    tools: ['Synopsys VCS', 'Cadence Xcelium', 'Siemens Questa', 'JasperGold (Formal)'],
    whatHappensNext: 'Proceed to Logic Synthesis once coverage reaches 100%.',
    ifFailedFix: 'Debug waveform in DVE/Verdi, fix RTL bug, add assertion, rerun regression.',
  },
  {
    num: 5,
    title: 'Logic Synthesis',
    category: 'Front-End',
    input: 'Clean RTL + Technology Library (.lib) + SDC constraints',
    process: 'Translate RTL to gate-level netlist, optimize Boolean logic, map to standard cells',
    output: 'Gate-Level Netlist (.v) + Pre-layout Area/Timing Reports',
    mainConcern: 'Negative setup slack (WNS < 0) or massive area explosion',
    commonFailure: 'Unrealistic SDC clock constraints causing synthesis timing failure',
    tools: ['Synopsys Design Compiler (DC)', 'Cadence Genus', 'Yosys'],
    whatHappensNext: 'Pass gate netlist to physical design for floorplanning.',
    ifFailedFix: 'Pipelining long logic paths in RTL, adjusting SDC constraints, or enabling compile_ultra.',
  },
  {
    num: 6,
    title: 'Floorplanning',
    category: 'Back-End',
    input: 'Gate-level netlist + Tech LEF + Macro LEFs',
    process: 'Set die size, core margins, aspect ratio, place memory macros and I/O pads',
    output: 'Floorplanned DEF file with macro locations',
    mainConcern: 'Macro placement creating routing congestion or blocking channels',
    commonFailure: 'Placing macros in core center blocking standard cell rows',
    tools: ['Cadence Innovus', 'Synopsys ICC2', 'OpenROAD'],
    whatHappensNext: 'Build power grid across the floorplan.',
    ifFailedFix: 'Reposition macros along core boundaries, increase channel spacing, or reduce utilization.',
  },
  {
    num: 7,
    title: 'Power Planning',
    category: 'Back-End',
    input: 'Floorplanned DEF + Power Budget',
    process: 'Create VDD/VSS power rings, horizontal/vertical power stripes, connect to row rails',
    output: 'Power Network Mesh on upper metal layers',
    mainConcern: 'High IR drop causing supply voltage dips under peak load',
    commonFailure: 'Insufficient power stripes causing > 10% VDD drop',
    tools: ['Cadence Innovus', 'Synopsys ICC2', 'Ansys RedHawk'],
    whatHappensNext: 'Standard cell placement inside core rows.',
    ifFailedFix: 'Add extra power stripes, widen metal widths, or add decap cells near hotspots.',
  },
  {
    num: 8,
    title: 'Standard Cell Placement',
    category: 'Back-End',
    input: 'Floorplan + Gate Netlist + Power Mesh',
    process: 'Global placement → Legalization → Detailed timing-driven placement',
    output: 'Placed DEF file (all cells assigned legal x,y coordinates)',
    mainConcern: 'Localized high cell density causing unroutable congestion',
    commonFailure: 'Cells piled up near macro corners creating red congestion spots',
    tools: ['Cadence Innovus', 'Synopsys ICC2', 'OpenROAD'],
    whatHappensNext: 'Clock Tree Synthesis (CTS) to distribute clock.',
    ifFailedFix: 'Apply placement bounds, add density screens, or enable timing-driven placement.',
  },
  {
    num: 9,
    title: 'Clock Tree Synthesis (CTS)',
    category: 'Back-End',
    input: 'Placed DEF + CTS Spec file (skew/latency targets)',
    process: 'Insert clock buffer trees to balance clock arrival times across all flip-flops',
    output: 'CTS DEF file + Balanced Clock Tree + Post-CTS STA report',
    mainConcern: 'Excessive clock skew or high clock tree dynamic power',
    commonFailure: 'Hold violations appearing on short paths post-CTS',
    tools: ['Cadence Innovus CTS', 'Synopsys Clock Tree Compiler'],
    whatHappensNext: 'Fix hold violations and proceed to Global Routing.',
    ifFailedFix: 'Insert delay buffers on short data paths, re-balance clock tree branches, or use useful skew.',
  },
  {
    num: 10,
    title: 'Global & Detailed Routing',
    category: 'Back-End',
    input: 'Placed DEF with CTS + Tech Routing Rules',
    process: 'Global routing (path planning) → Detailed routing (assign metal tracks & vias)',
    output: 'Fully Routed DEF file with all wires and vias',
    mainConcern: 'Unroutable nets, short circuits, or DRC violations',
    commonFailure: 'Metal shorts and spacing DRC errors due to local congestion',
    tools: ['Cadence Innovus Router (TritonRoute)', 'Synopsys ZRoute'],
    whatHappensNext: 'Extract parasitic RC values for post-route STA.',
    ifFailedFix: 'Rip-up and reroute, spread cells in congested regions, or route critical nets on higher layers.',
  },
  {
    num: 11,
    title: 'Parasitic RC Extraction',
    category: 'Back-End',
    input: 'Routed DEF + GDSII geometry + Process Tech File (.ict / .nxtgrd)',
    process: 'Extract exact 3D wire resistance and capacitance (coupling & ground)',
    output: 'SPEF (Standard Parasitic Exchange Format) file',
    mainConcern: 'High coupling capacitance causing crosstalk noise and extra delay',
    commonFailure: 'Long parallel wires creating massive crosstalk delay penalty',
    tools: ['Synopsys StarRC', 'Cadence Quantus QRC'],
    whatHappensNext: 'Run post-route Static Timing Analysis with real SPEF.',
    ifFailedFix: 'Insert shield wires, increase spacing between aggressor/victim nets, or resize drivers.',
  },
  {
    num: 12,
    title: 'Post-Route STA & ECO',
    category: 'Back-End',
    input: 'Routed Netlist + SPEF + Multi-Corner SDC',
    process: 'Perform final STA across all PVT corners. Run Engineering Change Orders (ECO) for timing',
    output: 'Clean STA Report (WNS ≥ 0, TNS = 0 across all corners)',
    mainConcern: 'Setup timing failures at worst-case slow corner',
    commonFailure: 'Negative slack on long inter-block routes',
    tools: ['Synopsys PrimeTime', 'Cadence Tempus'],
    whatHappensNext: 'Run Physical Verification (DRC & LVS).',
    ifFailedFix: 'Run Timing ECO: size up driver cells, insert buffers, or perform layer swap to faster metal.',
  },
  {
    num: 13,
    title: 'Design Rule Checking (DRC)',
    category: 'Signoff & Manufacturing',
    input: 'Streamed-out GDSII + Foundry Calibre DRC Deck',
    process: 'Verify geometry against hundreds of manufacturing lithography rules',
    output: 'DRC Clean Signoff Report (0 Violations)',
    mainConcern: 'Metal spacing, minimum area, via enclosure, and density rule errors',
    commonFailure: 'Metal density outside 30-70% range for CMP polishing',
    tools: ['Mentor Calibre DRC', 'Synopsys IC Validator', 'Cadence Pegasus'],
    whatHappensNext: 'Run Layout vs Schematic (LVS) matching.',
    ifFailedFix: 'Run Metal Fill insertion for density errors; manually edit layout or rerun detail router for spacing errors.',
  },
  {
    num: 14,
    title: 'Layout vs Schematic (LVS)',
    category: 'Signoff & Manufacturing',
    input: 'GDSII layout + Gate-Level Netlist',
    process: 'Extract circuit device topology from GDSII polygons and compare against netlist',
    output: 'LVS Clean Signoff Report (Layout Matches Schematic)',
    mainConcern: 'Mismatched connections, short circuits, or missing devices',
    commonFailure: 'Unconnected ground pin or short between VDD and signal line',
    tools: ['Mentor Calibre nmLVS', 'Synopsys IC Validator'],
    whatHappensNext: 'Check electrical and antenna rules.',
    ifFailedFix: 'Inspect Calibre RVE error highlights, trace disconnected nets, fix shorted metal polygons.',
  },
  {
    num: 15,
    title: 'Antenna & ERC Verification',
    category: 'Signoff & Manufacturing',
    input: 'GDSII layout + ERC Deck',
    process: 'Check antenna ratios (gate oxide breakdown risk) and electrical rules (floating gates)',
    output: 'Antenna & ERC Clean Signoff',
    mainConcern: 'Plasma charge accumulation on long metal wires during etching',
    commonFailure: 'Antenna ratio > 400:1 on thin gate oxide inputs',
    tools: ['Mentor Calibre PERC', 'Synopsys IC Validator'],
    whatHappensNext: 'Final IR Drop and Electromigration signoff.',
    ifFailedFix: 'Insert reverse-biased antenna diode near gate or jump routing to higher metal layer.',
  },
  {
    num: 16,
    title: 'IR Drop & Electromigration Signoff',
    category: 'Signoff & Manufacturing',
    input: 'GDSII + SPEF + Dynamic Activity VCD file',
    process: 'Simulate dynamic voltage drop during peak switching and current density on wires',
    output: 'IR Drop < 5% VDD Signoff + EM Clean Report',
    mainConcern: 'Voltage droop causing functional timing slowdown; high current eroding wires',
    commonFailure: 'IR drop hotspot in dense ALU block causing 80mV drop',
    tools: ['Ansys RedHawk', 'Cadence Voltus'],
    whatHappensNext: 'Tapeout signoff committee review.',
    ifFailedFix: 'Add decap cells (decoupling capacitors) near hotspot; widen power supply stripes.',
  },
  {
    num: 17,
    title: 'Tapeout Signoff Review',
    category: 'Signoff & Manufacturing',
    input: 'Signoff reports for STA, DRC, LVS, ERC, IR/EM, Power',
    process: 'Executive review by lead architects and physical design heads to approve tapeout',
    output: 'Signed Tapeout Authorization Form',
    mainConcern: 'Unchecked risk or unapproved timing waivers',
    commonFailure: 'Waiving a timing violation that later turns out to be real',
    tools: ['Signoff Checklist Portal', 'Jira Signoff Dashboard'],
    whatHappensNext: 'Export final GDSII/OASIS and send to foundry (Tape-In).',
    ifFailedFix: 'Do NOT tape out! Resolve all unapproved waivers and rerun verification.',
  },
  {
    num: 18,
    title: 'Mask Generation & Wafer Fab',
    category: 'Signoff & Manufacturing',
    input: 'GDSII / OASIS File handed to Foundry',
    process: 'Foundry generates 50–80 photolithographic masks. Process 300mm silicon wafers in fab',
    output: 'Manufactured Wafers containing hundreds of dies',
    mainConcern: 'Dust particles or lithography defects reducing wafer yield',
    commonFailure: 'Particle defect shorting a metal line on a die',
    tools: ['TSMC / Samsung / Intel Fab Process Line', 'ASML EUV Lithography Steppers'],
    whatHappensNext: 'Wafer probing and die slicing.',
    ifFailedFix: 'If yield is low: foundry tunes process parameters or design team prepares a B0 mask re-spin.',
  },
  {
    num: 19,
    title: 'Wafer Test & Packaging',
    category: 'Signoff & Manufacturing',
    input: 'Manufactured Wafers + ATPG Test Vectors',
    process: 'Wafer probe testing (E-test) → Slice wafer into dies → Package good dies in substrate',
    output: 'Packaged IC Chips ready for testing',
    mainConcern: 'Packaging damage or wire bonding failures',
    commonFailure: 'Defective die passing through due to insufficient ATPG coverage',
    tools: ['Teradyne / Advantest Automated Test Equipment (ATE)'],
    whatHappensNext: 'Deliver first silicon to lab for bring-up.',
    ifFailedFix: 'Improve ATPG fault coverage vectors for subsequent production runs.',
  },
  {
    num: 20,
    title: 'Silicon Bring-Up & Validation',
    category: 'Signoff & Manufacturing',
    input: 'First Silicon Samples + Evaluation Board',
    process: 'Power up chip in lab, verify clock/resets, boot firmware, run characterization suites',
    output: 'Production-Ready Commercial Silicon Chip',
    mainConcern: 'Post-silicon functional bug or unexpected timing failure',
    commonFailure: 'Chip fails to boot at cold temperature (-40°C)',
    tools: ['High-speed Oscilloscopes', 'Logic Analyzers', 'JTAG Debuggers', 'Thermal Chambers'],
    whatHappensNext: 'Mass production ramps up!',
    ifFailedFix: 'If critical bug found: design Metal ECO (metal-only mask change) or ECO re-spin.',
  },
]

export default function TapeoutPath() {
  const [expandedStageNum, setExpandedStageNum] = useState<number | null>(null)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL')

  const filteredStages = activeCategoryFilter === 'ALL'
    ? tapeoutStages
    : tapeoutStages.filter((s) => s.category === activeCategoryFilter)

  return (
    <section className="section tapeout-path-section" id="tapeout-path">
      <div className="section-heading">
        <p className="section-eyebrow">End-to-End Pipeline</p>
        <h2>Core Path to Tapeout & Silicon</h2>
        <p className="section-description">
          Follow the complete 20-stage journey from Product Specification to Silicon Bring-up. Examine inputs, processes, outputs, failure modes, and recovery strategies for every stage.
        </p>
      </div>

      <div className="tapeout-filter-bar">
        <button
          type="button"
          className={`button secondary small ${activeCategoryFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveCategoryFilter('ALL')}
        >
          All Stages (1-20)
        </button>
        <button
          type="button"
          className={`button secondary small ${activeCategoryFilter === 'Front-End' ? 'active' : ''}`}
          onClick={() => setActiveCategoryFilter('Front-End')}
        >
          Front-End Design
        </button>
        <button
          type="button"
          className={`button secondary small ${activeCategoryFilter === 'Back-End' ? 'active' : ''}`}
          onClick={() => setActiveCategoryFilter('Back-End')}
        >
          Back-End Physical Design
        </button>
        <button
          type="button"
          className={`button secondary small ${activeCategoryFilter === 'Signoff & Manufacturing' ? 'active' : ''}`}
          onClick={() => setActiveCategoryFilter('Signoff & Manufacturing')}
        >
          Signoff & Manufacturing
        </button>
      </div>

      <div className="tapeout-pipeline">
        {filteredStages.map((stage) => {
          const isExpanded = expandedStageNum === stage.num
          return (
            <div key={stage.num} className={`tapeout-node ${isExpanded ? 'expanded' : ''}`}>
              <button
                type="button"
                className="tapeout-node-header"
                onClick={() => setExpandedStageNum(isExpanded ? null : stage.num)}
              >
                <div className="node-step-num">Step {stage.num}</div>
                <div className="node-info">
                  <h3>{stage.title}</h3>
                  <span className="node-cat-badge">{stage.category}</span>
                </div>
                <div className="node-expand-icon">{isExpanded ? '▲' : '▼'}</div>
              </button>

              {isExpanded && (
                <div className="tapeout-node-body">
                  <div className="tapeout-grid-details">
                    <div className="t-detail-box">
                      <strong>📥 INPUT:</strong>
                      <p>{stage.input}</p>
                    </div>
                    <div className="t-detail-box">
                      <strong>⚙️ PROCESS:</strong>
                      <p>{stage.process}</p>
                    </div>
                    <div className="t-detail-box">
                      <strong>📤 OUTPUT:</strong>
                      <p className="highlight-text">{stage.output}</p>
                    </div>
                    <div className="t-detail-box">
                      <strong>🎯 MAIN ENGINEERING CONCERN:</strong>
                      <p>{stage.mainConcern}</p>
                    </div>
                  </div>

                  <div className="t-tools-row">
                    <strong>Industry Tools Used:</strong>
                    <div className="tool-tags">
                      {stage.tools.map((t) => <span key={t} className="tool-tag">{t}</span>)}
                    </div>
                  </div>

                  <div className="t-next-step">
                    <strong>What Happens Next?</strong> {stage.whatHappensNext}
                  </div>

                  <div className="t-failure-accordion">
                    <div className="failure-header">
                      ⚠ What If This Stage Fails?
                    </div>
                    <div className="failure-content">
                      <p><strong>Common Failure:</strong> {stage.commonFailure}</p>
                      <p><strong>Recovery Strategy:</strong> {stage.ifFailedFix}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
