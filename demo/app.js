const auctions = [
  {
    id: "overcollateralized",
    name: "Overcollateralized Vickrey auction",
    summary:
      "Adds griefing resistance by requiring bidders to over-collateralize the value of their sealed bids before reveals.",
    codePath: "../src/sealed-bid/over-collateralized-auction/OverCollateralizedAuction.sol",
    testPath: "../test/OverCollateralizedAuction.t.sol",
    blog: "https://a16zcrypto.com/how-auction-theory-informs-implementations/",
    focus: ["Commit-and-reveal", "Penalty-resistant", "Single-item"],
    phases: [
      {
        title: "Commit",
        duration: "minutes",
        description: "Bidder commits with a hash and deposits 1.5x the bid to discourage griefing.",
        checklist: [
          "hash(bid, salt) stays private",
          "collateral transferred into contract",
          "emits Commit event for ordering",
        ],
      },
      {
        title: "Reveal",
        duration: "minutes",
        description: "Bidders reveal salt + bid; invalid reveals lose collateral if undercollateralized.",
        checklist: [
          "verify commitment matches payload",
          "mark highest valid bid",
          "refund excess collateral",
        ],
      },
      {
        title: "Finalize",
        duration: "minutes",
        description: "Seller claims payment; losers reclaim collateral; winning price is second highest.",
        checklist: [
          "second-price settlement",
          "transfer NFT to winner",
          "cleanup for next sale",
        ],
      },
    ],
    signature: "Collateral-gated reveals with classic Vickrey payout.",
  },
  {
    id: "sneaky",
    name: '"Sneaky" Vickrey auction',
    summary:
      "Intentionally leaks bid ordering through storage writes to show how implementation details reveal signal.",
    codePath: "../src/sealed-bid/sneaky-auction/SneakyAuction.sol",
    testPath: "../test/SneakyAuction.t.sol",
    blog: "https://a16zcrypto.com/hidden-in-plain-sight-a-sneaky-solidity-implementation-of-a-sealed-bid-auction/",
    focus: ["Side-channel study", "Commit-and-reveal", "Storage patterns"],
    phases: [
      {
        title: "Commit",
        duration: "minutes",
        description: "Hash commitments are ordered into storage, leaking relative bid sizes over time.",
        checklist: ["ordered insertions", "commit salt retained", "storage touched per bid"],
      },
      {
        title: "Reveal",
        duration: "minutes",
        description: "Reveals run in that ordering to surface timing attacks and gas griefing opportunities.",
        checklist: ["reconstruct bid", "update apparent leader", "log reveal ordering"],
      },
      {
        title: "Settle",
        duration: "minutes",
        description: "Winner pays second price, but observers could infer ranking earlier via storage diffs.",
        checklist: ["second-price payout", "ordered refunds", "post-mortem analysis"],
      },
    ],
    signature: "A cautionary tale for storage-based side channels.",
  },
  {
    id: "aztec",
    name: "Aztec Connect Vickrey auction",
    summary:
      "Lets bidders submit commitments privately via Aztec, keeping the sealed-bid flow intact on settlement.",
    codePath: "../src/sealed-bid/aztec-connect-auction/AztecConnectAuction.sol",
    testPath: "../test/AztecConnectAuction.t.sol",
    blog: "https://a16zcrypto.com/through-the-looking-glass-a-cross-chain-sealed-bid-auction-using-aztec-connect/",
    focus: ["Cross-chain inbox", "Private commitments", "Bridge settlement"],
    phases: [
      {
        title: "Private commit",
        duration: "bridge rollup",
        description: "Commitments originate in Aztec, arrive via inbox bridge with proofs.",
        checklist: ["validate Aztec proof", "checkpoint inbox hash", "record bidder alias"],
      },
      {
        title: "Reveal",
        duration: "minutes",
        description: "Reveal flows mirror the base Vickrey design; invalid proofs revert.",
        checklist: ["payload checks", "hash binding", "bridge accounting"],
      },
      {
        title: "Settle",
        duration: "minutes",
        description: "Winners pay on L1; optional reconcile with Aztec notes for refunds and payments.",
        checklist: ["L1 settlement", "bridge refund notes", "winner payout"],
      },
    ],
    signature: "Privacy-preserving commitments with public settlement.",
  },
];

