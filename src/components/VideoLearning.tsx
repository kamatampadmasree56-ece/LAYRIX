import { useState } from 'react'

type VideoTopic = {
  category: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  learningOutcome: string
  relatedLevel: string
  relatedPillar: string
  notes: string
  hasVideo: boolean
}

const videoTopics: VideoTopic[] = [
  {
    category: 'Digital Design',
    title: 'Logic Gates and Boolean Algebra',
    description: 'Visual walkthrough of AND, OR, NOT, NAND, NOR, XOR gates with truth tables and CMOS implementation.',
    difficulty: 'Beginner',
    duration: '15–20 min',
    learningOutcome: 'Understand all basic gates, write Boolean expressions, and apply De Morgan\'s theorem.',
    relatedLevel: 'Level 1',
    relatedPillar: 'Digital Design',
    hasVideo: false,
    notes: `Logic gates are the atoms of digital design. Here is what you must understand:

AND Gate: Y = A·B. Output is HIGH only when BOTH inputs are HIGH. In CMOS: two NMOS in series (pull-down) and two PMOS in parallel (pull-up). When both A and B are HIGH, both NMOS conduct → output connects to GND → LOW output. Wait — that's NAND. For AND, add an inverter after NAND. Most technology libraries implement AND using NAND + INV.

OR Gate: Y = A+B. Output is HIGH when ANY input is HIGH. 

NAND Gate: Y = (A·B)'. Universal gate — can implement any logic. Preferred in CMOS because the pull-down stack (NMOS in series) is more efficient than pull-up (PMOS in series). PMOS is ~2× slower than NMOS, so stacking PMOS (as in NOR pull-up) creates slower gates.

De Morgan's Theorem:
  (A·B)' = A' + B'    [NAND = OR of complements]
  (A+B)' = A' · B'    [NOR = AND of complements]

This explains why NAND/NOR gates are universal — any AND/OR can be expressed using them with De Morgan's.

Practice: Implement Y = AB + CD using only NAND gates.
  Step 1: AB = NAND(A,B) inverted = NAND(NAND(A,B), NAND(A,B))
  Step 2: Or use: Y = NAND(NAND(A,B), NAND(C,D)) — this is AB+CD via De Morgan's.`,
  },
  {
    category: 'Digital Design',
    title: 'Flip-Flops and Timing',
    description: 'D flip-flop operation, setup time, hold time, clock-to-Q delay, and timing violation consequences.',
    difficulty: 'Intermediate',
    duration: '20–25 min',
    learningOutcome: 'Calculate timing constraints for flip-flop paths and identify setup/hold violations.',
    relatedLevel: 'Level 4',
    relatedPillar: 'Digital Design',
    hasVideo: false,
    notes: `The D flip-flop is the most important cell in digital design. Everything sequential — registers, counters, FSMs, pipelines — uses D flip-flops.

How a D flip-flop works:
At the rising edge of the clock, the flip-flop samples D and transfers it to Q. Between clock edges, Q holds its value regardless of D changes.

Critical Timing Parameters (from the .lib characterization):
• tsu (setup time): D must be stable at LEAST tsu before the clock edge. Typical: 30–100ps in 28nm.
• th (hold time): D must remain stable at LEAST th after the clock edge. Typical: 10–50ps.
• tCQ (clock-to-Q delay): After the clock edge, Q becomes valid after tCQ. Typical: 100–200ps.

Timing Path Analysis:
For a path from FF1 (launch) → combinational logic → FF2 (capture):

Data Arrival Time = tCQ(FF1) + t_logic + t_wire
Data Required Time (setup) = T_clock − tsu

Setup Slack = Required − Arrival = (T_clk − tsu) − (tCQ + t_logic + t_wire)
• Positive slack: Path passes. More slack = more timing margin.
• Negative slack: VIOLATION. Logic is too slow for the clock period.

For hold:
Hold Required Time = thold
Hold Slack = (tCQ + t_logic) − thold
• Negative hold slack: Data arrives too early → metastability risk.

Why hold violations are dangerous: Hold violations occur even when the design is running at the correct clock frequency. They cause the capture flip-flop to capture incorrect data on EVERY cycle, not just under stress.`,
  },
  {
    category: 'CMOS',
    title: 'CMOS Inverter Deep Dive',
    description: 'NMOS/PMOS transistor operation, CMOS inverter DC characteristics, switching behavior, and power.',
    difficulty: 'Intermediate',
    duration: '20–25 min',
    learningOutcome: 'Analyze CMOS inverter operation, explain switching power, and understand noise margins.',
    relatedLevel: 'Level 6',
    relatedPillar: 'CMOS & Circuit Fundamentals',
    hasVideo: false,
    notes: `The CMOS inverter: the simplest, most important circuit in chip design.

Circuit: PMOS source → VDD, drain → output. NMOS drain → output, source → GND.
Both gates connected to input Vin.

When Vin = 0 (LOW):
  NMOS Vgs = 0 < Vth → NMOS OFF (no conduction to GND)
  PMOS Vgs = 0 - VDD = -VDD < Vtp → PMOS ON (conducting from VDD)
  Output: Connected to VDD through PMOS → Vout = VDD (HIGH)

When Vin = VDD (HIGH):
  NMOS Vgs = VDD > Vth → NMOS ON (conducting to GND)
  PMOS Vgs = VDD - VDD = 0 > Vtp → PMOS OFF
  Output: Connected to GND through NMOS → Vout = 0 (LOW)

Key Properties:
1. Complementary operation: Only one transistor ON at a time (in static state)
2. No DC current path from VDD to GND in static state → no static power (ideally)
3. During switching: Brief moment when BOTH are ON → short-circuit current → short-circuit power

VTC (Voltage Transfer Characteristic): Gain > 1 in the transition region ensures sharp switching.

Noise Margins:
NM_H = VOH - VIH = VDD - (VDD - Vtp) ≈ |Vtp|
NM_L = VIL - VOL = Vtn - 0 ≈ Vtn
Typical 28nm: Vtn ≈ Vtp ≈ 0.4V, NM ≈ 0.4V with VDD=1.0V

Sizing the CMOS Inverter:
For equal rise/fall time: Wp/Wn ≈ μn/μp ≈ 2 (PMOS is ~2× slower than NMOS)
Increasing width: reduces resistance → faster but more area/power.`,
  },
  {
    category: 'Verilog',
    title: 'Synthesizable Verilog RTL Patterns',
    description: 'Common RTL patterns: registers, counters, FSMs, MUXes, arithmetic — written for synthesis.',
    difficulty: 'Intermediate',
    duration: '25–30 min',
    learningOutcome: 'Write clean, synthesizable Verilog for the most common digital design patterns.',
    relatedLevel: 'Level 8-9',
    relatedPillar: 'RTL & Verilog',
    hasVideo: false,
    notes: `Critical RTL patterns every designer must know:

1. REGISTER (D Flip-Flop with reset):
always_ff @(posedge clk or posedge rst) begin
  if (rst) q <= '0;
  else     q <= d;
end
→ Synthesizes to: DFF with async reset. Use negedge for falling-edge trigger.

2. SYNCHRONOUS COUNTER:
always_ff @(posedge clk) begin
  if (rst)   count <= '0;
  else       count <= count + 1'b1;
end
→ Synthesizes to: flip-flops + incrementer (adder).

3. ENABLE REGISTER (Holds value when enable=0):
always_ff @(posedge clk) begin
  if (rst)     q <= '0;
  else if (en) q <= d;
  // No else — q holds when en=0. Synthesizes to: DFF with enable mux.
end

4. FSM (Two-block style — recommended):
typedef enum logic [1:0] {IDLE, WAIT, ACTIVE} state_t;
state_t state, next_state;

always_ff @(posedge clk)          // State register
  state <= (rst) ? IDLE : next_state;

always_comb begin                  // Next-state + output
  next_state = state;              // DEFAULT: stay in current state
  output_signal = '0;             // DEFAULT: inactive
  case (state)
    IDLE:   if (start) next_state = ACTIVE;
    ACTIVE: begin output_signal = '1; if (done) next_state = IDLE; end
  endcase
end

CRITICAL RULE: Always provide a default assignment in always_comb to avoid LATCHES.

5. AVOIDING LATCHES:
// BAD — creates latch:
always_comb begin
  if (sel) y = a;  // No else → y holds when sel=0 → LATCH
end

// GOOD — no latch:
always_comb begin
  y = b;           // Default assignment
  if (sel) y = a;  // Override when sel=1
end`,
  },
  {
    category: 'RTL',
    title: 'RTL Design for Performance',
    description: 'Writing RTL that targets high clock frequency — pipelining, critical path optimization, and synthesis-friendly structures.',
    difficulty: 'Advanced',
    duration: '25–30 min',
    learningOutcome: 'Design RTL structures that enable timing closure at high frequencies.',
    relatedLevel: 'Level 9-11',
    relatedPillar: 'RTL & Verilog',
    hasVideo: false,
    notes: `Timing closure starts at RTL. Here is how to write timing-friendly RTL:

1. PIPELINING: Break long combinational paths with pipeline registers.
// Slow (single-cycle): 5ns critical path
always_ff @(posedge clk) result <= a * b + c * d;

// Fast (2-cycle pipelined): 2.5ns critical path per stage
always_ff @(posedge clk) begin
  pipe1 <= a * b;
  pipe2 <= c * d;
end
always_ff @(posedge clk) result <= pipe1 + pipe2;

2. ENCODING: For FSMs, binary encoding is area-efficient. One-hot is faster for large FSMs.

3. RESOURCE SHARING PENALTY: 
// This looks simple but creates a large multiplexer + adder:
always_comb y = sel ? (a + b) : (c + d);
// Better: pre-select inputs, then add:
always_comb begin
  add_a = sel ? a : c;
  add_b = sel ? b : d;
  y = add_a + add_b;
end

4. CRITICAL PATH AWARENESS: 
// Long carry chain = slow:
assign sum = a + b + c + d;  // 4-operand addition: long carry propagation

// Better: tree addition (log2 depth):
logic [N:0] tmp;
assign tmp = a + b;
assign sum = tmp + c + d;  // Or use carry-save adder structures

5. RETIMING: Synthesis tools can move registers across combinational logic. Help by writing RTL with pipeline-friendly structure (registers at natural stage boundaries).`,
  },
  {
    category: 'Synthesis',
    title: 'Understanding Synthesis Reports',
    description: 'How to read synthesis timing, area, and power reports. Identifying critical paths, WNS, TNS, and cell counts.',
    difficulty: 'Intermediate',
    duration: '20 min',
    learningOutcome: 'Interpret synthesis output reports and diagnose timing and area issues.',
    relatedLevel: 'Level 11-12',
    relatedPillar: 'Synthesis & Logic Optimization',
    hasVideo: false,
    notes: `Synthesis generates three key reports:

1. TIMING REPORT:
The timing report shows the critical (worst) path. Key terms:
• Startpoint: The launch flip-flop (or input port)
• Endpoint: The capture flip-flop (or output port)
• Data arrival time: When data arrives at capture flip-flop (sum of all delays)
• Data required time: Latest time data can arrive (clock period - tsu)
• Slack: Required - Arrival. NEGATIVE = VIOLATION.

Sample timing report:
  Path: FF_A/Q → AND2/A → XOR3/B → FF_B/D
  Cell  Arc         Delay   Arrival
  FF_A  CLK→Q       0.15    0.15
  wire               0.08    0.23
  AND2  A→Y         0.42    0.65
  wire               0.15    0.80
  XOR3  B→Y         0.68    1.48
  wire               0.22    1.70
  FF_B  setup        ---    (1.70 arrival)
  Required (2.0ns - 0.05ns setup) = 1.95ns
  SLACK = 1.95 - 1.70 = +0.25ns ✓

2. AREA REPORT:
  Combinational area:   12,450 units
  Sequential area:       8,320 units
  Total area:           20,770 units
  
  Cells with most area: DFF_X1 × 250, NAND2_X1 × 180, MUX2_X1 × 95

3. POWER REPORT:
  Leakage power:   0.42 mW
  Dynamic power:   1.85 mW
  Total power:     2.27 mW
  
  Top power consumers: Clock tree (35%), Register files (25%), Datapath (40%)`,
  },
  {
    category: 'STA',
    title: 'Static Timing Analysis Fundamentals',
    description: 'Timing path tracing, slack calculation, setup and hold analysis, and multi-corner STA.',
    difficulty: 'Intermediate',
    duration: '30 min',
    learningOutcome: 'Trace any timing path, calculate slack, identify and categorize timing violations.',
    relatedLevel: 'Level 13',
    relatedPillar: 'Timing, Verification & Signoff',
    hasVideo: false,
    notes: `STA is exhaustive timing analysis — every path is checked without simulation.

TIMING PATH TYPES:
1. FF-to-FF: Most common. Launch FF → logic → capture FF.
2. Input-to-FF: Input port → logic → capture FF.
3. FF-to-Output: Launch FF → logic → output port.
4. Input-to-Output: Combinational-only path.

MULTI-CORNER STA:
Chips must work across all process, voltage, temperature variations.

For SETUP (worst case = slowest logic):
  Worst corner: SS (slow-slow process), low VDD, high temperature (hot)
  → Transistors are slow → longer delays → harder to meet setup

For HOLD (worst case = fastest logic): 
  Worst corner: FF (fast-fast process), high VDD, cold temperature
  → Transistors are fast → data arrives very early → hard to meet hold

OCV (On-Chip Variation):
Real chips have variation within a single die. Launch path may be faster, capture path slower (or vice versa). STA accounts for this with derate factors:
  set_timing_derate -early 0.97  # Hold: cells run 3% fast
  set_timing_derate -late  1.03  # Setup: cells run 3% slow

CLOCK UNCERTAINTY:
Models PLL jitter, OCV uncertainty, clock skew uncertainty:
  set_clock_uncertainty -setup 0.1 [get_clocks CLK]
  set_clock_uncertainty -hold  0.05 [get_clocks CLK]

This reduces available timing margin by 100ps (setup) and 50ps (hold).`,
  },
  {
    category: 'Floorplanning',
    title: 'Floorplanning Strategy and Utilization',
    description: 'Die sizing, core utilization, macro placement strategy, and power planning fundamentals.',
    difficulty: 'Intermediate',
    duration: '20 min',
    learningOutcome: 'Plan a chip floorplan, calculate utilization, and place macros strategically.',
    relatedLevel: 'Level 14',
    relatedPillar: 'Physical Design',
    hasVideo: false,
    notes: `Floorplanning is art and science. Here are the key principles:

STEP 1: DEFINE DIE AND CORE SIZE
  - Determine cell area from synthesis reports
  - Target utilization: 65-75% for typical designs
  - Core Area = Cell Area / Utilization
  - Die Area = Core Area + I/O ring area + margins
  
  Example: Cell area = 500,000 μm², target util = 70%
    Core = 500,000 / 0.70 = 714,286 μm²
    Core dimensions: ~850 × 840 μm (nearly square)
    Die with 50μm margin each side: 950 × 940 μm

STEP 2: PLACE MACROS
  Rule 1: Place macros first — they define the remaining standard cell area.
  Rule 2: Align macros to standard cell row boundaries.
  Rule 3: Leave routing channels between macros.
  Rule 4: Place macros near connected I/O pins.
  Rule 5: Consider timing — macros driving critical paths should be near their loads.

  Bad macro placement: Macros in the center → splits core into isolated islands → routing nightmare.
  Good macro placement: Macros along edges or corners → large continuous standard cell area in center.

STEP 3: POWER PLANNING
  Rings: VDD and VSS rings around core perimeter (2-3 metal layers)
  Stripes: VDD/VSS horizontal stripes every 50-100μm across core
  Rails: M1/M2 rails in standard cell rows
  
  IR Drop calculation:
    R_stripe = ρ × L / (W × h) (sheet resistance × length / width)
    ΔV = I × R_stripe
    Requirement: ΔV < 5% × VDD (e.g., < 50mV for VDD=1.0V)`,
  },
  {
    category: 'Placement',
    title: 'Standard Cell Placement and Timing',
    description: 'Global placement, legalization, timing-driven placement, density, and congestion concepts.',
    difficulty: 'Intermediate',
    duration: '20 min',
    learningOutcome: 'Understand the placement flow, interpret congestion maps, and know how placement affects timing.',
    relatedLevel: 'Level 15',
    relatedPillar: 'Physical Design',
    hasVideo: false,
    notes: `Placement is where cells get their physical coordinates.

PLACEMENT FLOW:
1. Global Placement (GP): 
   Algorithm: Analytical (force-directed) or partition-based
   Goal: Minimize total wirelength (HPWL)
   State: Cells may overlap after GP

2. Legalization:
   Move cells to nearest legal positions (no overlap, aligned to rows)
   Algorithms: Abacus, Tetris, Hungarian method
   Constraint: Don't degrade GP wirelength too much

3. Detailed Placement (DP):
   Local cell swapping and shifting to improve timing
   Operations: Single-row optimization, pair-swapping, reordering

TIMING-DRIVEN PLACEMENT:
Net weights: Critical nets get high weight → cells placed closer.
Buffer planning: Estimate where buffers will be needed → reserve space.
Impact: 20-30% timing improvement vs non-timing-driven placement.

DENSITY AND CONGESTION:
Density = (cell area in tile) / (tile area)
High density tiles → routing congestion → impossible routing

Congestion map interpretation:
  Green: OK (demand < supply)
  Yellow: Warning (demand ≈ supply)
  Red: Congested (demand > supply → routing will fail)

Fixes:
  Spread cells to lower-density regions
  Reduce local utilization
  Add feedthrough routing to bypass congested areas

PLACEMENT IMPACT ON TIMING:
Pre-route timing uses estimated wire delays.
Wire delay ≈ k × HPWL (k depends on layer and width)
For critical paths: minimize HPWL by placing connected cells close.`,
  },
  {
    category: 'CTS',
    title: 'Clock Tree Synthesis In Practice',
    description: 'How CTS builds the clock tree, skew/latency targets, post-CTS hold fixing, and clock tree power.',
    difficulty: 'Advanced',
    duration: '25 min',
    learningOutcome: 'Set up CTS specs, understand post-CTS timing changes, and know how to fix hold violations.',
    relatedLevel: 'Level 16',
    relatedPillar: 'Physical Design',
    hasVideo: false,
    notes: `Clock tree synthesis is critical. Here's what happens:

CTS INPUT SPECIFICATION (CTS Spec):
  Max transition: 0.1ns (clock edges must be sharp)
  Max capacitance: 0.2pF per buffer
  Max fanout: 16 (each buffer drives at most 16 loads)
  Skew target: < 50ps (local skew between related flip-flops)
  Latency target: < 1.5ns (clock source to all flip-flops)

CTS ALGORITHM:
1. Identify clock source(s)
2. Cluster flip-flops by location
3. Insert buffers to create H-tree or mesh structure
4. Balance paths to equalize latency → minimize skew
5. Optimize transition times and capacitance

CLOCK TREE BUFFER TYPES:
  Clock buffers: Symmetric rise/fall → balanced drive strength
  Clock inverters: Often used in pairs → net delay similar to buffers
  ICG (Integrated Clock Gate): Enables clock gating for power

POST-CTS TIMING CHANGES:
  Pre-CTS: Ideal clock (zero latency, zero skew)
  Post-CTS: Real clock (adds latency, introduces skew, may flip some slacks)

HOLD FIXING (CRITICAL after CTS):
  After CTS, many hold violations appear on short paths.
  Short paths (few logic levels) now: data arrives fast, clock may arrive late.
  Fix: Insert delay buffers (BUF_X1 or DELAY cells) on short paths.
  
  Key: Fix hold BEFORE routing. Adding cells post-route is expensive and may cause DRC.

CLOCK TREE POWER:
  Clock is the biggest single power consumer (25-40% of dynamic power).
  Reducing: Clock gating (save power when block idle), mesh topology (reduce buffers).

USEFUL SKEW:
  Advanced technique: Intentionally delay clock to some capture flops.
  Result: Relaxes setup (data has more time) on the worst paths.
  Risk: Worsens hold on other paths. Must be managed carefully.`,
  },
  {
    category: 'Routing',
    title: 'Routing Concepts and Congestion Fix',
    description: 'Global vs detailed routing, metal layer strategy, via optimization, and congestion reduction.',
    difficulty: 'Advanced',
    duration: '25 min',
    learningOutcome: 'Understand the routing flow, diagnose routing congestion, and apply fixes.',
    relatedLevel: 'Level 17',
    relatedPillar: 'Physical Design',
    hasVideo: false,
    notes: `Routing connects placed cells with metal wires. Here is the complete picture:

ROUTING FLOW:
1. Global Routing: Assign each net to routing tiles (grid cells). Check for congestion.
2. Track Assignment: Assign nets to specific tracks within tiles.
3. Detail Routing: Route exact wire paths respecting DRC. Via insertion.
4. Search and Repair: Fix DRC violations iteratively.

METAL LAYER STACK (typical 28nm):
  M1: Horizontal, pitch 90nm, local connections
  M2: Vertical, pitch 90nm, local routing
  M3: Horizontal, pitch 120nm
  M4: Vertical, pitch 120nm
  M5-M6: Clock and power, pitch 200nm
  M7-M9: Power buses, global signals, pitch 400-800nm

ROUTING RULES:
  • M1 is preferred for standard cell internal routing (VDD/VSS rails)
  • M2-M3: Short signal connections
  • M4+: Long horizontal runs, timing-critical nets
  • Clock: M4-M6 (lower resistance, larger pitch)
  • Power: M7-M9 (very wide, very low resistance)

CONGESTION ANALYSIS:
  Routing congestion = nets needing to cross a tile / routing tracks available
  If > 1.0: OVERFLOW = unroutable

Fix Strategies:
  1. Spread cells (reduce density in congested tile)
  2. Move macros (open routing channels)  
  3. Add routing tracks (change layer assignment)
  4. ECO: Replace wide cells with narrower variants
  5. Physical synthesis: Let tool restructure logic to reduce wiring

POST-ROUTE PARASITICS:
  After routing, parasitic extraction (StarRC, QRC) measures:
    R = ρ × L / (W × t)  [wire resistance]
    C = ε × W × L / d    [wire capacitance + coupling]
  These real values replace the estimated values used during placement/CTS.
  Post-route STA may show new violations not seen before routing.`,
  },
  {
    category: 'Physical Verification',
    title: 'DRC, LVS, and Antenna Checks',
    description: 'Physical verification flow: DRC rules, LVS methodology, antenna effect, and ERC concepts.',
    difficulty: 'Advanced',
    duration: '20 min',
    learningOutcome: 'Understand DRC rule categories, LVS debugging, and antenna violation fixes.',
    relatedLevel: 'Level 18',
    relatedPillar: 'Timing, Verification & Signoff',
    hasVideo: false,
    notes: `Physical verification is the gating step before tapeout. NOTHING ships with DRC or LVS errors.

DRC (DESIGN RULE CHECK):
Rules come from the foundry technology file (DRC deck, run in Calibre).

Common DRC Rule Types:
  Minimum width: Metal must be ≥ min_width (e.g., M1 ≥ 0.05μm)
  Minimum spacing: Metals must be ≥ min_space apart
  Enclosure: Via must be enclosed by metal by ≥ enc_amount
  Density: Metal density per unit area must be 30-70% (for CMP uniformity)
  Antenna ratio: See below

Reading DRC results:
  DRC error: "M2 space error: 0.032um (min: 0.040um)"
  Location: (x=123.5μm, y=456.2μm)
  Layer: Metal2
  Fix: Move one wire by 0.008μm or use a different routing track.

LVS (LAYOUT vs SCHEMATIC):
Compares: Layout netlist (extracted from GDSII) vs Reference netlist (from synthesis)
Must match: Every device, every connection, every net.

LVS Error Types:
  "Net DATA_IN in layout connects to VDD" → short circuit error
  "Device M1_FF missing in layout" → device not found
  "Node 'Q_OUT' has 3 connections in layout, 2 in schematic" → extra connection

LVS Debugging:
  1. Export layout SPICE from Calibre
  2. Compare with synthesis netlist manually
  3. Common causes: incorrect via connections, accidental shorts, missing nets

ANTENNA EFFECT:
During metal etch, long metal lines accumulate charge.
This charge can damage the gate oxide of connected transistors.

Antenna Ratio = (Metal area connected to gate) / (Gate oxide area)
Limit: typically 400:1 (foundry dependent)

Detection: Calibre antenna checks flag violations.
Fix: 
  Method 1: Add reverse-biased diode near the gate → bleeds charge safely
  Method 2: "Jump" to higher metal layer earlier → reduces effective antenna length on lower layer`,
  },
  {
    category: 'Tapeout',
    title: 'From GDSII to Silicon — The Tapeout Process',
    description: 'What happens after GDSII is delivered: mask making, wafer fabrication, testing, and bring-up.',
    difficulty: 'Intermediate',
    duration: '20 min',
    learningOutcome: 'Understand the complete post-tapeout manufacturing and validation flow.',
    relatedLevel: 'Level 21',
    relatedPillar: 'Timing, Verification & Signoff',
    hasVideo: false,
    notes: `Tapeout is just the beginning. Here is what happens next:

TAPEOUT PACKAGE (what you deliver to foundry):
  • GDSII file (all layout layers, compressed, can be 10s of GB)
  • LEF/DEF (design exchange format files)
  • LVS netlist (CDL format)
  • Timing constraints (SDC)
  • ATPG test patterns (for manufacturing test)
  • Fill GDS (density fill patterns)

MASK MANUFACTURING (1-2 weeks):
  Foundry converts GDSII to photolithographic masks.
  Each layer = one mask.
  28nm chip: ~50 masks. 7nm chip: 80+ masks.
  EUV (Extreme UV) lithography used below 7nm.
  Mask cost: $1M–$8M for leading-edge nodes.

WAFER FABRICATION (6-12 weeks):
  Sequence of: oxidation → deposition → lithography → etch → implant
  Repeated for every layer.
  300mm wafers processed in batches.
  Temperature, pressure, chemical composition controlled to nm precision.

WAFER TEST:
  After fabrication, each die is probed while still on the wafer.
  Dies that fail are marked (inked or digitally mapped).
  Yield = (good dies) / (total dies)

DICING AND PACKAGING:
  Wafer is diced (sawed) into individual dies.
  Good dies are attached to package substrates.
  Bond wires or solder bumps (flip-chip) connect die to package.
  Epoxy molding protects the die.

FINAL TEST AND BURN-IN:
  Packaged chips are tested at multiple temperatures.
  Burn-in: Stress at elevated temp/voltage to accelerate early failures.

SILICON BRING-UP:
  First silicon from a new design arrives in the lab.
  Engineers: Power on, check voltages, run simple patterns, boot up.
  Common bring-up issues: Power supply sequences, clock brings up, GPIO configuration, boot loader.
  Post-silicon debug uses oscilloscopes, logic analyzers, internal scan chains.`,
  },
]

