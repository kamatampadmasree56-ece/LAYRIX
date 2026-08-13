import { useState } from 'react'

type Level = {
  id: number
  title: string
  subtitle: string
  why: string
  objectives: string[]
  concepts: string[]
  explanation: string
  vlsiRelevance: string
  formulas?: string[]
  example: string
  commonMistakes: string[]
  practiceQuestions: { q: string; a: string }[]
  checklist: string[]
  nextStep: string
  color: string
}

const levels: Level[] = [
  {
    id: 0,
    title: 'LEVEL 0',
    subtitle: 'VLSI & IC Fundamentals',
    color: '#2563EB',
    why: 'Before designing chips, you must understand what VLSI is, what an IC does, and why physical design is needed. This is your foundation.',
    objectives: [
      'Define VLSI and explain its significance in modern electronics',
      'Understand the IC evolution from SSI to ULSI',
      'Distinguish ASIC vs FPGA, front-end vs back-end design',
      'Trace the RTL-to-GDSII flow at a high level',
      'Understand what tapeout means',
    ],
    concepts: ['VLSI', 'Integrated Circuit', "Moore's Law", 'ASIC', 'FPGA', 'Front-end', 'Back-end', 'RTL', 'GDSII', 'Tapeout'],
    explanation: `VLSI (Very Large Scale Integration) refers to creating integrated circuits by combining thousands to billions of transistors on a single chip. Modern chips like CPUs, GPUs, and mobile SoCs all use VLSI technology.

An Integrated Circuit (IC) is a miniaturized electronic circuit manufactured on a semiconductor material — usually silicon. ICs went from having 10s of transistors (SSI — Small Scale Integration) in the 1960s to billions of transistors (ULSI — Ultra Large Scale Integration) in modern chips.

Moore's Law (1965): Gordon Moore observed that the number of transistors on a chip doubles approximately every two years. While physical limits are challenging this, it drove decades of semiconductor progress.

ASIC vs FPGA: An ASIC (Application-Specific IC) is designed for one specific purpose — optimized for performance, power, area. An FPGA (Field-Programmable Gate Array) can be reprogrammed after manufacture — flexible but less optimal.

Front-end design covers RTL coding, functional verification, and synthesis. Back-end (physical) design covers floorplanning, placement, CTS, routing, and physical verification.

The RTL-to-GDSII flow is the complete design process from behavioral description (RTL code) to the final geometric layout file (GDSII) that foundries use to manufacture silicon wafers.

Tapeout is the moment when the final GDSII is handed to the foundry. It is analogous to "going to print" — once taped out, manufacturing begins and changes require another cycle.`,
    vlsiRelevance: 'Every concept in VLSI physical design builds on understanding what chips are, why they need physical implementation, and what the end goal (tapeout) is.',
    example: 'An ARM Cortex-A processor in your smartphone is an ASIC designed using the RTL-to-GDSII flow. The RTL was written in Verilog/VHDL, synthesized, placed, routed, and taped out to a 5nm or 7nm foundry.',
    commonMistakes: [
      'Confusing FPGA and ASIC — FPGAs are programmable but less efficient; ASICs are fixed but highly optimized',
      'Thinking tapeout is the end — silicon must still be fabricated, packaged, and tested',
      'Assuming RTL = layout — RTL is behavioral, layout is physical',
    ],
    practiceQuestions: [
      { q: 'What does VLSI stand for and what makes it "very large scale"?', a: 'Very Large Scale Integration — refers to chips containing more than 10,000 transistors. Modern chips have billions.' },
      { q: 'What is the difference between front-end and back-end design?', a: 'Front-end covers RTL, simulation, synthesis. Back-end covers physical implementation: floorplan, placement, routing, verification.' },
      { q: 'Why is tapeout such a critical milestone?', a: 'Because manufacturing begins after tapeout. Errors discovered post-tapeout require an expensive re-spin (new tapeout).' },
    ],
    checklist: ['I can define VLSI and explain IC integration levels', 'I understand ASIC vs FPGA tradeoffs', 'I can describe the RTL-to-GDSII flow at a high level', 'I know what tapeout means and why it matters'],
    nextStep: 'Level 1 — Digital Logic Fundamentals: Learn the gates, boolean algebra, and logic structures that form the building blocks of RTL.',
  },
  {
    id: 1,
    title: 'LEVEL 1',
    subtitle: 'Digital Logic Fundamentals',
    color: '#7C3AED',
    why: 'All digital hardware — from processors to memory — is built from logic gates. Understanding gates, Boolean algebra, and truth tables is the foundation of RTL design and synthesis.',
    objectives: [
      'Identify and describe the behavior of AND, OR, NOT, NAND, NOR, XOR gates',
      'Write Boolean expressions and truth tables',
      'Understand universal gates (NAND, NOR)',
      'Recognize combinational logic patterns',
      'Connect gate behavior to synthesized standard cells',
    ],
    concepts: ['Logic Gates', 'Boolean Algebra', 'Truth Tables', 'Universal Gates', 'Combinational Logic', 'Standard Cells'],
    explanation: `A logic gate is the fundamental building block of digital circuits. It takes one or more binary inputs and produces a single binary output based on a defined logical function.

Basic Gates:
• AND: Output = 1 only when ALL inputs are 1. Expression: Y = A · B
• OR: Output = 1 when ANY input is 1. Expression: Y = A + B  
• NOT: Output = inverse of input. Expression: Y = Ā
• NAND: NOT-AND. Output = 0 only when ALL inputs are 1. Universal gate.
• NOR: NOT-OR. Output = 1 only when ALL inputs are 0. Universal gate.
• XOR: Output = 1 when inputs DIFFER. Expression: Y = A ⊕ B

Universal Gates: NAND and NOR are called universal because ANY logic function can be built using only NAND gates (or only NOR gates). This is why CMOS technology heavily uses NAND/NOR — they are efficient to implement.

Boolean Algebra Laws:
• Identity: A + 0 = A, A · 1 = A
• Complement: A + Ā = 1, A · Ā = 0
• De Morgan's Theorem: (A·B)̄ = Ā + B̄ and (A+B)̄ = Ā · B̄

In VLSI, synthesis tools map RTL Boolean expressions to standard cells — library elements like AND2, OR2, NAND2, INV that are pre-characterized for area, timing, and power.`,
    vlsiRelevance: 'Synthesis tools read RTL and produce netlists of these gates mapped to standard cells from the technology library. Understanding gates helps debug synthesis reports and understand area/timing results.',
    formulas: ['AND: Y = A · B', 'OR: Y = A + B', 'NOT: Y = Ā', 'NAND: Y = (A · B)̄', 'NOR: Y = (A + B)̄', 'XOR: Y = A ⊕ B', "De Morgan's: (A·B)̄ = Ā + B̄"],
    example: 'A 2-input NAND gate: inputs A=1, B=1 → Y=0. Inputs A=1, B=0 → Y=1. This NAND2 cell in a 7nm library occupies ~0.2 μm² and has ~50ps delay.',
    commonMistakes: [
      'Confusing NAND truth table with AND — remember NAND inverts the AND result',
      'Forgetting De Morgan\'s theorem when simplifying expressions',
      'Assuming XOR is the same as OR — XOR is 0 when both inputs are 1',
    ],
    practiceQuestions: [
      { q: 'A=1, B=0: What is the output of NAND(A,B)?', a: 'Y = 1. NAND outputs 0 only when both inputs are 1.' },
      { q: 'Simplify using De Morgan\'s: NOT(A AND B)', a: 'NOT(A AND B) = NOT(A) OR NOT(B) = Ā + B̄' },
      { q: 'Why are NAND and NOR called universal gates?', a: 'Because any logic function can be implemented using only NAND (or only NOR) gates.' },
    ],
    checklist: ['I can draw truth tables for all 6 basic gates', 'I can apply De Morgan\'s theorem', 'I understand why NAND/NOR are universal', 'I can write Boolean expressions from logic diagrams'],
    nextStep: 'Level 2 — Number Systems & Boolean Algebra: Deepen Boolean simplification skills with Karnaugh maps and algebraic methods.',
  },
  {
    id: 2,
    title: 'LEVEL 2',
    subtitle: 'Number Systems & Boolean Algebra',
    color: '#0891B2',
    why: 'Digital hardware processes binary data. Understanding number systems and Boolean algebra enables you to design, simplify, and verify digital logic — a prerequisite for RTL design.',
    objectives: [
      'Convert between binary, decimal, octal, and hexadecimal',
      'Perform binary arithmetic (addition, subtraction, complement)',
      'Apply Boolean laws to simplify expressions',
      'Use De Morgan\'s theorem',
      'Understand how number representations affect hardware',
    ],
    concepts: ['Binary', 'Decimal', 'Hexadecimal', 'Two\'s Complement', 'Boolean Laws', 'De Morgan\'s Theorem', 'Karnaugh Map'],
    explanation: `Number Systems used in digital design:

Binary (Base-2): Uses only 0 and 1. Example: 1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀
Decimal (Base-10): Our everyday number system. 
Hexadecimal (Base-16): Uses 0-9 and A-F. Example: 0xFF = 255₁₀. Used heavily in hardware addresses and data.
Octal (Base-8): Used historically in some computing contexts.

Binary Arithmetic:
• Addition: 1+1 = 10 (carry 1), 1+1+1 = 11 (carry 1)
• Two's Complement: The standard way to represent negative numbers in hardware.
  To negate a number: invert all bits, then add 1.
  Example: +5 = 0101, -5 = 1010 + 1 = 1011
  Two's complement allows addition and subtraction to use the same hardware.

Boolean Laws:
• Idempotent: A + A = A, A · A = A
• Absorption: A + AB = A, A(A + B) = A
• Distribution: A(B+C) = AB + AC
• De Morgan's: NOT(A AND B) = NOT(A) OR NOT(B)`,
    vlsiRelevance: 'ALUs, adders, subtractors are implemented in RTL using binary arithmetic. Understanding two\'s complement explains why signed/unsigned data types matter in Verilog.',
    formulas: ['Two\'s Complement = Invert + 1', 'Binary to Decimal: sum of bit × 2^position', 'Hex to Binary: each hex digit = 4 bits', 'De Morgan: (A+B)̄ = Ā · B̄'],
    example: 'Converting -13 to 8-bit two\'s complement: +13 = 00001101, invert = 11110010, add 1 = 11110011. In Verilog: signed 8-bit -13 is stored as 8\'hF3.',
    commonMistakes: [
      'Forgetting to add 1 when computing two\'s complement',
      'Mixing up hex digits — A=10, B=11, C=12, D=13, E=14, F=15',
      'Applying absorption law incorrectly — A + AB = A (not A + B)',
    ],
    practiceQuestions: [
      { q: 'Convert 0xAC to binary', a: 'A=1010, C=1100 → 10101100' },
      { q: 'Represent -7 in 4-bit two\'s complement', a: '+7=0111, invert=1000, +1=1001' },
      { q: 'Simplify: A + A\'B', a: 'A + A\'B = A + B (by absorption theorem)' },
    ],
    checklist: ['I can convert between all number systems', 'I can compute two\'s complement', 'I can simplify Boolean expressions using laws', 'I understand why two\'s complement is used in hardware'],
    nextStep: 'Level 3 — Combinational Circuits: Build MUXes, adders, encoders using the gates and algebra you now know.',
  },
  {
    id: 3,
    title: 'LEVEL 3',
    subtitle: 'Combinational Circuits',
    color: '#059669',
    why: 'Combinational circuits are the workhorses of digital design. Understanding MUXes, adders, decoders is essential for RTL design and synthesized circuits.',
    objectives: [
      'Design multiplexers and demultiplexers',
      'Implement encoders and decoders',
      'Build half-adder and full-adder circuits',
      'Understand comparators and ALU basics',
      'Trace combinational logic through synthesis',
    ],
    concepts: ['Multiplexer', 'Demultiplexer', 'Encoder', 'Decoder', 'Comparator', 'Half Adder', 'Full Adder', 'ALU'],
    explanation: `Combinational circuits produce outputs that depend only on current inputs — no memory, no state.

Multiplexer (MUX): Selects one of N inputs to pass to the output based on a select signal.
2:1 MUX: Y = S ? B : A (when S=0 → A, when S=1 → B)
Used for data selection, routing, and bus arbitration.

Demultiplexer (DEMUX): Routes one input to one of N outputs based on a select signal.

Encoder: Converts 2^N inputs (one-hot) to N-bit binary code. Example: 4-to-2 encoder.

Decoder: Converts N-bit binary to 2^N one-hot output. Example: 2-to-4 decoder. Used in memory address decoding.

Half Adder: Adds two 1-bit numbers. Sum = A XOR B, Carry = A AND B.

Full Adder: Adds three 1-bit numbers (A, B, Cin). Sum = A⊕B⊕Cin, Cout = AB + BCin + ACin.

ALU (Arithmetic Logic Unit): Combines adder, logic operations (AND, OR, XOR) with a function select input. The core of any processor.`,
    vlsiRelevance: 'MUXes appear throughout synthesis netlist for clock gating, data selection. Full adders are the building blocks of multi-bit adders which are synthesized from RTL arithmetic operators.',
    formulas: ['Half Adder: Sum = A⊕B, Carry = AB', 'Full Adder: Sum = A⊕B⊕Cin, Cout = AB+BCin+ACin', '2:1 MUX: Y = S?B:A'],
    example: 'Full adder: A=1, B=1, Cin=1 → Sum = 1⊕1⊕1 = 1, Cout = 1·1 + 1·1 + 1·1 = 1. Result: Sum=1, Cout=1 (binary 11 = decimal 3 = 1+1+1).',
    commonMistakes: [
      'Confusing encoder and decoder — encoder reduces bits, decoder expands bits',
      'Forgetting the carry-in in full adder calculations',
      'Thinking MUX output depends on all inputs simultaneously — only the SELECTED input matters',
    ],
    practiceQuestions: [
      { q: 'Design a 4:1 MUX using 2:1 MUXes. How many 2:1 MUXes are needed?', a: '3 MUXes — two in the first stage to select between 4 inputs, one in the second stage.' },
      { q: 'Full adder: A=0, B=1, Cin=1. What are Sum and Cout?', a: 'Sum = 0⊕1⊕1 = 0, Cout = 0·1 + 1·1 + 0·1 = 1.' },
    ],
    checklist: ['I can design a MUX from gates', 'I can implement a full adder', 'I understand decoder function in memory', 'I can describe an ALU at a high level'],
    nextStep: 'Level 4 — Sequential Circuits: Add state and memory with flip-flops and latches.',
  },
  {
    id: 4,
    title: 'LEVEL 4',
    subtitle: 'Sequential Circuits',
    color: '#DC2626',
    why: 'Sequential circuits have memory — they define the state of a system over time. Flip-flops are the fundamental storage elements in all digital hardware and their timing constraints define how fast a chip can run.',
    objectives: [
      'Distinguish latches from flip-flops',
      'Understand D, JK, and T flip-flops',
      'Define setup time, hold time, clock-to-Q delay',
      'Explain why timing violations cause failures',
      'Relate flip-flop timing to STA',
    ],
    concepts: ['Latch', 'D Flip-Flop', 'JK Flip-Flop', 'T Flip-Flop', 'Setup Time', 'Hold Time', 'Clock-to-Q', 'Metastability'],
    explanation: `Sequential circuits have state — their outputs depend on current inputs AND past history.

Latch: A level-sensitive storage element. It is transparent when the clock/enable is high — data flows through. This can cause timing problems in synchronous design.

Flip-Flop: Edge-triggered storage. It captures data at the clock edge (rising or falling) and holds it until the next edge. This makes timing predictable.

D Flip-Flop: Most common. Q follows D at the clock edge. Q(next) = D.
JK Flip-Flop: J sets, K resets, JK=11 toggles. More complex but historically important.
T Flip-Flop: Toggle flip-flop. Q toggles when T=1 at clock edge. Used for counters.

Critical Timing Parameters:
• Setup Time (tsu): D must be stable BEFORE the clock edge by this amount. If violated → data is not captured correctly.
• Hold Time (th): D must remain stable AFTER the clock edge for this duration. If violated → metastability or wrong data capture.
• Clock-to-Q Delay (tCQ): Time from clock edge to Q becoming valid. This is the flip-flop's contribution to the data path delay.

Timing Constraint:
  tCQ + tlogic < Tclk − tsu   (Setup check)
  tCQ + tlogic > th            (Hold check)`,
    vlsiRelevance: 'Every flip-flop in your design has tsu, th, and tCQ. STA tools check these at every flip-flop in the design. CTS aims to deliver the clock to all flip-flops with minimal skew.',
    formulas: ['Setup check: tCQ + tcombo ≤ Tclk − tsu − tskew', 'Hold check: tCQ + tcombo ≥ th + tskew', 'Fmax = 1 / (tCQ + tcombo_critical + tsu)'],
    example: 'Flip-flop: tCQ=0.15ns, tsu=0.05ns. Combinational logic delay=0.8ns. Minimum clock period = 0.15+0.8+0.05 = 1.0ns. Maximum frequency = 1/1.0ns = 1 GHz.',
    commonMistakes: [
      'Using latches in RTL — can cause hold violations and unpredictable timing',
      'Confusing setup and hold — setup is before clock edge, hold is after',
      'Forgetting that clock skew affects both setup and hold margins',
    ],
    practiceQuestions: [
      { q: 'What happens if the setup time is violated?', a: 'The flip-flop may not capture the correct data value, leading to functional failure or metastability.' },
      { q: 'Why are flip-flops preferred over latches in synchronous design?', a: 'Flip-flops are edge-triggered, making timing analysis predictable. Latches are level-sensitive and can create timing problems.' },
    ],
    checklist: ['I can describe D, JK, T flip-flop behavior', 'I can define setup time, hold time, clock-to-Q', 'I understand timing constraint equations', 'I know why latches are avoided in synchronous RTL'],
    nextStep: 'Level 5 — FSM Design: Build state machines using flip-flops and combinational logic.',
  },
  {
    id: 5,
    title: 'LEVEL 5',
    subtitle: 'FSM Design',
    color: '#D97706',
    why: 'Finite State Machines are used to implement controllers, protocol handlers, and any sequential decision-making logic in hardware. FSM design is a core RTL skill.',
    objectives: [
      'Distinguish Moore and Mealy FSMs',
      'Draw state diagrams and state tables',
      'Implement FSMs in Verilog',
      'Choose state encoding strategies',
      'Verify FSM behavior through simulation',
    ],
    concepts: ['Moore FSM', 'Mealy FSM', 'State Diagram', 'State Table', 'State Encoding', 'One-Hot Encoding', 'Binary Encoding'],
    explanation: `A Finite State Machine (FSM) is a model of computation with a finite number of states, transitions between states based on inputs, and outputs.

Moore FSM: Output depends ONLY on the current state. Outputs are registered (stable, glitch-free).
Mealy FSM: Output depends on current state AND current inputs. Faster response but can glitch.

State Diagram: Circles represent states. Arrows represent transitions labeled with condition/output.
State Table: Tabular representation of current state, input, next state, output.

State Encoding Strategies:
• Binary Encoding: Minimum bits needed. log2(N) bits for N states. Area efficient.
• One-Hot Encoding: One bit per state. Only one bit is 1 at a time. Faster decode, more flip-flops.
• Gray Encoding: Adjacent states differ by one bit. Reduces glitching.

Example: Traffic Light Controller (Moore FSM)
States: RED, GREEN, YELLOW
RED → GREEN (when timer expires)
GREEN → YELLOW (when timer expires)
YELLOW → RED (when timer expires)
Output: light color = current state`,
    vlsiRelevance: 'Controllers for AXI buses, UART, SPI, DDR memory interfaces are implemented as FSMs in RTL. Synthesis tools map FSM RTL to flip-flops and combinational logic.',
    formulas: ['Number of state bits (binary) = ⌈log₂(N)⌉', 'One-hot: N flip-flops for N states'],
    example: 'Vending machine FSM: States = IDLE, SELECT, DISPENSE. Transition: IDLE→SELECT when coin inserted. Output in SELECT state = show item. This becomes flip-flops + combinational select logic in silicon.',
    commonMistakes: [
      'Missing default state transitions — can cause FSM to hang in undefined state',
      'Using Mealy outputs without synchronizing — can create glitches',
      'Forgetting reset logic — FSM must start in a known state',
    ],
    practiceQuestions: [
      { q: 'How many flip-flops are needed for a 5-state FSM with binary encoding?', a: '⌈log₂(5)⌉ = 3 flip-flops.' },
      { q: 'What is the difference between Moore and Mealy output?', a: 'Moore: output depends only on state (registered, stable). Mealy: output depends on state+input (combinational, faster but may glitch).' },
    ],
    checklist: ['I can draw a Moore and Mealy FSM diagram', 'I can write a state table', 'I understand state encoding tradeoffs', 'I can implement an FSM in Verilog'],
    nextStep: 'Level 6 — CMOS Fundamentals: Understand the transistor-level implementation of logic gates.',
  },
  {
    id: 6,
    title: 'LEVEL 6',
    subtitle: 'CMOS Fundamentals',
    color: '#BE185D',
    why: 'All modern chips use CMOS technology. Understanding NMOS/PMOS transistors, CMOS logic structure, and noise margins explains why standard cells are designed the way they are.',
    objectives: [
      'Describe NMOS and PMOS transistor operation',
      'Analyze the CMOS inverter circuit',
      'Understand pull-up and pull-down networks',
      'Calculate noise margins',
      'Connect CMOS power to design choices',
    ],
    concepts: ['NMOS', 'PMOS', 'CMOS Inverter', 'Pull-Up Network', 'Pull-Down Network', 'Noise Margin', 'Static Power', 'Dynamic Power'],
    explanation: `CMOS (Complementary Metal-Oxide-Semiconductor) uses pairs of complementary transistors.

NMOS Transistor: Conducts when Gate=HIGH (Vgs > Vth). Acts as a switch connecting output to GND. Called "pull-down."
PMOS Transistor: Conducts when Gate=LOW (Vgs < Vth, i.e., gate is LOW). Acts as a switch connecting output to VDD. Called "pull-up."

CMOS Inverter: The simplest CMOS gate.
• Input HIGH → NMOS ON, PMOS OFF → Output connected to GND → Output LOW
• Input LOW → NMOS OFF, PMOS ON → Output connected to VDD → Output HIGH
• Key property: In steady state, either the PMOS or NMOS is OFF → NO DC path from VDD to GND → No static power (ideally)

CMOS Logic Gates:
• NAND: Pull-down = NMOS in series. Pull-up = PMOS in parallel.
• NOR: Pull-down = NMOS in parallel. Pull-up = PMOS in series.
Rule: Pull-down network is the NMOS mirror of the function. Pull-up is the PMOS dual.

Noise Margin: The tolerance of a gate to input signal distortion before it fails.
NM_H = VOH_min − VIH_min (high-level noise margin)
NM_L = VIL_max − VOL_max (low-level noise margin)`,
    vlsiRelevance: 'Standard cells are implemented in CMOS. The cell height in a standard cell library corresponds to the NMOS + PMOS stack height. Cell characterization determines timing, power, and noise margin.',
    formulas: ['CMOS Inverter: Vout = NOT(Vin)', 'NM_H = VOH − VIH', 'NM_L = VIL − VOL', 'Static Power = Ileakage × VDD'],
    example: 'CMOS NAND2: Two NMOS in series (both must conduct to pull output to 0) and two PMOS in parallel (either can pull output to 1). In a 28nm library, NAND2 has ~0.5μm² area.',
    commonMistakes: [
      'Thinking PMOS conducts when gate is HIGH — it is the opposite of NMOS',
      'Assuming CMOS has zero static power — leakage current is significant in advanced nodes',
      'Confusing pull-up/pull-down network topology for NAND vs NOR',
    ],
    practiceQuestions: [
      { q: 'In a CMOS inverter, when is there a DC path from VDD to GND?', a: 'During switching — briefly both PMOS and NMOS conduct. This is the source of short-circuit (dynamic) power.' },
      { q: 'Draw the pull-down network for a 3-input NAND gate.', a: '3 NMOS transistors in series. All three must be ON (all inputs HIGH) to pull output to 0.' },
    ],
    checklist: ['I can explain NMOS and PMOS operation', 'I can analyze a CMOS inverter', 'I can derive pull-up/pull-down networks for NAND/NOR', 'I understand noise margins'],
    nextStep: 'Level 7 — CMOS Delay & Power: Quantify delay and power in CMOS circuits.',
  },
  {
    id: 7,
    title: 'LEVEL 7',
    subtitle: 'CMOS Delay & Power',
    color: '#7C3AED',
    why: 'Understanding RC delay and power consumption lets you make intelligent tradeoffs in synthesis and physical design. These equations appear in every STA and power analysis report.',
    objectives: [
      'Calculate RC delay in CMOS gates',
      'Compute dynamic and static power',
      'Understand switching activity and power-delay tradeoff',
      'Explain why voltage scaling reduces power',
    ],
    concepts: ['RC Delay', 'Propagation Delay', 'Dynamic Power', 'Static Power', 'Leakage', 'Switching Activity', 'Power-Delay Product'],
    explanation: `RC Delay Model:
Each CMOS gate can be modeled as a resistor (transistor Ron) charging/discharging a capacitor (node capacitance).

Propagation delay: t_pd ≈ 0.69 × R × C
where R = transistor on-resistance, C = total node capacitance (gate + wire + load)

This explains why:
• Longer wires (more C) → more delay
• Wider transistors (less R) → less delay but more area and power
• Higher fan-out (more C) → more delay → need buffers

Dynamic Power:
P_dynamic = α × C × V² × f
• α = switching activity (fraction of clock cycles where output switches, 0 to 1)
• C = load capacitance
• V = supply voltage
• f = clock frequency

Voltage has squared effect: Halving V reduces dynamic power by 4×!

Static (Leakage) Power:
P_static = I_leak × V_DD
Always present, even when circuit is idle. Dominant in advanced nodes (7nm, 5nm).

Total Power:
P_total = P_dynamic + P_static + P_short_circuit

Power-Delay Tradeoff:
Increasing voltage → faster gates (less delay) but more power.
Reducing voltage → less power but slower gates.
This is why low-power designs operate at near-threshold voltage.`,
    vlsiRelevance: 'STA tools use the RC model to calculate path delays. Power analysis uses switching activity and capacitance from the placed netlist. Designers reduce power by lowering activity, voltage, frequency, or capacitance.',
    formulas: ['t_pd ≈ 0.69 × R × C', 'P_dynamic = α · C · V² · f', 'P_static = I_leak · VDD', 'P_total = P_dynamic + P_static', 'PDP = P_total × t_pd (power-delay product)'],
    example: 'α=0.1, C=10fF, V=1.0V, f=1GHz: P_dynamic = 0.1 × 10×10⁻¹⁵ × 1.0² × 1×10⁹ = 1 μW per gate. A chip with 1 billion such gates → 1W from dynamic power alone.',
    commonMistakes: [
      'Forgetting the squared voltage in dynamic power — voltage reduction is powerful',
      'Ignoring leakage in advanced nodes — it can equal or exceed dynamic power at 7nm',
      'Assuming switching activity α=1 — typical RTL has α=0.1 to 0.3',
    ],
    practiceQuestions: [
      { q: 'If you double the supply voltage, how does dynamic power change?', a: 'P_dynamic ∝ V². Doubling V increases power by 4×.' },
      { q: 'RC delay: R=2kΩ, C=5pF. What is t_pd?', a: 't = 0.69 × 2000 × 5×10⁻¹² = 6.9ns' },
    ],
    checklist: ['I can calculate RC delay', 'I can compute dynamic power', 'I understand why V² appears in power', 'I can explain leakage and when it matters'],
    nextStep: 'Level 8 — Verilog/SystemVerilog Basics: Start writing synthesizable RTL.',
  },
  {
    id: 8,
    title: 'LEVEL 8',
    subtitle: 'Verilog / SystemVerilog Basics',
    color: '#0284C7',
    why: 'Verilog is the primary hardware description language for VLSI design. You must write RTL in Verilog before synthesis can generate logic gates.',
    objectives: [
      'Write synthesizable Verilog modules',
      'Use correct port declarations and data types',
      'Understand continuous assignments vs always blocks',
      'Distinguish blocking vs non-blocking assignments',
      'Use parameters for reusable designs',
    ],
    concepts: ['Module', 'Port', 'wire', 'reg/logic', 'assign', 'always_ff', 'always_comb', 'Blocking (=)', 'Non-blocking (<=)', 'Parameter'],
    explanation: `Verilog Module:
Every design starts with module...endmodule. Ports declare the interface.

module adder #(parameter N=8) (
  input  logic [N-1:0] a, b,
  output logic [N:0]   sum
);
  assign sum = a + b;
endmodule

Data Types:
• wire: Combinational signal, driven by assign or module output
• logic/reg: Can be used in always blocks. SystemVerilog's "logic" is preferred.
• bit: Single bit. integer: 32-bit. 

Continuous Assignment (assign):
assign y = a & b;  // Combinational, runs whenever inputs change

always_ff (Flip-Flop / Sequential):
always_ff @(posedge clk or posedge rst) begin
  if (rst) q <= '0;
  else     q <= d;
end

always_comb (Combinational):
always_comb begin
  y = a | b;
end

Blocking (=) vs Non-Blocking (<=):
NEVER mix them in always_ff. Use <= for sequential (flip-flops).
Use = in always_comb for combinational logic.

Blocking (=): Executes sequentially within the block — like software.
Non-blocking (<=): All evaluations happen first, then all assignments — models real flip-flop behavior.`,
    vlsiRelevance: 'Synthesis tools parse Verilog and infer flip-flops from always_ff and combinational logic from always_comb. Using blocking assignments in flip-flop blocks is a common RTL bug that synthesis may misinterpret.',
    formulas: ['Synthesis rule: always_ff → flip-flops, always_comb → combinational gates'],
    example: '`always_ff @(posedge clk) q <= d;` synthesizes to exactly one D flip-flop. `assign y = a & b;` synthesizes to an AND gate.',
    commonMistakes: [
      'Using blocking (=) in always_ff — causes simulation/synthesis mismatch',
      'Forgetting default assignment in always_comb — creates unintended latches',
      'Using reg in SystemVerilog — use logic instead',
    ],
    practiceQuestions: [
      { q: 'What does this synthesize to: always_ff @(posedge clk) if(rst) q<=0; else q<=q+1;', a: 'A counter register with synchronous reset. N flip-flops and an incrementer.' },
      { q: 'What is the difference between <= and = in Verilog?', a: '<= is non-blocking (concurrent, models flip-flops). = is blocking (sequential, used in combinational blocks).' },
    ],
    checklist: ['I can write a Verilog module with ports', 'I understand wire vs logic', 'I use <= correctly in flip-flop always blocks', 'I can write always_comb without latches'],
    nextStep: 'Level 9 — RTL Design: Design complete synthesizable RTL modules.',
  },
  {
    id: 9,
    title: 'LEVEL 9',
    subtitle: 'RTL Design',
    color: '#047857',
    why: 'RTL design is where the chip\'s functionality is created. Good RTL directly impacts synthesis quality, timing, power, and area of the final chip.',
    objectives: [
      'Design synthesizable RTL for counters, registers, arithmetic modules',
      'Implement FSMs in Verilog',
      'Write RTL that meets area and timing constraints',
      'Identify and avoid non-synthesizable constructs',
    ],
    concepts: ['Synthesizable RTL', 'Registers', 'Counters', 'FSM RTL', 'Arithmetic RTL', 'Coding Style', 'Lint'],
    explanation: `Good RTL Design Principles:

1. Synchronous Design: Use a single clock domain. Avoid asynchronous logic unless necessary.
2. No Latches: Always provide a default assignment in always_comb to avoid unintentional latches.
3. Reset Strategy: Use synchronous reset for better timing. Asynchronous reset for safety.
4. Parameterized Design: Use parameters for bit widths to make modules reusable.
5. Avoid Initial Blocks: Not synthesizable. Use reset logic instead.
6. Don't Use Delays: #delay is for simulation only.

RTL Counter (4-bit):
always_ff @(posedge clk) begin
  if (rst)      count <= 4'b0000;
  else if (en)  count <= count + 1'b1;
end

RTL FSM (2 always blocks — recommended style):
// State register
always_ff @(posedge clk) state <= next_state;
// Next-state and output logic
always_comb begin
  next_state = state; // default
  case (state)
    IDLE: if (start) next_state = RUN;
    RUN:  if (done)  next_state = IDLE;
  endcase
end`,
    vlsiRelevance: 'RTL quality directly affects synthesis: bad RTL creates large netlists, long critical paths, and power issues. Synthesis tools can optimize but cannot fix fundamentally poor RTL structure.',
    formulas: ['Fmax = 1 / (tCQ + t_combo_max + tsu)', 'Area ∝ gate count from RTL complexity'],
    example: 'A 32-bit accumulator in RTL: `always_ff @(posedge clk) acc <= acc + data_in;` synthesizes to 32 flip-flops + a 32-bit adder. In a 28nm library, this is ~50μm².',
    commonMistakes: [
      'Unintentional latches from incomplete if/case in always_comb',
      'Using initial blocks — these are simulation-only and not synthesizable',
      'Missing clock domain crossing synchronizers when crossing between clock domains',
    ],
    practiceQuestions: [
      { q: 'How do you avoid a latch in an always_comb block?', a: 'Assign a default value to all outputs at the beginning of the block, or ensure all branches cover all conditions.' },
      { q: 'What is the recommended two-block FSM coding style?', a: 'Block 1: always_ff for state register (sequential). Block 2: always_comb for next-state and output logic (combinational).' },
    ],
    checklist: ['I can write synthesizable RTL for common blocks', 'I avoid latches and non-synthesizable constructs', 'I implement FSMs in RTL using two-block style', 'I use parameters for reusable RTL'],
    nextStep: 'Level 10 — RTL Verification: Simulate and verify your RTL before synthesis.',
  },
  {
    id: 10,
    title: 'LEVEL 10',
    subtitle: 'RTL Verification',
    color: '#B45309',
    why: 'Functional bugs found in RTL are cheap to fix. The same bugs found post-silicon cost millions. Verification is the most time-consuming part of chip design — for good reason.',
    objectives: [
      'Write SystemVerilog testbenches',
      'Apply stimulus and check outputs',
      'Use assertions for automatic checking',
      'Understand functional and code coverage',
      'Debug simulation waveforms',
    ],
    concepts: ['Testbench', 'DUT', 'Stimulus', 'Monitor', 'Assertions', 'Coverage', 'Waveform Debugging'],
    explanation: `RTL Verification ensures the design works correctly before synthesis.

Testbench Structure:
• DUT (Design Under Test): The RTL module being tested
• Stimulus: Inputs applied to the DUT
• Monitor: Captures and checks DUT outputs  
• Scoreboard: Compares actual vs expected outputs
• Assertions: Automatic property checking

Simple Testbench:
module tb_adder;
  logic [7:0] a, b;
  logic [8:0] sum;
  adder #(8) dut (.a(a), .b(b), .sum(sum));
  initial begin
    a = 8'd25; b = 8'd30; #10;
    assert (sum == 8'd55) else $error("FAIL");
    a = 8'd255; b = 8'd1; #10;
    $display("Sum: %0d", sum);
    $finish;
  end
endmodule

Assertions (SVA):
property no_overflow;
  @(posedge clk) a + b <= 8'hFF;
endproperty
assert property (no_overflow);

Coverage:
• Code coverage: Was every line/branch/condition executed?
• Functional coverage: Was every important scenario tested?
• Target: 100% code coverage + functional coverage before signoff`,
    vlsiRelevance: 'Verification engineers write testbenches alongside RTL. Post-synthesis gate-level simulation runs the same testbench on the netlist to verify synthesis didn\'t change behavior.',
    formulas: ['Code Coverage = (lines executed / total lines) × 100%'],
    example: 'A UART testbench: Apply valid start bit, 8 data bits, stop bit sequences. Assert that received data matches sent data. Check that baud rate timing is correct. Achieve 100% functional coverage before synthesis.',
    commonMistakes: [
      'Insufficient coverage — testing only the easy cases, missing corner cases',
      'Using $finish too early before all tests complete',
      'Missing clock generation in testbench',
    ],
    practiceQuestions: [
      { q: 'What is the difference between code coverage and functional coverage?', a: 'Code coverage measures if lines were executed. Functional coverage measures if important design scenarios were tested.' },
      { q: 'What does an SVA assertion do?', a: 'It automatically checks a property every clock cycle during simulation. Failures are flagged as assertion violations.' },
    ],
    checklist: ['I can write a basic testbench for a combinational module', 'I can write a testbench for an FSM', 'I understand what assertions do', 'I know the difference between code and functional coverage'],
    nextStep: 'Level 11 — Synthesis: Convert verified RTL to a gate-level netlist.',
  },
  {
    id: 11,
    title: 'LEVEL 11',
    subtitle: 'Synthesis',
    color: '#1D4ED8',
    why: 'Synthesis transforms your RTL into actual logic gates from the technology library. It\'s where area, timing, and power constraints first become concrete numbers.',
    objectives: [
      'Understand what synthesis does to RTL',
      'Interpret synthesis reports (area, timing, power)',
      'Set synthesis constraints (timing, area, power)',
      'Understand technology library and standard cells',
      'Distinguish pre-synthesis and post-synthesis timing',
    ],
    concepts: ['RTL to Netlist', 'Technology Library', 'Standard Cells', 'SDC Constraints', 'Critical Path', 'Area Report', 'Timing Report'],
    explanation: `Synthesis converts RTL → gate-level netlist in three phases:

1. Elaboration: Parse RTL, resolve parameters, create hierarchical design model
2. Generic Optimization: Technology-independent optimization — Boolean optimization, logic restructuring
3. Technology Mapping: Map generic gates to real standard cells from the technology library

Technology Library (.lib file):
Characterizes every cell: timing arcs, power, area, noise. The synthesis tool chooses cells to meet constraints.

Standard Cell types: Buffer (BUF), Inverter (INV), AND, OR, NAND, NOR, XOR, MUX, DFF, LATCH, etc.

Synthesis Constraints (SDC format):
create_clock -name CLK -period 2.0 [get_ports clk]   # 500MHz clock
set_input_delay  0.3 -clock CLK [all_inputs]
set_output_delay 0.3 -clock CLK [all_outputs]
set_max_area 50000

Synthesis Reports:
• Timing report: Critical path delay, setup slack, worst negative slack (WNS)
• Area report: Total cell area, combinational vs sequential area
• Power report: Leakage power, dynamic power estimate

Optimization Modes:
• compile (basic): Fast, good quality
• compile_ultra (advanced): Slower, better quality — restructures logic for timing`,
    vlsiRelevance: 'Synthesis is the gate between RTL and physical design. The output netlist drives floorplanning, placement, and routing. Synthesis quality (timing, area) directly impacts physical design difficulty.',
    formulas: ['Setup Slack = Required Time − Arrival Time', 'WNS = Worst (most negative) Slack among all paths', 'TNS = Total Negative Slack = sum of all negative slacks'],
    example: 'RTL counter synthesizes: 4-bit counter → 4 DFF cells + 4-bit incrementer (XOR2+NAND2 cells) + reset MUX cells. Area report shows: DFF×4 = 1440 units, combinational = 820 units.',
    commonMistakes: [
      'No SDC constraints — synthesis optimizes without a timing goal, producing poor results',
      'Unrealistic clock period — too aggressive causes synthesis to fail',
      'Ignoring high fanout signals — can cause slow paths and routing congestion',
    ],
    practiceQuestions: [
      { q: 'What does WNS = -0.2ns mean?', a: 'The worst-case setup timing path is 0.2ns late. The path fails timing. Physical design must fix this.' },
      { q: 'Why does synthesis need a technology library?', a: 'The library contains the actual cells (with timing, area, power) that can be manufactured. Synthesis maps the design to these real cells.' },
    ],
    checklist: ['I can explain the 3 phases of synthesis', 'I can interpret a timing report', 'I know how to write basic SDC constraints', 'I understand what WNS and TNS mean'],
    nextStep: 'Level 12 — Logic Optimization: Understand how synthesis optimizes the netlist.',
  },
  {
    id: 12,
    title: 'LEVEL 12',
    subtitle: 'Logic Optimization',
    color: '#6D28D9',
    why: 'Synthesis optimization determines the final quality of your netlist. Understanding optimization techniques helps you write better RTL and interpret synthesis results.',
    objectives: [
      'Understand Boolean optimization and gate reduction',
      'Explain timing, area, and power optimization',
      'Understand fanout optimization and buffering',
      'Recognize when to restructure RTL vs let synthesis optimize',
    ],
    concepts: ['Boolean Optimization', 'Gate Reduction', 'Timing Optimization', 'Area Optimization', 'Fanout', 'Buffer Insertion', 'Logic Restructuring'],
    explanation: `Logic Optimization phases in synthesis:

1. Boolean Optimization: Simplify logic expressions mathematically. Remove redundant gates. Apply Boolean identities. Reduce SOP/POS expressions.

2. Technology-Independent Optimization: Build AND-Inverter Graphs (AIGs). Apply transformations like: decomposition, substitution, elimination. Goal: minimize logic complexity.

3. Technology Mapping: Map to real cells. Balance area vs timing using cell variants (X1=small/slow, X2=larger/faster, X4=largest/fastest).

4. Timing Optimization:
   • Gate sizing: Replace slow cell with faster (larger) version
   • Buffer insertion: Add buffers on long nets to reduce delay
   • Logic restructuring: Rebalance tree to reduce critical path depth

5. Fanout Optimization:
   High fanout = one gate drives many loads. Each load adds capacitance → slower.
   Fix: Insert buffer tree to distribute the load.
   Example: CLK_GATE driving 1000 flip-flops → needs buffer tree.

6. Power Optimization:
   • Clock gating: Gate clock to idle blocks
   • Cell sizing: Use smaller (lower power) cells on non-critical paths
   • Operand isolation: Gate datapath inputs when result not needed`,
    vlsiRelevance: 'compile_ultra in Synopsys Design Compiler runs aggressive optimization. Tool settings (timing effort, area effort) control which optimizations run. Post-synthesis timing is the baseline for physical design.',
    formulas: ['Timing improvement: replace cell with faster variant (X1→X2→X4)', 'Fanout buffer insertion: splits load C_total into parallel branches'],
    example: 'Critical path: FF → AND4 → XOR2 → FF. Timing = 1.5ns, requirement = 1.2ns. Fix: Replace AND4_X1 with AND4_X2 (faster but bigger). New timing = 1.15ns. WNS now positive.',
    commonMistakes: [
      'Expecting synthesis to fix bad RTL structure — restructuring at RTL level gives best results',
      'Over-constraining area — too tight area constraint prevents timing optimization',
      'Ignoring fanout violations — they cause slow paths and routing issues',
    ],
    practiceQuestions: [
      { q: 'What is fanout and why is high fanout a problem?', a: 'Fanout is the number of gate inputs driven by one output. High fanout increases capacitive load, increasing delay and power.' },
      { q: 'How does gate sizing improve timing?', a: 'Larger cells (X2, X4) have lower drive resistance. Lower R reduces RC delay (t=0.69RC). But area and power increase.' },
    ],
    checklist: ['I can explain gate sizing for timing', 'I understand fanout problems and buffer insertion', 'I know how clock gating reduces power', 'I can read a synthesis timing report and identify the critical path'],
    nextStep: 'Level 13 — Static Timing Analysis: Verify timing at every path in the design.',
  },
  {
    id: 13,
    title: 'LEVEL 13',
    subtitle: 'Static Timing Analysis',
    color: '#B91C1C',
    why: 'STA is the definitive method for verifying that a chip meets its timing requirements. Every path from every launch flip-flop to every capture flip-flop is checked. STA determines the maximum frequency your chip can run at.',
    objectives: [
      'Trace timing paths through a design',
      'Calculate data arrival time and data required time',
      'Compute setup and hold slack',
      'Identify the critical path',
      'Understand what makes a timing path fail',
    ],
    concepts: ['Timing Path', 'Launch Flop', 'Capture Flop', 'Data Arrival Time', 'Data Required Time', 'Setup Slack', 'Hold Slack', 'Critical Path', 'Clock Skew'],
    explanation: `STA checks all timing paths without simulation — it is exhaustive and fast.

A Timing Path: Launch FF → combinational logic → Capture FF
Clock: The clock triggers the launch FF and defines the window for capture FF.

Data Arrival Time (DAT):
DAT = clock_source_latency + clock_network_delay_to_launch_FF + tCQ + t_combinational_logic + t_wire

Data Required Time (DRT) for Setup:
DRT = clock_period + clock_source_latency + clock_network_delay_to_capture_FF − tsetup

Setup Slack:
Setup Slack = DRT − DAT
• Positive slack: Path meets timing. More positive = more margin.
• Zero slack: Path barely meets timing.
• Negative slack: TIMING VIOLATION. Path fails. Chip may not work at target frequency.

Hold Slack:
DRT_hold = clock_source_latency + clock_network_delay_to_capture_FF + thold
Hold Slack = DAT − DRT_hold
• Hold violations: Data arrives too early. Fix: add delay buffers on short paths.

Critical Path: The path with the WORST (most negative or least positive) setup slack.
The critical path determines your maximum operating frequency: Fmax = 1 / (tCQ + t_combo_critical + tsu)

Clock Skew Effect:
Positive skew (capture clock arrives late): helps setup, hurts hold.
Negative skew (capture clock arrives early): hurts setup, helps hold.`,
    vlsiRelevance: 'STA is run after synthesis, after placement, after CTS, and after routing. Each run is called a "corner." Multiple corners (worst-case process, voltage, temperature) are checked. Signoff STA must pass all corners.',
    formulas: [
      'Setup Slack = DRT − DAT = (Tclk − tsu + t_clk_to_capture) − (tCQ + t_combo + t_clk_to_launch)',
      'Hold Slack = DAT − (th + t_clk_to_capture)',
      'Fmax = 1 / T_critical_path',
    ],
    example: 'Path: Tclk=2ns, tCQ=0.15ns, t_logic=1.3ns, t_wire=0.2ns, tsu=0.05ns, skew=0. DAT=0.15+1.3+0.2=1.65ns. DRT=2.0-0.05=1.95ns. Slack=1.95-1.65=+0.3ns. ✓ Meets timing.',
    commonMistakes: [
      'Confusing setup and hold violations — setup = data too slow, hold = data too fast',
      'Ignoring clock skew — skew affects both setup and hold margins',
      'Forgetting clock latency — clock path delay must be included in both arrival and required time',
    ],
    practiceQuestions: [
      { q: 'A path has: tCQ=0.2ns, t_logic=1.5ns, tsu=0.1ns, Tclk=2.0ns. What is setup slack?', a: 'DAT=0.2+1.5=1.7ns. DRT=2.0-0.1=1.9ns. Slack=1.9-1.7=+0.2ns. Passes timing.' },
      { q: 'What does negative setup slack mean physically?', a: 'Data arrives at the capture flip-flop AFTER the required time. The flip-flop may capture wrong data → functional failure.' },
    ],
    checklist: ['I can calculate data arrival time', 'I can compute setup and hold slack', 'I understand what critical path means', 'I know how clock skew affects timing'],
    nextStep: 'Level 14 — Floorplanning: Begin physical design by defining the chip die and placement regions.',
  },
  {
    id: 14,
    title: 'LEVEL 14',
    subtitle: 'Floorplanning',
    color: '#0F766E',
    why: 'Floorplanning is the first physical design step. A good floorplan reduces routing congestion, improves timing, and enables efficient power distribution. A bad floorplan can make a design impossible to close.',
    objectives: [
      'Define die size, core size, and utilization',
      'Place macros and I/O pads strategically',
      'Create power rings and stripes',
      'Understand congestion and how floorplan affects it',
      'Compute utilization and aspect ratio',
    ],
    concepts: ['Die', 'Core', 'Utilization', 'Aspect Ratio', 'Core Margin', 'Macro Placement', 'I/O Placement', 'Power Planning', 'Congestion'],
    explanation: `Floorplanning defines the physical boundaries and high-level organization of the chip.

Die vs Core:
• Die: The entire silicon area including I/O pads and seal ring
• Core: The interior area where standard cells and macros are placed
• Core Margin: Space between die boundary and core (for I/O, power rings)

Utilization:
Utilization = (Cell Area) / (Core Area) × 100%
• 70-80% is typical for most designs
• Too high (>85%): Routing congestion, timing failures
• Too low (<50%): Wasted area, larger and more expensive chip

Aspect Ratio = Height / Width of the core. 
Typical: 1.0 (square) for balanced routing. Can be rectangular for I/O constraints.

Macro Placement Strategy:
• Place macros first (memories, large blocks)
• Keep macros near their connected I/O pins
• Don't block routing channels
• Leave channels between macros for standard cell rows
• Consider timing — place timing-critical macros close together

Power Planning:
• VDD/VSS rings around the core
• Power stripes (horizontal) and rails (connecting to rows)
• IR drop: Voltage drop along power lines under current load
• Electromigration: Metal reliability under high current density`,
    vlsiRelevance: 'Floorplanning decisions ripple through all downstream steps. Wrong macro placement creates routing congestion. Insufficient power planning causes IR drop violations that are expensive to fix later.',
    formulas: [
      'Utilization = (Total Cell Area) / (Core Area) × 100%',
      'Aspect Ratio = Core Height / Core Width',
      'IR Drop ≈ I × R_power_mesh',
    ],
    example: 'Core: 1000μm × 1000μm = 1,000,000μm². Cell area: 650,000μm². Utilization = 65%. Suitable for routing. If macros = 2 SRAM blocks (each 100×100μm) → place them in opposite corners to minimize routing interference.',
    commonMistakes: [
      'Over-utilization (>85%): Causes congestion → timing failures → routing DRC',
      'Placing all macros in the center — blocks standard cell placement and routing',
      'Ignoring power planning — causes IR drop failures discovered late in flow',
    ],
    practiceQuestions: [
      { q: 'Die area = 2000μm², core margin = 50μm on each side, die = 100×100μm. What is core area?', a: 'Core = (100-2×50)×(100-2×50) = 0×0? That\'s wrong. Die=100μm, margin=10μm each side → core=80×80=6400μm².' },
      { q: 'What is 70% utilization for a 1mm² core?', a: 'Cell area = 0.7mm² = 700,000μm². The remaining 30% is for routing and buffers.' },
    ],
    checklist: ['I can define die, core, and utilization', 'I can compute utilization and aspect ratio', 'I understand macro placement guidelines', 'I know what IR drop is and how power planning prevents it'],
    nextStep: 'Level 15 — Placement: Assign physical locations to all standard cells.',
  },
  {
    id: 15,
    title: 'LEVEL 15',
    subtitle: 'Placement',
    color: '#1E40AF',
    why: 'Placement determines where every standard cell physically sits on the chip. Good placement is the single biggest factor in achieving timing closure and routing success.',
    objectives: [
      'Understand global placement and legalization',
      'Explain timing-driven placement',
      'Measure placement density and congestion',
      'Understand what makes placement good or bad',
    ],
    concepts: ['Global Placement', 'Legalization', 'Detailed Placement', 'Density', 'Congestion', 'Timing-Driven Placement', 'Cell Rows'],
    explanation: `Placement assigns physical coordinates to every standard cell in the design.

Standard Cell Rows: All standard cells must sit in horizontal rows. Each row has a fixed height (cell height). Cells are aligned to a placement grid.

Placement Phases:
1. Global Placement: Uses analytical methods (force-directed, min-cut, simulated annealing) to find approximate locations that minimize wirelength. Cells may overlap.

2. Legalization: Moves cells to legal positions — inside the core, aligned to rows, no overlaps. Must not significantly change wirelength.

3. Detailed Placement: Fine-tune cell positions to improve timing and congestion.

Metrics:
• Cell Density: Fraction of a grid tile filled by cells. High density → routing congestion.
• Estimated Wirelength: HPWL (Half-Perimeter Wirelength) is the standard estimate.
• Congestion: Number of route tracks needed vs available. Exceeding track capacity → unroutable.

Timing-Driven Placement:
Place cells connected by timing-critical paths close together → shorter wires → less delay → easier STA closure.

Good Placement Indicators:
• Low and uniform density
• Short estimated wirelength
• Critical paths physically close together
• No isolated congested regions`,
    vlsiRelevance: 'Placement quality directly determines: routing success (can all nets be routed?), timing (are critical paths short?), and power (are switching capacitances small?). Re-placement after routing is called Placement ECO.',
    formulas: [
      'HPWL = (x_max - x_min) + (y_max - y_min) for each net',
      'Density = cell_area / tile_area for each grid tile',
      'Congestion = demand_routes / available_tracks',
    ],
    example: 'Design with 100K cells, target frequency 1GHz. After global placement: HPWL=5m. After timing-driven detailed placement: HPWL=4.2m (16% reduction), WNS improved from -0.3ns to -0.05ns.',
    commonMistakes: [
      'Ignoring placement congestion until routing — hard to fix late',
      'Not running timing-driven placement — timing can be much worse',
      'High utilization + poor floorplan = congestion that no placement tool can fix',
    ],
    practiceQuestions: [
      { q: 'What is the difference between global placement and legalization?', a: 'Global placement finds approximate positions (may overlap). Legalization moves cells to legal positions with no overlaps, aligned to rows.' },
      { q: 'Why is timing-driven placement important?', a: 'It places timing-critical cells close together, reducing wire length on critical paths, which reduces delay and makes timing closure easier.' },
    ],
    checklist: ['I understand the 3 phases of placement', 'I can explain timing-driven placement', 'I know what density and congestion metrics mean', 'I understand how placement affects routing'],
    nextStep: 'Level 16 — Clock Tree Synthesis: Distribute the clock signal to all flip-flops.',
  },
  {
    id: 16,
    title: 'LEVEL 16',
    subtitle: 'Clock Tree Synthesis',
    color: '#9333EA',
    why: 'The clock signal must reach every flip-flop at nearly the same time. Clock skew and latency directly cause timing failures. CTS is one of the most critical steps in physical design.',
    objectives: [
      'Explain clock tree structure and purpose',
      'Define clock skew, latency, and uncertainty',
      'Understand buffer insertion for clock distribution',
      'Recognize how CTS affects setup and hold timing',
    ],
    concepts: ['Clock Skew', 'Clock Latency', 'Clock Uncertainty', 'Clock Tree', 'Buffer Tree', 'CTS Spec', 'Useful Skew'],
    explanation: `The clock must reach all flip-flops to trigger them. Without careful distribution, some flip-flops receive the clock early and others late — this is clock skew.

Clock Skew: The difference in clock arrival time between two flip-flops.
• Local skew: Between flip-flops in the same path (launch and capture)
• Global skew: Across the entire design

Clock Latency: Total delay from the clock source pin to a flip-flop's clock pin. Includes all buffers in the tree.

Clock Tree Structure:
Clock Source → Buffer Level 1 → Buffer Level 2 → ... → Flip-Flops (leaves)
The tree is designed to have equal path length (and thus equal latency) to all leaf flip-flops.

CTS Process:
1. Place clock buffers/inverters to distribute the clock
2. Balance path lengths to minimize skew
3. Meet clock network timing goals

Impact on Timing:
• Setup: Positive skew (capture clock later) helps setup. Slack = Tclk + skew_benefit − path_delay − tsu
• Hold: Positive skew hurts hold. Hold violations are more common after CTS.
• After CTS: Hold violations must be fixed by inserting delay cells on short paths.

Clock Uncertainty: Accounts for: PLL jitter + OCV (On-Chip Variation) + setup/hold guard bands.
Constrainted as: set_clock_uncertainty 0.1 [get_clocks CLK]

Useful Skew: Intentionally giving some flip-flops different clock arrival times to help timing. Advanced technique.`,
    vlsiRelevance: 'CTS changes the timing picture significantly. Pre-CTS timing uses "ideal clock" (zero latency, zero skew). Post-CTS timing uses real clock. Many setup paths that pass pre-CTS may fail post-CTS due to clock latency.',
    formulas: [
      'Skew = |t_clk_to_capture − t_clk_to_launch|',
      'Setup Slack (post-CTS) = Tclk + local_skew − (tCQ + t_logic + tsu)',
      'Hold Slack (post-CTS) = (tCQ + t_logic) − (th + skew)',
    ],
    example: 'Pre-CTS: ideal clock, WNS=+0.3ns. Post-CTS: clock latency=0.8ns, skew=50ps. New setup slack accounts for latency. Hold violations appear on short paths → insert 50ps delay buffers.',
    commonMistakes: [
      'Forgetting hold fixing after CTS — hold violations are common and must be fixed before routing',
      'Excessive clock tree buffering — wastes power and area',
      'Not meeting max transition/cap limits on clock tree — causes slow clock edges',
    ],
    practiceQuestions: [
      { q: 'How does clock skew affect setup timing?', a: 'Positive skew (capture clock arrives later) increases setup slack. Negative skew decreases setup slack.' },
      { q: 'Why do hold violations appear after CTS?', a: 'CTS adds real clock latency. Short paths between close flip-flops may now arrive too early relative to the capture clock, causing hold violations.' },
    ],
    checklist: ['I can define clock skew and latency', 'I understand how CTS builds a buffer tree', 'I know how CTS changes setup and hold timing', 'I understand hold fixing after CTS'],
    nextStep: 'Level 17 — Routing: Connect all placed cells with metal wires.',
  },
  {
    id: 17,
    title: 'LEVEL 17',
    subtitle: 'Routing',
    color: '#0369A1',
    why: 'Routing creates the actual metal connections between cells. It finalizes wirelength, capacitance, and resistance — completing the physical implementation of the chip.',
    objectives: [
      'Distinguish global routing from detailed routing',
      'Understand metal layer stack and routing tracks',
      'Explain via usage and layer preferences',
      'Identify congestion, DRC, and timing impacts of routing',
    ],
    concepts: ['Global Routing', 'Detailed Routing', 'Metal Layers', 'Via', 'Track', 'Routing Grid', 'Congestion', 'DRC'],
    explanation: `Routing connects placed cells with metal wires according to the netlist.

Metal Layer Stack:
• Lower metals (M1, M2): Local connections between cells. Narrower, more resistance.
• Upper metals (M5-M9): Long connections, power, clock. Wider, less resistance.
• Horizontal and vertical routing directions alternate by layer.

Global Routing: Assigns each net to a series of routing tiles. Plans the paths without placing exact wires. Identifies congested regions.

Detailed Routing: Exact wire placement. Assigns specific tracks, layers, and via locations. Must obey:
• Design Rules: Minimum width, spacing, enclosure, via rules from foundry.
• Timing: Critical nets get routing priority and wider wires.

Routing Track: A legal wire position in a routing layer. Tracks run parallel at fixed pitch. Track utilization = wires placed / tracks available.

Via: Connection between two adjacent metal layers. Each via has resistance and area.

Congestion: Too many nets to fit in available tracks. Fix by:
• Adjusting placement to reduce local density
• Widening routing area
• Rerouting signals to less congested layers

Post-Route Parasitics:
After routing, parasitic extraction (RC extraction) measures actual wire resistance and capacitance for post-route STA.`,
    vlsiRelevance: 'Routing determines the final electrical properties (R, C) of all wires. These parasitics are extracted and used for final (signoff) STA. DRC violations from routing must be fixed before tapeout.',
    formulas: [
      'Wire Resistance: R = ρ × L / (W × h)',
      'Wire Capacitance: C = ε × W × L / t_oxide (simplified)',
      'Track Utilization = wires_routed / tracks_available',
    ],
    example: '10mm wire in M1 (ρ=0.05Ω/□): R = 0.05 × (10,000μm / 0.1μm) = 5000Ω. C ≈ 0.2fF/μm × 10,000μm = 2pF. RC delay = 5000 × 2×10⁻¹² = 10ns — very slow. Use M6 (wider, less resistance) for long wires.',
    commonMistakes: [
      'Routing critical nets on congested lower layers — adds delay',
      'Too many vias on high-current paths — causes electromigration',
      'Ignoring DRC during routing — fixing post-route DRC is expensive',
    ],
    practiceQuestions: [
      { q: 'Why are upper metal layers (M5-M9) used for long global connections?', a: 'Upper layers are thicker and wider, giving lower resistance and capacitance per unit length — less delay for long wires.' },
      { q: 'What is routing congestion and what causes it?', a: 'Too many signal nets needing to pass through the same routing tile. Caused by high placement density or poor macro placement blocking routing channels.' },
    ],
    checklist: ['I understand global vs detailed routing', 'I know the metal layer hierarchy and why it matters', 'I can explain routing congestion and how to fix it', 'I understand how routing creates RC parasitics'],
    nextStep: 'Level 18 — Physical Verification: Check the layout before tapeout.',
  },
  {
    id: 18,
    title: 'LEVEL 18',
    subtitle: 'Physical Verification',
    color: '#B45309',
    why: 'Physical verification catches errors before tapeout. A DRC or LVS violation found after tapeout means an expensive re-spin. This step is the final quality gate before sending the chip to manufacturing.',
    objectives: [
      'Define DRC, LVS, and ERC',
      'Explain common DRC violations',
      'Understand LVS connectivity matching',
      'Recognize antenna violations and how to fix them',
    ],
    concepts: ['DRC', 'LVS', 'ERC', 'Antenna Effect', 'Geometry Check', 'Connectivity Check', 'Signoff'],
    explanation: `Physical verification validates the completed layout before tapeout.

DRC (Design Rule Check): Verifies layout geometry follows foundry manufacturing rules.
Common DRC rules:
• Minimum metal width (e.g., M1 ≥ 0.05μm)
• Minimum spacing between metals (prevents short circuits)
• Via enclosure (metal must surround via by minimum amount)
• Density rules (metal density must be within a range for CMP)

LVS (Layout vs Schematic): Compares the layout netlist (extracted from GDSII) with the schematic (gate-level netlist from synthesis). All connections must match exactly.
LVS errors include: missing connections, extra connections, wrong device types, wrong device sizes.

ERC (Electrical Rule Check): Checks for electrical issues:
• Floating gates (unconnected input)
• Short circuits (different supply/ground nets connected)
• Overvoltage conditions

Antenna Effect: During metal etch, long metal antennas accumulate charge that can damage gate oxides. Fix by:
• Adding antenna diodes near the affected gate
• Jumping to higher metal layer sooner (reducing antenna area on lower metals)

Antenna Ratio = Gate Area / Antenna Metal Area. Must be < foundry limit (e.g., 400:1).

Physical Verification Signoff:
Must achieve ZERO DRC violations and ZERO LVS errors before tapeout.`,
    vlsiRelevance: 'Physical verification is non-negotiable before tapeout. Foundries will reject designs with DRC violations. LVS errors mean the chip will not function as designed even if it is manufactured correctly.',
    formulas: ['Antenna Ratio = Metal Area (connected to gate) / Gate Oxide Area < max_limit'],
    example: 'DRC error: M2 spacing = 0.04μm, rule = 0.05μm minimum → violation. Fix: move one wire 0.01μm away. LVS error: net "data_out" in layout connects to VDD. In schematic it connects to flip-flop output → short circuit error.',
    commonMistakes: [
      'Ignoring density DRC — CMP (chemical mechanical polishing) requires metal density in range 30-70%',
      'Not running LVS incrementally — fixing 1000 LVS errors at tapeout is very difficult',
      'Missing antenna checks — causes gate oxide damage during manufacturing',
    ],
    practiceQuestions: [
      { q: 'What does LVS check?', a: 'LVS verifies that the physical layout exactly matches the circuit schematic — same connections, same devices, same sizes.' },
      { q: 'How do you fix an antenna violation?', a: 'Add a diode near the affected gate, or break the antenna by routing to a higher metal layer earlier.' },
    ],
    checklist: ['I can define DRC, LVS, and ERC', 'I know common DRC rule types', 'I understand what LVS checks', 'I know what antenna effect is and how to fix it'],
    nextStep: 'Level 19 — Physical Design Optimization: Fix timing, power, and area after routing.',
  },
  {
    id: 19,
    title: 'LEVEL 19',
    subtitle: 'Physical Design Optimization',
    color: '#064E3B',
    why: 'After routing, timing must be verified with real parasitics. Timing or power violations must be fixed through ECO (Engineering Change Order) techniques without disturbing routing.',
    objectives: [
      'Understand post-route timing optimization',
      'Perform buffer insertion and cell resizing',
      'Understand ECO (Engineering Change Order) concepts',
      'Balance timing, power, and area tradeoffs',
    ],
    concepts: ['ECO', 'Buffer Insertion', 'Cell Sizing', 'Timing ECO', 'Power ECO', 'Congestion Reduction', 'Incremental Optimization'],
    explanation: `After routing, post-route STA reveals the real timing picture with extracted parasitics.

Post-Route Timing Challenges:
• Wire delay is now real (from RC extraction), not estimated
• Some paths that passed pre-route STA may now fail post-route STA
• Hold violations may appear on paths with very short wires

ECO (Engineering Change Order): Targeted, minimal changes to fix violations without major re-routing.

Timing ECO techniques:
• Buffer insertion: Add buffers on long wires to reduce delay from capacitance
• Cell resizing: Replace slow cell (X1) with faster (X2) to reduce gate delay
• Gate restructuring: Swap logic to reduce critical path depth
• Net rerouting: Route timing-critical nets on upper, faster metal layers

Power ECO techniques:
• Clock gating: Insert CG cells on low-activity clock domains
• Voltage Island: Assign lower voltage to non-critical blocks
• Cell downsizing: Replace oversized cells with smaller ones on non-critical paths

Physical Closure Checklist:
□ Setup timing: WNS ≥ 0, TNS = 0
□ Hold timing: All paths pass
□ DRC: Zero violations
□ LVS: Clean
□ IR Drop: < 5% VDD (typical limit)
□ Electromigration: All wires within current density limits
□ Power: Within thermal envelope`,
    vlsiRelevance: 'Physical closure is the culmination of physical design. A design is considered "closed" when all of the above metrics pass. Modern chips may require hundreds of ECO iterations.',
    formulas: [
      'Setup fix: Replace X1 → X2 cell: t_new = t_old × 0.7 (approximate)',
      'Buffer insertion: reduces load C on driver, but adds its own delay',
      'Hold fix: Add delay cell (buffer) on short path — t_hold_fix_min ≈ t_hold_violation',
    ],
    example: 'Post-route: Path A has setup slack -0.15ns. Wire delay = 0.3ns (longer than estimated). Fix: Insert buffer to split wire. New delay = 0.12ns per segment. Setup slack improves to +0.03ns. ✓',
    commonMistakes: [
      'Fixing timing with aggressive ECO that causes new DRC violations',
      'Over-buffering — wastes power and area, can cause new congestion',
      'Not checking hold after setup ECO — buffer insertion can cause hold violations',
    ],
    practiceQuestions: [
      { q: 'What is a timing ECO?', a: 'A targeted fix to a timing violation — typically cell resizing, buffer insertion, or logic restructuring — done with minimal changes to the routing.' },
      { q: 'Why can buffer insertion cause hold violations?', a: 'Buffers add delay to a path. If the path already barely passes hold (data arrives just in time), adding a buffer could make data arrive earlier than required.' },
    ],
    checklist: ['I understand post-route timing vs pre-route timing differences', 'I can explain ECO techniques', 'I know the physical closure checklist criteria', 'I understand power ECO methods'],
    nextStep: 'Level 20 — RTL-to-GDSII Signoff: Verify the complete flow from end to end.',
  },
  {
    id: 20,
    title: 'LEVEL 20',
    subtitle: 'RTL-to-GDSII Signoff',
    color: '#1E3A8A',
    why: 'Signoff is the final verification before tapeout. Every check must pass at all process, voltage, and temperature corners. This is the last chance to find and fix any issue.',
    objectives: [
      'Understand the complete signoff checklist',
      'Know what PVT corners are and why they matter',
      'Explain MMMC (Multi-Mode Multi-Corner) analysis',
      'Describe the final GDSII deliverable',
    ],
    concepts: ['Signoff', 'PVT Corners', 'MMMC', 'Final STA', 'Final DRC/LVS', 'GDSII', 'Tape-in vs Tapeout'],
    explanation: `Signoff is the formal verification that a design is ready for manufacturing.

PVT Corners: Process-Voltage-Temperature variations that affect timing and power.
• Process corners: Slow-Slow (SS), Fast-Fast (FF), Slow-Fast (SF/FS), Typical (TT)
• Voltage corners: VDD nominal, VDD-10%, VDD+10%
• Temperature: -40°C, 25°C, 125°C
• Worst-case setup: SS, low VDD, hot temperature
• Worst-case hold: FF, high VDD, cold temperature

MMMC (Multi-Mode Multi-Corner): Analyze multiple operating modes (functional, test, low-power) across multiple PVT corners simultaneously. Ensures the chip works in all intended conditions.

Signoff Checklist:
□ STA: WNS ≥ 0 at all corners and modes
□ Hold: All paths pass at all corners
□ DRC: Zero violations per foundry rules
□ LVS: Layout matches netlist exactly
□ ERC: No electrical rule violations
□ Antenna: All ratios within limits
□ IR Drop: < 5% VDD (or foundry spec)
□ EM (Electromigration): All wires within current density specs
□ Power: Within thermal budget

GDSII Output: The final layout database containing all polygon geometry for all metal layers. Foundry receives GDSII for mask generation.`,
    vlsiRelevance: 'Signoff is not done by one engineer or one tool. Multiple signoff tools (Calibre for DRC/LVS, PrimeTime for STA, Apache for IR drop) independently verify the design. Results from all must be clean.',
    formulas: ['Setup margin: Slack ≥ timing_uncertainty at all PVT corners', 'IR Drop limit: ΔV < 0.05 × VDD'],
    example: 'TSMC 28nm signoff: 8 PVT corners × 3 modes = 24 analysis scenarios for STA. DRC run with TSMC\'s certified Calibre deck. LVS verified against gate-level netlist. All clean → tapeout package assembled.',
    commonMistakes: [
      'Signing off only at TT (typical-typical) corner — may fail at SS or FF corners',
      'Not checking all functional modes — power-down mode may have different paths',
      'Missing antenna checks in signoff — a DRC category often overlooked',
    ],
    practiceQuestions: [
      { q: 'Why is the Slow-Slow corner worst for setup timing?', a: 'Slow-Slow means all transistors are slow → combinational logic is slow → data arrives late → setup slack is worst.' },
      { q: 'What is the difference between tape-in and tapeout?', a: 'Tape-in: delivery of the GDSII to the foundry. Tapeout: foundry accepts and processes the data for mask making (sometimes used interchangeably).' },
    ],
    checklist: ['I know all items on the signoff checklist', 'I understand PVT corners', 'I can explain MMMC analysis', 'I know what GDSII contains'],
    nextStep: 'Level 21 — Tapeout & Real Chip Flow: Complete the journey from GDSII to silicon.',
  },
  {
    id: 21,
    title: 'LEVEL 21',
    subtitle: 'Tapeout & Real Chip Flow',
    color: '#7F1D1D',
    why: 'Tapeout is the culmination of the entire chip design effort. Understanding what happens after tapeout — from mask making to silicon bring-up — completes the chip designer\'s knowledge.',
    objectives: [
      'Describe the tapeout process and deliverables',
      'Understand wafer fabrication steps',
      'Explain die packaging and testing',
      'Understand post-silicon validation',
    ],
    concepts: ['Tapeout', 'GDSII/OASIS', 'Mask Generation', 'Wafer Fabrication', 'Dicing', 'Packaging', 'Testing', 'Silicon Bring-Up'],
    explanation: `Tapeout is the formal handoff of the design from the design team to the foundry.

Tapeout Deliverables:
• GDSII or OASIS file (layout geometry — all metal layers and devices)
• Top-level netlist (for LVS reference)
• CDL (Circuit Description Language) file
• Technology files (design rule files, SPICE models)
• Test patterns (for manufacturing test — ATPG vectors)

Mask Generation:
The foundry uses the GDSII to create photolithographic masks — one per layer. A 28nm design may have 50+ mask layers. Mask cost: $1M–$5M for advanced nodes.

Wafer Fabrication:
1. Silicon wafer preparation (ultrapure silicon crystal)
2. Thermal oxidation (gate oxide growth)
3. Photolithography (pattern exposure using masks)
4. Etching (remove exposed material)
5. Deposition (add metal, dielectric, polysilicon layers)
6. Ion implantation (dope silicon to create N-type and P-type regions)
7. Repeat for every layer (50+ iterations for modern chips)

Dicing: Saw the wafer into individual dies (chips).

Packaging: Attach die to package substrate, bond wires or flip-chip connect, encapsulate in plastic/ceramic.

Testing:
• Wafer-level probing: Test each die before dicing
• Final test: Test packaged chips
• Burn-in: Stress test to catch early failures

Silicon Bring-Up:
First silicon from new design. Engineers verify basic functionality, boot the chip, run test patterns, characterize performance vs. specifications. Often reveals post-silicon bugs requiring a re-spin.`,
    vlsiRelevance: 'The entire RTL-to-GDSII flow exists to produce the GDSII file for tapeout. Understanding what happens after tapeout motivates why every signoff check matters.',
    formulas: ['Wafer cost per die ≈ Wafer cost / (Dies per wafer × Yield)', 'Yield = e^(-D₀ × A)', 'where D₀ = defect density, A = die area'],
    example: 'First iPhone processor A4 (2010, TSMC 45nm): 1.17 million transistors, taped out ~6 months before product launch. After tapeout: 6-8 weeks fabrication, 2 weeks packaging, 4 weeks testing → first silicon arrives for bring-up.',
    commonMistakes: [
      'Thinking tapeout = end of work — bring-up, characterization, and bug fixes follow',
      'Underestimating time from tapeout to first silicon — typically 6-10 weeks for leading nodes',
      'Not having test patterns ready — manufacturing test cannot proceed without ATPG vectors',
    ],
    practiceQuestions: [
      { q: 'What is the difference between GDSII and OASIS?', a: 'Both are layout file formats. OASIS is more compact (smaller file size) and is increasingly preferred over GDSII for large designs.' },
      { q: 'Why do foundries require DRC-clean GDSII before tapeout?', a: 'DRC violations indicate geometry that cannot be reliably manufactured — the mask making process would produce defective chips.' },
    ],
    checklist: ['I can list the tapeout deliverables', 'I understand the wafer fabrication sequence', 'I know what silicon bring-up involves', 'I understand the complete RTL-to-Tapeout journey'],
    nextStep: 'You have completed the full LAYRIX roadmap! Start building projects in the Projects section.',
  },
]