const featureGrid = [
  {
    title: "Sealed-bid focus",
    copy: "Every example uses commit-and-reveal mechanics so you can contrast guardrails without context switching.",
    chip: "Vickrey lineage",
  },
  {
    title: "Foundry ready",
    copy: "Tests in ./test mirror each contract; use them as scripts when walking through the live chain demo.",
    chip: "forge test",
  },
  {
    title: "Sandbox safe",
    copy: "The demo keeps funds abstract—no RPC keys needed—so you can storyboard without deploying.",
    chip: "Zero RPC",
  },
  {
    title: "Case builder",
    copy: "Generate auction runbooks with timelines, expected deposits, and reference links in one click.",
    chip: "Storyboard",
  },
];

const sampleNotes = {
  overcollateralized: "Stress test griefing resistance with 1.5x collateral and a tight 30m reveal window.",
  sneaky: "Show how ordered storage writes leak rank; track gas deltas between reveal orderings.",
  aztec: "Demonstrate private commits from Aztec Connect and public settlement on L1.",
};

const gameTargets = {
  overcollateralized: {
    commit: 45,
    reveal: 35,
    finalize: 20,
    tip: "Overcollateralized auctions live or die on commitment discipline.",
  },
  sneaky: {
    commit: 30,
    reveal: 50,
    finalize: 20,
    tip: "The sneaky design rewards heavy reveal scrutiny to spot leakage.",
  },
  aztec: {
    commit: 40,
    reveal: 30,
    finalize: 30,
    tip: "Cross-chain flows need balanced attention to bridge and settlement.",
  },
};

const gamePlan = [
  {
    title: "Define the core loop",
    detail: "Translate auction phases into scoring weights and player actions.",
  },
  {
    title: "Prototype UI + feedback",
    detail: "Expose sliders, show remaining points, and surface real-time hints.",
  },
  {
    title: "Add dynamics",
    detail: "Introduce random events, difficulty tiers, and data-driven targets.",
  },
  {
    title: "Ship analytics",
    detail: "Track player strategies and export results for workshop sessions.",
  },
];

const botStrategies = {
  balanced: { commit: 35, reveal: 35, finalize: 30 },
  commit: { commit: 50, reveal: 30, finalize: 20 },
  reveal: { commit: 25, reveal: 55, finalize: 20 },
  finalize: { commit: 30, reveal: 25, finalize: 45 },
};

const cases = [];

const heroSnapshot = document.getElementById("heroSnapshot");
const auctionList = document.getElementById("auctionList");
const auctionDetails = document.getElementById("auctionDetails");
const phaseBoard = document.getElementById("phaseBoard");
const auctionTitle = document.getElementById("auctionTitle");
const auctionSubtitle = document.getElementById("auctionSubtitle");
const caseForm = document.getElementById("caseForm");
const caseGrid = document.getElementById("caseGrid");
const caseCount = document.getElementById("caseCount");
const seedButton = document.getElementById("seedCase");
const gameForm = document.getElementById("gameForm");
const gameAuctionSelect = document.getElementById("gameAuction");
const allocationRemaining = document.getElementById("allocationRemaining");
const roundDisplay = document.getElementById("roundDisplay");
const matchStatus = document.getElementById("matchStatus");
const totalRoundsInput = document.getElementById("totalRounds");
const gameResult = document.getElementById("gameResult");
const gameScore = document.getElementById("gameScore");
const gameLog = document.getElementById("gameLog");
const gameBoard = document.getElementById("gameBoard");
const gamePlanList = document.getElementById("gamePlan");
const randomStrategyButton = document.getElementById("randomStrategy");
const resetMatchButton = document.getElementById("resetMatch");
const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("playerCount");
const participantForm = document.getElementById("participantForm");
const participantName = document.getElementById("participantName");
const participantStrategy = document.getElementById("participantStrategy");
const participantJson = document.getElementById("participantJson");
const addBotButton = document.getElementById("addBot");
const addLlmButton = document.getElementById("addLlm");

