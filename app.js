/* Northeastern Greek — all client-side functionality; no account or server required. */
(() => {
  "use strict";

  const app = document.getElementById("app");
  const CATEGORY_NAMES = ["All Categories", "Social", "Philanthropy", "Recruitment", "Academic", "Community"];
  const today = new Date();
  const state = {
    directory: { search: "", type: "", council: "" },
    calendar: {
      month: new Date(today.getFullYear(), today.getMonth(), 1),
      view: window.innerWidth < 600 ? "list" : "month",
      category: "All Categories",
    },
    currentRoute: "",
  };

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const escapeAttr = escapeHTML;
  const parseDate = (date) => new Date(`${date}T12:00:00`);
  const monthName = (date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const shortMonth = (date) => date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const formatFullDate = (date) => parseDate(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const councilName = (id) => COUNCILS.find(c => c.id === id)?.name ?? id;
  const validHttpUrl = (value) => { try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const currentPath = () => (window.location.hash.slice(1) || "/").split("?")[0];
  const routeParams = () => new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const directoryHref = (type = "", council = "") => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (council) params.set("council", council);
    return `#/directory${params.size ? `?${params}` : ""}`;
  };
  const getCategoryClass = (category) => category.toLowerCase().replace(/[^a-z]/g, "");

  function header(path) {
    const isDirectory = path === "/directory" || path.startsWith("/chapter/");
    const links = [
      ["#/", "Home", path === "/"],
      ["#/directory", "Directory", isDirectory],
      ["#/calendar", "Calendar", path === "/calendar"],
      ["#/for-chapters", "For Chapters", path === "/for-chapters"],
    ];
    const nav = (cls) => links.map(([href, label, active]) => `<a href="${href}" class="${active ? "active" : ""}" ${active ? 'aria-current="page"' : ""}>${label}</a>`).join("");
    return `<header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="#/" aria-label="Northeastern Greek home"><span>NORTHEASTERN</span><span>GREEK</span></a>
        <nav class="desktop-nav" aria-label="Primary navigation">${nav()}</nav>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation" data-mobile-toggle aria-label="Toggle navigation">☰</button>
      </div>
      <nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" hidden>${nav()}</nav>
    </header>`;
  }

  function footer() {
    return `<footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <a class="brand" href="#/" aria-label="Northeastern Greek home"><span>NORTHEASTERN</span><span>GREEK</span></a>
          <nav class="footer-links" aria-label="Footer navigation"><a href="#/">Home</a><a href="#/directory">Directory</a><a href="#/calendar">Calendar</a><a href="#/for-chapters">For Chapters</a></nav>
        </div>
        <div class="footer-bottom">
          <p class="footer-disclaimer">Northeastern Greek is an independent, student-built resource and is not affiliated with, endorsed by, or operated by Northeastern University. Organization names are presented for informational purposes. Listings may be incomplete; demo events are fictional.</p>
          <span class="footer-copy">© ${new Date().getFullYear()} Northeastern Greek</span>
        </div>
      </div>
    </footer>`;
  }

  function orgCard(chapter) {
    const councilClass = ["Panhellenic", "NPHC"].includes(chapter.council) ? "red" : "";
    return `<a class="org-card" href="#/chapter/${escapeAttr(chapter.id)}" aria-label="View ${escapeAttr(chapter.name)} profile">
      <div><h3>${escapeHTML(chapter.name)}</h3><span class="org-type">${escapeHTML(chapter.type)}</span></div>
      <div class="org-card-bottom"><span class="pill ${councilClass}">${escapeHTML(chapter.council)}</span><span class="card-view">View →</span></div>
    </a>`;
  }

  function councilCard(council) {
    const count = CHAPTERS.filter(c => c.council === council.id).length;
    return `<a class="council-card" href="${directoryHref("", council.id)}" aria-label="View ${escapeAttr(council.name)} organizations">
      <span class="council-kicker">${escapeHTML(council.kicker)}</span>
      <h3>${escapeHTML(council.id)}</h3>
      <span class="council-name">${escapeHTML(council.name)}</span>
      <span class="council-count"><strong>${count}</strong> ${count === 1 ? "organization" : "organizations"} listed</span>
    </a>`;
  }

  function eventPreview(event) {
    const date = parseDate(event.date);
    return `<a class="event-preview-card" href="#/calendar" aria-label="Explore demo calendar, including ${escapeAttr(event.title)}">
      <div class="event-date"><strong>${date.getDate()}</strong><span>${shortMonth(date)}</span></div>
      <div class="event-preview-content"><span class="pill ${["Philanthropy", "Community"].includes(event.category) ? "red" : ""}">${escapeHTML(event.category)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.host)} · Fictional example</p></div>
    </a>`;
  }

  function homePage() {
    const frats = CHAPTERS.filter(c => c.type === "Fraternity").length;
    const sororities = CHAPTERS.filter(c => c.type === "Sorority").length;
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const upcoming = [...DEMO_EVENTS].filter(e => parseDate(e.date) >= currentDay).sort((a, b) => a.date.localeCompare(b.date));
    const previews = (upcoming.length ? upcoming : [...DEMO_EVENTS].sort((a, b) => a.date.localeCompare(b.date))).slice(0, 3);
    return `<section class="hero hero-home">
      <div class="container hero-content">
        <div class="eyebrow">THE INDEPENDENT STUDENT GUIDE</div>
        <h1><span class="line">Your Guide to</span><span class="line">Greek Life at</span><span class="line">Northeastern.</span></h1>
        <p class="hero-description">Discover chapters. Explore events. Find your community. One place to navigate Greek life at Northeastern.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="#/directory">Explore Organizations <span aria-hidden="true">→</span></a><a class="btn btn-outline-light" href="#/calendar">View Calendar <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="container"><div class="hero-stats">
        <div class="stat"><strong>${CHAPTERS.length}</strong><span>Chapters listed</span></div>
        <div class="stat"><strong>${COUNCILS.length}</strong><span>Governing councils</span></div>
        <div class="stat"><strong>${frats}</strong><span>Fraternities</span></div>
        <div class="stat"><strong>${sororities}</strong><span>Sororities</span></div>
      </div></div>
    </section>
    <section class="section section-gray"><div class="container">
      <div class="section-heading"><div><div class="red-rule"></div><h2>Four councils. One community.</h2><p class="section-subtitle">Explore organizations by their governing council.</p></div></div>
      <div class="council-grid">${COUNCILS.map(councilCard).join("")}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-heading"><div><div class="red-rule"></div><h2>Explore organizations</h2><p class="section-subtitle">Start with our growing directory of fraternities and sororities.</p></div><a class="text-link" href="#/directory">View all ${CHAPTERS.length} organizations <span aria-hidden="true">→</span></a></div>
      <div class="org-grid">${CHAPTERS.slice(0, 4).map(orgCard).join("")}</div>
      <div class="center-actions"><a class="btn btn-outline" href="#/directory">View All Organizations <span aria-hidden="true">→</span></a></div>
    </div></section>
    <section class="section section-gray"><div class="container">
      <div class="section-heading"><div><div class="red-rule"></div><h2>See what's possible</h2><p class="section-subtitle">A preview of how chapter events could appear in one shared calendar.</p></div><a class="text-link" href="#/calendar">Explore calendar <span aria-hidden="true">→</span></a></div>
      <div style="margin-bottom:20px"><span class="demo-label">⚠ All events shown below are fictional prototype examples.</span></div>
      <div class="events-preview">${previews.map(eventPreview).join("")}</div>
    </div></section>
    <section class="cta-section"><div class="container cta-inner"><div><h2>Run a chapter? Help shape this.</h2><p>Update your listing, connect your independent chapter website, or learn how event submissions will work as the pilot grows.</p></div><a class="btn btn-primary" href="#/for-chapters">For Chapters <span aria-hidden="true">→</span></a></div></section>`;
  }

  function directoryPage() {
    return `<section class="page-hero"><div class="container"><div class="red-rule"></div><h1>Organization Directory</h1><p>${CHAPTERS.length} organizations across ${COUNCILS.length} governing councils.</p></div></section>
      <section class="directory-tools" aria-label="Directory filters"><div class="container directory-tool-inner">
        <label class="search-box"><span aria-hidden="true">⌕</span><input data-directory-search type="search" placeholder="Search organizations..." value="${escapeAttr(state.directory.search)}" aria-label="Search organizations" autocomplete="off" /></label>
        <div class="filter-groups"><div class="filter-group"><span class="filter-label">TYPE</span>
          ${["Fraternity", "Sorority"].map(type => `<button type="button" class="filter-btn ${state.directory.type === type ? "selected" : ""}" data-filter-type="${type}" aria-pressed="${state.directory.type === type}">${type}</button>`).join("")}
        </div><div class="filter-group"><span class="filter-label">COUNCIL</span>
          ${COUNCILS.map(c => `<button type="button" class="filter-btn ${state.directory.council === c.id ? "selected" : ""}" data-filter-council="${escapeAttr(c.id)}" aria-pressed="${state.directory.council === c.id}">${escapeHTML(c.id)}</button>`).join("")}
        </div><button type="button" class="filter-clear" data-filter-clear>Clear filters</button></div>
      </div></section>
      <section class="directory-results"><div class="container"><p id="results-label" class="results-label" aria-live="polite"></p><div id="results-grid" class="org-grid"></div><div id="results-empty"></div></div></section>`;
  }

  function filteredChapters() {
    const { search, type, council } = state.directory;
    const term = search.trim().toLowerCase();
    return CHAPTERS.filter(ch => (!type || ch.type === type) && (!council || ch.council === council) && (!term || `${ch.name} ${ch.type} ${ch.council} ${councilName(ch.council)}`.toLowerCase().includes(term)));
  }

  function updateDirectoryResults() {
    const results = filteredChapters();
    const grid = document.getElementById("results-grid");
    if (!grid) return;
    grid.innerHTML = results.map(orgCard).join("");
    document.getElementById("results-label").textContent = `${results.length === CHAPTERS.length ? "ALL " : ""}${results.length} ${results.length === 1 ? "ORGANIZATION" : "ORGANIZATIONS"}`;
    document.getElementById("results-empty").innerHTML = results.length ? "" : `<div class="empty-state"><h3>No organizations found</h3><p>Try a different search or clear your filters.</p><button class="btn btn-dark" type="button" data-filter-clear>Clear filters</button></div>`;
  }

  function profilePage(chapter) {
    const council = COUNCILS.find(c => c.id === chapter.council);
    const siteUrl = validHttpUrl(chapter.website);
    const instaUrl = validHttpUrl(chapter.instagram);
    return `<section class="profile-hero"><div class="profile-hero-inner">
      <a class="back-link" href="#/directory"><span aria-hidden="true">←</span> Back to directory</a>
      <div class="profile-meta"><strong>${escapeHTML(chapter.council)}</strong><span>${escapeHTML(chapter.type)}</span></div>
      <div class="red-rule"></div><h1>${escapeHTML(chapter.name)}</h1>
    </div></section>
    <div class="profile-content">
      <div class="profile-main">
        <section class="profile-section"><h2>About</h2>${chapter.description ? `<p>${escapeHTML(chapter.description)}</p>` : `<p class="muted-italic">This organization has not added a description yet.</p>`}</section>
        <section class="profile-section"><h2>Chapter website</h2>
          ${siteUrl ? `<a class="btn btn-primary" href="${escapeAttr(siteUrl)}" target="_blank" rel="noopener noreferrer">Visit Chapter Website <span aria-hidden="true">↗</span></a>` : `<p>No independent chapter website has been linked yet.</p>`}
        </section>
        ${instaUrl ? `<section class="profile-section"><h2>Social media</h2><a class="text-link" href="${escapeAttr(instaUrl)}" target="_blank" rel="noopener noreferrer">Visit Instagram ↗</a></section>` : ""}
        <section class="profile-section"><h2>Is this your chapter?</h2><p>Help keep your chapter's information accurate and connect your independent website.</p><a class="btn btn-outline" href="#/for-chapters?chapter=${encodeURIComponent(chapter.id)}">Claim or Update This Listing <span aria-hidden="true">→</span></a></section>
      </div>
      <aside class="profile-side" aria-label="Organization information">
        <div class="info-panel"><h3>Governing council</h3><strong>${escapeHTML(chapter.council)}</strong><p>${escapeHTML(council?.name ?? chapter.council)}</p><a href="${directoryHref("", chapter.council)}">View all ${escapeHTML(chapter.council)} organizations →</a></div>
        <div class="info-panel secondary"><h3>Organization type</h3><strong>${escapeHTML(chapter.type)}</strong><a href="${directoryHref(chapter.type)}">View all ${escapeHTML(chapter.type.toLowerCase())}s →</a></div>
      </aside>
      <p class="profile-note">ⓘ Listings are preliminary and may be incomplete. Information is provided for discovery purposes only and does not establish current university recognition or affiliation. Chapter representatives can request corrections through the For Chapters page.</p>
    </div>`;
  }

  function calendarPage() {
    return `<section class="page-hero"><div class="container"><div class="red-rule"></div><h1>Event Calendar</h1><p>Explore how Greek life events could be discovered in one place.</p></div></section>
      <div class="demo-banner"><div class="container demo-banner-inner"><span aria-hidden="true">⚠</span><span>These are fictional prototype demo events. They do not represent real scheduled activities.</span></div></div>
      <section class="calendar-tools" aria-label="Calendar controls"><div class="container calendar-toolbar">
        <div class="calendar-toolbar-left"><button class="square-btn" type="button" data-calendar-nav="-1" aria-label="Previous month">‹</button><span id="calendar-month-title" class="month-title"></span><button class="square-btn" type="button" data-calendar-nav="1" aria-label="Next month">›</button><button class="today-btn" type="button" data-calendar-today>Today</button>
          <div class="toggle-group" role="group" aria-label="Calendar view"><button type="button" data-calendar-view="month" class="${state.calendar.view === "month" ? "active" : ""}" aria-pressed="${state.calendar.view === "month"}">▦ Month</button><button type="button" data-calendar-view="list" class="${state.calendar.view === "list" ? "active" : ""}" aria-pressed="${state.calendar.view === "list"}">☷ List</button></div>
        </div>
        <div class="calendar-toolbar-right" role="group" aria-label="Event category filters">${CATEGORY_NAMES.map(c => `<button class="filter-btn ${state.calendar.category === c ? "selected" : ""}" type="button" data-event-category="${escapeAttr(c)}" aria-pressed="${state.calendar.category === c}">${escapeHTML(c)}</button>`).join("")}</div>
      </div></section>
      <section class="calendar-area"><div class="container"><div id="calendar-view-content"></div></div></section>`;
  }

  function eventsInCurrentMonth() {
    const { month, category } = state.calendar;
    return DEMO_EVENTS.filter(event => {
      const date = parseDate(event.date);
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth() && (category === "All Categories" || category === event.category);
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  function calendarMonthGrid(events) {
    const { month } = state.calendar;
    const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = Math.ceil((firstWeekday + days) / 7) * 7;
    let html = `<div class="calendar-grid-wrap"><div class="calendar-grid" role="grid" aria-label="${escapeAttr(monthName(month))} demo event calendar">`;
    for (const weekday of ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]) html += `<div class="weekday" role="columnheader">${weekday}</div>`;
    for (let i = 0; i < cells; i++) {
      const day = i - firstWeekday + 1;
      const outside = day < 1 || day > days;
      const isToday = !outside && today.getDate() === day && today.getMonth() === month.getMonth() && today.getFullYear() === month.getFullYear();
      const dayEvents = outside ? [] : events.filter(e => parseDate(e.date).getDate() === day);
      html += `<div class="day-cell ${outside ? "outside" : ""}" role="gridcell" ${!outside ? `aria-label="${escapeAttr(monthName(month))} ${day}"` : ""}>`;
      if (!outside) html += `<span class="day-number ${isToday ? "today" : ""}" ${isToday ? 'aria-current="date"' : ""}>${day}</span>`;
      for (const event of dayEvents) html += `<button type="button" class="calendar-event ${getCategoryClass(event.category)}" data-event-id="${escapeAttr(event.id)}" title="${escapeAttr(event.title)} (demo event)">${escapeHTML(event.title)}</button>`;
      html += `</div>`;
    }
    html += `</div></div><p class="calendar-hint">All events are fictional. ${events.length ? "Select an event to view its example details." : "No sample events are listed for this month and filter."} On small screens, scroll sideways to view the full month.</p>`;
    return html;
  }

  function calendarList(events) {
    if (!events.length) return `<div class="empty-state"><h3>No demo events this month</h3><p>Try a different month or event category.</p><button class="btn btn-dark" type="button" data-event-category="All Categories">Show all categories</button></div>`;
    return `<div class="calendar-list">${events.map(event => {
      const date = parseDate(event.date);
      return `<button class="list-event" type="button" data-event-id="${escapeAttr(event.id)}">
        <div class="list-event-date"><strong>${date.getDate()}</strong><span>${shortMonth(date)}</span></div>
        <div class="list-event-main"><span class="pill ${["Community", "Philanthropy"].includes(event.category) ? "red" : ""}">${escapeHTML(event.category)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.time)} · ${escapeHTML(event.host)} · Demo event</p></div><span aria-hidden="true">→</span>
      </button>`;
    }).join("")}</div>`;
  }

  function updateCalendarView() {
    const label = document.getElementById("calendar-month-title");
    const content = document.getElementById("calendar-view-content");
    if (!label || !content) return;
    label.textContent = monthName(state.calendar.month);
    const events = eventsInCurrentMonth();
    content.innerHTML = state.calendar.view === "month" ? calendarMonthGrid(events) : calendarList(events);
  }

  function forChaptersPage() {
    const requested = routeParams().get("chapter") || "";
    return `<section class="page-hero"><div class="container"><div class="red-rule"></div><h1>For Chapters</h1><p>Make your chapter easier to discover. Help keep this directory accurate.</p></div></section>
      <section class="section"><div class="container for-chapters-grid">
        <div class="content-block"><div class="red-rule"></div><h2>Built with chapters, not just for them.</h2>
          <p>Northeastern Greek is an independent student-built pilot. The goal is simple: help students discover organizations while giving each chapter room to maintain its own identity and website.</p>
          <p>We're starting with a small directory and a demonstration calendar. Chapter-led updates and real event submissions are planned for a later phase.</p>
          <div class="process-list">
            <div class="process-item"><span class="process-index">01</span><div><strong>Review your listing</strong><p>Check your name, council, type, and website link for accuracy.</p></div></div>
            <div class="process-item"><span class="process-index">02</span><div><strong>Connect your chapter website</strong><p>Keep your own independent site while making it easier for students to find you.</p></div></div>
            <div class="process-item"><span class="process-index">03</span><div><strong>Help shape event discovery</strong><p>Share feedback on what a chapter-friendly public events calendar should offer.</p></div></div>
          </div>
        </div>
        <div class="request-panel"><h2>Prepare a listing request</h2><p class="helper">Choose a chapter and describe the change. ${SITE_CONFIG.contactEmail ? "This opens a draft in your email app; you choose whether to send it." : "Submissions aren't connected yet, but you can copy a request draft. Nothing is automatically sent or saved."}</p>
          <div class="field"><label for="request-chapter">Organization</label><select id="request-chapter" data-request-chapter><option value="">Select a chapter</option>${CHAPTERS.map(ch => `<option value="${escapeAttr(ch.id)}" ${requested === ch.id ? "selected" : ""}>${escapeHTML(ch.name)}</option>`).join("")}</select></div>
          <div class="field"><label for="request-kind">Request type</label><select id="request-kind" data-request-kind><option>Update listing information</option><option>Add or correct chapter website</option><option>Discuss future event submissions</option><option>Help with an independent chapter website</option></select></div>
          <div class="field"><label for="request-details">Details</label><textarea id="request-details" data-request-details placeholder="What should be added or corrected? Include a source or link if available."></textarea></div>
          <button class="btn btn-primary" type="button" data-request-copy>${SITE_CONFIG.contactEmail ? "Open Email Draft ↗" : "Copy Request Draft →"}</button>
          <p class="form-note">${SITE_CONFIG.contactEmail ? "Your email app will open with a prepared message. No request is sent until you send it." : "This is not a live submission form. A contact channel will be added before requests are accepted."}</p>
          <p class="form-feedback" id="request-feedback" role="status" aria-live="polite"></p>
        </div>
      </div></section>`;
  }

  function notFoundPage() {
    return `<section class="page-hero"><div class="container"><div class="red-rule"></div><h1>Page not found</h1><p>We couldn't find that page.</p><div style="margin-top:30px"><a class="btn btn-primary" href="#/">Back to Home →</a></div></div></section>`;
  }

  function render() {
    const path = currentPath();
    const routeChanged = path !== state.currentRoute;
    if (path === "/directory" && routeChanged) {
      const params = routeParams();
      state.directory = {
        search: "",
        type: ["Fraternity", "Sorority"].includes(params.get("type")) ? params.get("type") : "",
        council: COUNCILS.some(c => c.id === params.get("council")) ? params.get("council") : "",
      };
    }
    state.currentRoute = path;
    let content;
    let title;
    if (path === "/") { content = homePage(); title = "Find Your Community"; }
    else if (path === "/directory") { content = directoryPage(); title = "Organization Directory"; }
    else if (path.startsWith("/chapter/")) {
      const chapter = CHAPTERS.find(c => c.id === path.slice("/chapter/".length));
      content = chapter ? profilePage(chapter) : notFoundPage(); title = chapter ? chapter.name : "Page Not Found";
    }
    else if (path === "/calendar") { content = calendarPage(); title = "Event Calendar"; }
    else if (path === "/for-chapters") { content = forChaptersPage(); title = "For Chapters"; }
    else { content = notFoundPage(); title = "Page Not Found"; }
    app.innerHTML = `${header(path)}<main id="main" tabindex="-1">${content}</main>${footer()}`;
    document.title = `${title} | Northeastern Greek`;
    if (path === "/directory") updateDirectoryResults();
    if (path === "/calendar") updateCalendarView();
    if (routeChanged) window.scrollTo(0, 0);
  }

  function openEventModal(eventId) {
    const event = DEMO_EVENTS.find(e => e.id === eventId);
    if (!event) return;
    closeEventModal();
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.id = "event-modal";
    modal.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
      <button type="button" class="modal-close" data-close-modal aria-label="Close event details">×</button>
      <span class="pill ${["Community", "Philanthropy"].includes(event.category) ? "red" : ""}">${escapeHTML(event.category)}</span>
      <div class="red-rule"></div><h2 id="event-modal-title">${escapeHTML(event.title)}</h2>
      <div class="modal-detail"><strong>Date</strong><span>${escapeHTML(formatFullDate(event.date))}</span></div>
      <div class="modal-detail"><strong>Time</strong><span>${escapeHTML(event.time)}</span></div>
      <div class="modal-detail"><strong>Location</strong><span>${escapeHTML(event.location)}</span></div>
      <div class="modal-detail"><strong>Chapter</strong><span>${escapeHTML(event.host)}</span></div>
      <p class="modal-description">${escapeHTML(event.description)}</p>
      <p class="modal-disclaimer">This is a fictional prototype event. It does not represent a real scheduled activity.</p>
    </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeEventModal() {
    document.getElementById("event-modal")?.remove();
    document.body.style.overflow = "";
  }

  async function copyRequestDraft() {
    const id = document.getElementById("request-chapter")?.value || "";
    const chapter = CHAPTERS.find(c => c.id === id);
    const kind = document.getElementById("request-kind")?.value || "Update listing information";
    const details = document.getElementById("request-details")?.value.trim() || "(No additional details provided)";
    const feedback = document.getElementById("request-feedback");
    const message = `Northeastern Greek listing request\n\nChapter: ${chapter?.name || "Not selected"}\nRequest: ${kind}\nDetails: ${details}\n\nPlease verify any changes before publishing.`;
    if (SITE_CONFIG.contactEmail) {
      const subject = `Northeastern Greek: ${kind}${chapter ? ` — ${chapter.name}` : ""}`;
      window.location.href = `mailto:${encodeURIComponent(SITE_CONFIG.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      feedback.textContent = "Your email app should open. Review and send the message there.";
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(message);
      else {
        const field = document.createElement("textarea");
        field.value = message; field.style.position = "fixed"; field.style.opacity = "0";
        document.body.appendChild(field); field.select();
        const copied = document.execCommand("copy"); field.remove();
        if (!copied) throw new Error("Copy unavailable");
      }
      feedback.textContent = "Request draft copied. This has not been submitted or sent.";
    } catch {
      feedback.textContent = "Automatic copying is unavailable in this browser. Please copy your details manually; no request has been submitted.";
    }
  }

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-directory-search]")) {
      state.directory.search = event.target.value;
      updateDirectoryResults();
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-skip]")) { event.preventDefault(); document.getElementById("main")?.focus(); return; }
    const menu = event.target.closest("[data-mobile-toggle]");
    if (menu) {
      const nav = document.getElementById("mobile-navigation");
      nav.hidden = !nav.hidden;
      menu.setAttribute("aria-expanded", String(!nav.hidden));
      return;
    }
    const type = event.target.closest("[data-filter-type]");
    if (type) { const value = type.dataset.filterType; state.directory.type = state.directory.type === value ? "" : value; render(); return; }
    const council = event.target.closest("[data-filter-council]");
    if (council) { const value = council.dataset.filterCouncil; state.directory.council = state.directory.council === value ? "" : value; render(); return; }
    if (event.target.closest("[data-filter-clear]")) { state.directory = { search: "", type: "", council: "" }; render(); return; }
    const nav = event.target.closest("[data-calendar-nav]");
    if (nav) { state.calendar.month = new Date(state.calendar.month.getFullYear(), state.calendar.month.getMonth() + Number(nav.dataset.calendarNav), 1); render(); return; }
    if (event.target.closest("[data-calendar-today]")) { state.calendar.month = new Date(today.getFullYear(), today.getMonth(), 1); render(); return; }
    const view = event.target.closest("[data-calendar-view]");
    if (view) { state.calendar.view = view.dataset.calendarView; render(); return; }
    const category = event.target.closest("[data-event-category]");
    if (category) { state.calendar.category = category.dataset.eventCategory; render(); return; }
    const eventButton = event.target.closest("[data-event-id]");
    if (eventButton) { openEventModal(eventButton.dataset.eventId); return; }
    if (event.target.closest("[data-close-modal]") || event.target.classList.contains("modal-backdrop")) { closeEventModal(); return; }
    if (event.target.closest("[data-request-copy]")) { copyRequestDraft(); return; }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeEventModal();
  });

  window.addEventListener("hashchange", () => { closeEventModal(); render(); });
  render();
})();