type Props = {
  onLevelComplete?: (levelId: number) => void
  completedLevels: Set<number>
}

export default function RoadmapSection({ onLevelComplete, completedLevels }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [shownAnswers, setShownAnswers] = useState<Set<string>>(new Set())

  const toggleAnswer = (key: string) => {
    setShownAnswers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <section className="section roadmap-full-section" id="roadmap">
      <div className="section-heading">
        <p className="section-eyebrow">Complete Learning Roadmap</p>
        <h2>From LEVEL 0 to LEVEL 21 — VLSI Mastery</h2>
        <p className="section-description">
          Every level contains full educational content: explanations, VLSI relevance, equations, examples, practice questions, and checklists. Click any level to expand.
        </p>
      </div>

      <div className="roadmap-progress-bar-wrap">
        <div className="roadmap-progress-label">
          <span>Progress: {completedLevels.size} / {levels.length} Levels</span>
          <span className="roadmap-pct">{Math.round((completedLevels.size / levels.length) * 100)}%</span>
        </div>
        <div className="roadmap-progress-track">
          <div className="roadmap-progress-fill" style={{ width: `${(completedLevels.size / levels.length) * 100}%` }} />
        </div>
      </div>

      <div className="roadmap-levels">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`roadmap-level-card ${expandedLevel === level.id ? 'expanded' : ''} ${completedLevels.has(level.id) ? 'completed' : ''}`}
            style={{ '--level-color': level.color } as React.CSSProperties}
          >
            <button
              type="button"
              className="roadmap-level-header"
              onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
              aria-expanded={expandedLevel === level.id}
            >
              <div className="level-badge" style={{ background: level.color }}>
                L{level.id}
              </div>
              <div className="level-header-text">
                <span className="level-title">{level.title}</span>
                <span className="level-subtitle">{level.subtitle}</span>
              </div>
              {completedLevels.has(level.id) && <span className="level-check">✓</span>}
              <span className="level-chevron">{expandedLevel === level.id ? '▲' : '▼'}</span>
            </button>

            {expandedLevel === level.id && (
              <div className="level-content">
                <div className="level-why">
                  <h4>Why This Level Matters</h4>
                  <p>{level.why}</p>
                </div>

                <div className="level-two-col">
                  <div>
                    <h4>Learning Objectives</h4>
                    <ul>
                      {level.objectives.map((obj) => <li key={obj}>{obj}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4>Key Concepts</h4>
                    <div className="concept-tags">
                      {level.concepts.map((c) => <span key={c} className="concept-tag">{c}</span>)}
                    </div>
                  </div>
                </div>

                <div className="level-explanation">
                  <h4>Detailed Explanation</h4>
                  <div className="explanation-text">
                    {level.explanation.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="level-relevance">
                  <h4>Practical VLSI Relevance</h4>
                  <p>{level.vlsiRelevance}</p>
                </div>

                {level.formulas && level.formulas.length > 0 && (
                  <div className="level-formulas">
                    <h4>Important Formulas</h4>
                    <div className="formula-list">
                      {level.formulas.map((f) => (
                        <div key={f} className="formula-item">{f}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="level-example">
                  <h4>Concrete Example</h4>
                  <div className="example-box">{level.example}</div>
                </div>

                <div className="level-mistakes">
                  <h4>Common Mistakes to Avoid</h4>
                  <ul>
                    {level.commonMistakes.map((m) => <li key={m}>⚠ {m}</li>)}
                  </ul>
                </div>

                <div className="level-practice">
                  <h4>Mini Practice Questions</h4>
                  {level.practiceQuestions.map((pq, qi) => {
                    const key = `${level.id}-${qi}`
                    return (
                      <div key={key} className="practice-question-card">
                        <p className="pq-question">{qi + 1}. {pq.q}</p>
                        <button
                          type="button"
                          className="show-answer-btn"
                          onClick={() => {
                            setExpandedQuestion(expandedQuestion === qi ? null : qi)
                            toggleAnswer(key)
                          }}
                        >
                          {shownAnswers.has(key) ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {shownAnswers.has(key) && (
                          <div className="pq-answer">{pq.a}</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="level-checklist">
                  <h4>Completion Checklist</h4>
                  <ul>
                    {level.checklist.map((item) => <li key={item}>☐ {item}</li>)}
                  </ul>
                </div>

                <div className="level-next">
                  <h4>Suggested Next Step</h4>
                  <p>{level.nextStep}</p>
                </div>

                {onLevelComplete && (
                  <button
                    type="button"
                    className={`mark-complete-btn ${completedLevels.has(level.id) ? 'completed' : ''}`}
                    onClick={() => onLevelComplete(level.id)}
                  >
                    {completedLevels.has(level.id) ? '✓ Level Completed' : 'Mark Level Complete'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