const allocationInputs = Array.from(document.querySelectorAll("[data-allocation]"));
const allocationValueEls = {
  commit: document.getElementById("commitValue"),
  reveal: document.getElementById("revealValue"),
  finalize: document.getElementById("finalizeValue"),
};

const gameHistory = [];
const gameState = {
  currentRound: 1,
  totalRounds: 3,
  participants: [
    {
      id: "human",
      name: "You",
      type: "human",
      totalScore: 0,
    },
  ],
};

function renderFeatureGrid() {
  const grid = document.getElementById("featureGrid");
  grid.innerHTML = featureGrid
    .map(
      ({ title, copy, chip }) => `
        <article class="panel">
          <p class="pill">${chip}</p>
          <h3>${title}</h3>
          <p>${copy}</p>
        </article>
      `
    )
    .join("");
}

function renderHeroSnapshot() {
  heroSnapshot.innerHTML = auctions
    .slice(0, 4)
    .map(
      (auction) => `
        <div class="snapshot-card">
          <h4>${auction.name}</h4>
          <div class="snapshot-metric"><span>Phase count</span><strong>${auction.phases.length}</strong></div>
          <div class="snapshot-metric"><span>Signature</span><strong>${auction.signature}</strong></div>
        </div>
      `
    )
    .join("");
}

