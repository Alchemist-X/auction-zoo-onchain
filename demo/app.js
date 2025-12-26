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
  renderCases();

  caseForm.addEventListener("submit", handleCaseSubmit);
  seedButton.addEventListener("click", seedSampleCase);
}

init();