const categories = ['All', ...Array.from(new Set(videoTopics.map((t) => t.category)))]

const difficultyColor: Record<string, string> = {
  Beginner: '#22C55E',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
}

export default function VideoLearning() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  const filtered = activeCategory === 'All'
    ? videoTopics
    : videoTopics.filter((t) => t.category === activeCategory)

  return (
    <section className="section video-learning-section" id="video-learning">
      <div className="section-heading">
        <p className="section-eyebrow">Video Learning & Written Notes</p>
        <h2>Visual Explanations for Core VLSI Topics</h2>
        <p className="section-description">
          Organized by topic area. Each card includes learning outcomes, difficulty, and comprehensive written notes so the platform is fully useful even without external video resources.
        </p>
      </div>

      <div className="video-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="video-topics-grid">
        {filtered.map((topic) => (
          <div key={`${topic.category}-${topic.title}`} className="video-topic-card">
            <div className="video-topic-header">
              <div className="video-topic-meta">
                <span className="video-category-badge">{topic.category}</span>
                <span className="video-difficulty-badge" style={{ background: difficultyColor[topic.difficulty] }}>
                  {topic.difficulty}
                </span>
                <span className="video-duration">⏱ {topic.duration}</span>
              </div>
              <h3>{topic.title}</h3>
              <p className="video-topic-desc">{topic.description}</p>
            </div>

            <div className="video-player-area">
              {topic.hasVideo ? (
                <div className="video-embed-placeholder">
                  <span>▶ Video available</span>
                </div>
              ) : (
                <div className="video-coming-soon">
                  <div className="coming-soon-icon">📺</div>
                  <strong>Video Resource Coming Soon</strong>
                  <p>Written notes available below. Full video tutorial in production.</p>
                </div>
              )}
            </div>

            <div className="video-outcome">
              <strong>After this topic you will:</strong> {topic.learningOutcome}
            </div>

            <div className="video-tags">
              <span className="video-tag">📚 {topic.relatedLevel}</span>
              <span className="video-tag">🏛 {topic.relatedPillar}</span>
            </div>

            <button
              type="button"
              className="notes-toggle-btn"
              onClick={() => setExpandedTopic(expandedTopic === topic.title ? null : topic.title)}
              aria-expanded={expandedTopic === topic.title}
            >
              {expandedTopic === topic.title ? '▲ Hide Written Notes' : '▼ Show Written Notes'}
            </button>

            {expandedTopic === topic.title && (
              <div className="written-notes">
                <div className="notes-label">Written Study Notes</div>
                <pre className="notes-content">{topic.notes}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