function renderAuctionList(activeId) {
  auctionList.innerHTML = auctions
    .map(
      (auction) => `
        <div class="list-item ${activeId === auction.id ? "active" : ""}" data-auction="${auction.id}">
          <div class="section-header">
            <div>
              <strong>${auction.name}</strong>
              <p>${auction.signature}</p>
            </div>
            <span class="pill">${auction.focus[0]}</span>
          </div>
          <div class="tags">
            ${auction.focus
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  Array.from(auctionList.children).forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.auction;
      selectAuction(id);
    });
  });
}

function renderAuctionDetails(auction) {
  auctionTitle.textContent = auction.name;
  auctionSubtitle.textContent = auction.summary;

  auctionDetails.innerHTML = `
    <p>${auction.summary}</p>
    <div class="section__chips">
      ${auction.focus
        .map((f) => `<span class="pill">${f}</span>`)
        .join("")}
    </div>
    <div class="section__links">
      <a href="${auction.codePath}" target="_blank">View contract</a>
      <a href="${auction.testPath}" target="_blank">View tests</a>
      <a href="${auction.blog}" target="_blank">Read the deep dive</a>
    </div>
  `;

  phaseBoard.innerHTML = `
    <div class="phase-board">
      ${auction.phases
        .map(
          (phase, idx) => `
            <div class="phase">
              <h4>${idx + 1}. ${phase.title}</h4>
              <p>${phase.description}</p>
              <ul class="checklist">
                ${phase.checklist.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              <span class="tag tag--accent">${phase.duration}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function selectAuction(id) {
  const auction = auctions.find((a) => a.id === id) || auctions[0];
  renderAuctionList(auction.id);
  renderAuctionDetails(auction);
  updateFormOptions(auction.id);
}

function updateFormOptions(activeId) {
  const select = caseForm.elements["auctionId"];
  select.innerHTML = auctions
    .map(
      (a) => `<option value="${a.id}" ${activeId === a.id ? "selected" : ""}>${a.name}</option>`
    )
    .join("");
}

function renderGameOptions(activeId) {
  gameAuctionSelect.innerHTML = auctions
    .map(
      (a) => `<option value="${a.id}" ${activeId === a.id ? "selected" : ""}>${a.name}</option>`
    )
    .join("");
}

function renderGamePlan() {
  if (!gamePlanList) return;
  gamePlanList.innerHTML = gamePlan
    .map(
      (step, index) => `
        <li>
          <strong>${index + 1}. ${step.title}</strong>
          <p>${step.detail}</p>
        </li>
      `
    )
    .join("");
}

function renderPlayers() {
  playerList.innerHTML = gameState.participants
    .map(
      (player) => `
        <div class="player-card">
          <div>
            <strong>${player.name}</strong>
            <p>${player.type === "human" ? "Human strategist" : "LLM/Bot participant"}</p>
          </div>
          <span class="pill pill--muted">${player.totalScore} pts</span>
        </div>
      `
    )
    .join("");
  playerCount.textContent = `${gameState.participants.length} player${
    gameState.participants.length === 1 ? "" : "s"
  }`;
}

function getAllocationTotals() {
  return allocationInputs.reduce((total, input) => total + Number(input.value), 0);
}

function updateAllocationDisplay() {
  allocationInputs.forEach((input) => {
    const key = input.dataset.allocation;
    const output = allocationValueEls[key];
    if (output) {
      output.textContent = input.value;
    }
  });

  const total = getAllocationTotals();
  const remaining = 100 - total;
  allocationRemaining.textContent =
    remaining >= 0 ? `${remaining} points remaining` : `${Math.abs(remaining)} points over`;
  allocationRemaining.classList.toggle("pill--danger", remaining < 0);
}

function updateRoundStatus() {
  roundDisplay.textContent = `Round ${gameState.currentRound} / ${gameState.totalRounds}`;
  if (gameState.currentRound > gameState.totalRounds) {
    matchStatus.textContent = "Match complete";
    return;
  }
  matchStatus.textContent = gameHistory.length ? "Match in progress" : "Match ready";
}

function scoreAllocation(target, allocation) {
  const diff =
    Math.abs(allocation.commit - target.commit) +
    Math.abs(allocation.reveal - target.reveal) +
    Math.abs(allocation.finalize - target.finalize);
  return Math.max(0, 100 - diff);
}

function getAllocationValues() {
  return allocationInputs.reduce((acc, input) => {
    acc[input.dataset.allocation] = Number(input.value);
    return acc;
  }, {});
}

function normalizeAllocation(values) {
  const total = values.commit + values.reveal + values.finalize;
  if (!total) {
    return { commit: 34, reveal: 33, finalize: 33 };
  }
  const commit = Math.round((values.commit / total) * 100);
  const reveal = Math.round((values.reveal / total) * 100);
  return {
    commit,
    reveal,
    finalize: Math.max(0, 100 - commit - reveal),
  };
}

function renderGameResult(payload) {
  const { score, target, allocation, outcome, tip } = payload;
  gameScore.textContent = `${score} / 100`;

  gameResult.innerHTML = `
    <div class="game__summary">
      <h4>${outcome}</h4>
      <p>${tip}</p>
    </div>
    <div class="game__metrics">
      <div>
        <span>Commit</span>
        <strong>${allocation.commit} / ${target.commit}</strong>
      </div>
      <div>
        <span>Reveal</span>
        <strong>${allocation.reveal} / ${target.reveal}</strong>
      </div>
      <div>
        <span>Finalize</span>
        <strong>${allocation.finalize} / ${target.finalize}</strong>
      </div>
    </div>
  `;
}

function renderLeaderboard() {
  const rows = [...gameState.participants]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map(
      (player, index) => `
        <div class="game__row">
          <span>${index + 1}</span>
          <strong>${player.name}</strong>
          <em>${player.totalScore} pts</em>
        </div>
      `
    )
    .join("");
  gameBoard.innerHTML = rows || "<p>No rounds yet.</p>";
}

function updateGameLog(entry) {
  gameHistory.unshift(entry);
  if (gameHistory.length > 3) {
    gameHistory.pop();
  }

  gameLog.innerHTML = gameHistory
    .map(
      (item) => `
        <div class="game__log-item">
          <span>${item.time}</span>
          <strong>${item.auction}</strong>
          <em>${item.score}</em>
        </div>
      `
    )
    .join("");
}

function getParticipantAllocation(player, roundIndex, target) {
  if (player.type === "human") {
    return getAllocationValues();
  }
  if (player.rounds && player.rounds[roundIndex]) {
    return normalizeAllocation(player.rounds[roundIndex]);
  }
  if (player.weights) {
    return normalizeAllocation(player.weights);
  }
  if (player.strategyKey && botStrategies[player.strategyKey]) {
    return normalizeAllocation(botStrategies[player.strategyKey]);
  }
  return normalizeAllocation(target);
}

function handleGameSubmit(event) {
  event.preventDefault();
  const allocation = getAllocationValues();
  const total = getAllocationTotals();
  const auctionId = gameAuctionSelect.value;
  const target = gameTargets[auctionId];

  if (gameState.currentRound > gameState.totalRounds) {
    gameResult.innerHTML = `<p>The match is complete. Reset to start a new multi-round sprint.</p>`;
    return;
  }

  if (total !== 100) {
    gameResult.innerHTML = `<p>Please allocate exactly 100 points to run the round.</p>`;
    gameScore.textContent = "Allocation needed";
    return;
  }

  const roundIndex = gameState.currentRound - 1;
  const results = gameState.participants.map((player) => {
    const playerAllocation = getParticipantAllocation(player, roundIndex, target);
    const score = scoreAllocation(target, playerAllocation);
    player.totalScore += score;
    return { player, allocation: playerAllocation, score };
  });

  const humanResult = results.find((result) => result.player.type === "human");
  const outcome =
    humanResult.score >= 85
      ? "Master strategist"
      : humanResult.score >= 70
      ? "Solid execution"
      : "Risky deployment";
  const tip = `${target.tip} Ideal mix: ${target.commit}/${target.reveal}/${target.finalize}.`;

  renderGameResult({ score: humanResult.score, target, allocation, outcome, tip });
  updateGameLog({
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    auction: `${auctions.find((a) => a.id === auctionId).name} · Round ${gameState.currentRound}`,
    score: `${humanResult.score} pts`,
  });
  renderPlayers();
  renderLeaderboard();

  gameState.currentRound += 1;
  updateRoundStatus();
}

function randomizeAllocation() {
  const first = Math.floor(Math.random() * 101);
  const second = Math.floor(Math.random() * (101 - first));
  const third = 100 - first - second;
  const values = [first, second, third];

  allocationInputs.forEach((input, index) => {
    input.value = values[index];
  });
  updateAllocationDisplay();
}

function resetMatch() {
  gameState.currentRound = 1;
  gameState.totalRounds = Number(totalRoundsInput.value) || 3;
  gameState.participants.forEach((player) => {
    player.totalScore = 0;
  });
  gameHistory.length = 0;
  gameLog.innerHTML = "";
  gameScore.textContent = "Awaiting play";
  gameResult.innerHTML = `<p>Choose an auction and balance your points to launch the simulation.</p>`;
  renderPlayers();
  renderLeaderboard();
  updateRoundStatus();
  matchStatus.textContent = "Match reset";
}

function addBotParticipant() {
  const name = participantName.value.trim() || "Bot Strategist";
  const strategyKey = participantStrategy.value;
  gameState.participants.push({
    id: `bot-${Date.now()}`,
    name,
    type: "bot",
    strategyKey,
    totalScore: 0,
  });
  participantName.value = "";
  renderPlayers();
  renderLeaderboard();
}

function addLlmParticipant() {
  if (!participantJson.value.trim()) {
    gameResult.innerHTML = `<p>Please paste a JSON strategy to import an LLM participant.</p>`;
    return;
  }

  try {
    const payload = JSON.parse(participantJson.value);
    const name = payload.name || participantName.value.trim() || "LLM Participant";
    const rounds = Array.isArray(payload.rounds) ? payload.rounds : null;
    const weights = payload.weights || (typeof payload.strategy === "object" ? payload.strategy : null);
    const strategyKey = typeof payload.strategy === "string" ? payload.strategy : null;

    gameState.participants.push({
      id: `llm-${Date.now()}`,
      name,
      type: "llm",
      rounds,
      weights,
      strategyKey,
      totalScore: 0,
    });
    participantJson.value = "";
    participantName.value = "";
    renderPlayers();
    renderLeaderboard();
  } catch (error) {
    gameResult.innerHTML = `<p>Invalid JSON. Make sure the LLM output is valid JSON.</p>`;
  }
}

function upsertCase(newCase) {
  cases.unshift(newCase);
  renderCases();
}

function renderCases() {
  caseCount.textContent = `${cases.length} case${cases.length === 1 ? "" : "s"}`;

  if (!cases.length) {
    caseGrid.innerHTML = `<p class="card">No storyboard yet. Generate a case to see the runbook.</p>`;
    return;
  }

  caseGrid.innerHTML = cases
    .map((c) => {
      const auction = auctions.find((a) => a.id === c.auctionId);
      const timeline = buildTimeline(auction, c);
      return `
        <article class="case-card">
          <div class="section-header">
            <div>
              <h3>${c.nftId} · ${auction.name}</h3>
              <p>${c.notes || sampleNotes[c.auctionId]}</p>
            </div>
            <span class="pill">${c.reserve} ETH reserve</span>
          </div>
          <div class="metrics">
            <div class="metric"><span>Collateral</span><strong>${c.collateral}% of bid</strong></div>
            <div class="metric"><span>Windows</span><strong>${c.commit}m commit · ${c.reveal}m reveal</strong></div>
            <div class="metric"><span>Bidders</span><strong>${c.bidders} expected</strong></div>
            <div class="metric"><span>Finalization</span><strong>${c.finalize}m buffer</strong></div>
          </div>
          <div class="timeline">
            ${timeline
              .map(
                (item) => `
                  <div class="timeline-item">
                    <strong>${item.label}</strong>
                    <small>${item.detail}</small>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="tags">
            <span class="tag">${auction.focus[0]}</span>
            <span class="tag">${auction.focus[1]}</span>
            <span class="tag">Storyboard ${c.id}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildTimeline(auction, c) {
  const minCollateral = (c.reserve * (c.collateral / 100)).toFixed(2);
  return [
    {
      label: "Commit",
      detail: `${c.commit}m window · lock ≥ ${minCollateral} ETH collateral per bid`,
    },
    {
      label: "Reveal",
      detail: `${c.reveal}m window · validate salt + bid and rank for second price`,
    },
    {
      label: "Finalize",
      detail: `${c.finalize}m buffer · settle with winner paying second price`,
    },
    {
      label: "Reference",
      detail: `Check ${auction.testPath.replace("../", "./")} for the matching Foundry walkthrough`,
    },
  ];
}

function handleCaseSubmit(event) {
  event.preventDefault();
  const data = new FormData(caseForm);
  const payload = {
    id: `${cases.length + 1}`.padStart(2, "0"),
    auctionId: data.get("auctionId"),
    nftId: data.get("nftId") || "#4921",
    reserve: Number(data.get("reserve")) || 0,
    collateral: Number(data.get("collateral")) || 0,
    commit: Number(data.get("commit")) || 0,
    reveal: Number(data.get("reveal")) || 0,
    finalize: Number(data.get("finalize")) || 0,
    bidders: Number(data.get("bidders")) || 0,
    notes: data.get("notes"),
  };

  upsertCase(payload);
}

function seedSampleCase() {
  const pick = auctions[Math.floor(Math.random() * auctions.length)];
  const payload = {
    id: `${cases.length + 1}`.padStart(2, "0"),
    auctionId: pick.id,
    nftId: "#721-demo",
    reserve: 2.5,
    collateral: pick.id === "overcollateralized" ? 150 : 100,
    commit: pick.id === "aztec" ? 20 : 30,
    reveal: 25,
    finalize: 15,
    bidders: 4,
    notes: sampleNotes[pick.id],
  };
  upsertCase(payload);
  updateFormOptions(pick.id);
}

function init() {
  renderFeatureGrid();
  renderHeroSnapshot();
  renderAuctionList(auctions[0].id);
  renderAuctionDetails(auctions[0]);
  updateFormOptions(auctions[0].id);
  renderGameOptions(auctions[0].id);
  renderGamePlan();
  renderCases();
  updateAllocationDisplay();
  gameState.totalRounds = Number(totalRoundsInput.value) || 3;
  updateRoundStatus();
  renderPlayers();
  renderLeaderboard();

  caseForm.addEventListener("submit", handleCaseSubmit);
  seedButton.addEventListener("click", seedSampleCase);

  allocationInputs.forEach((input) => {
    input.addEventListener("input", updateAllocationDisplay);
  });
  gameForm.addEventListener("submit", handleGameSubmit);
  randomStrategyButton.addEventListener("click", randomizeAllocation);
  resetMatchButton.addEventListener("click", resetMatch);
  totalRoundsInput.addEventListener("change", resetMatch);
  addBotButton.addEventListener("click", addBotParticipant);
  addLlmButton.addEventListener("click", addLlmParticipant);
  participantForm.addEventListener("submit", (event) => event.preventDefault());
}

init();
