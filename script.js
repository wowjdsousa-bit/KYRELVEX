
const cfg = window.KYRELVEX_CONFIG || {};
document.getElementById("year").textContent = new Date().getFullYear();

const statusEl = document.getElementById("releaseStatus");
const latestEl = document.getElementById("latestRelease");
const noReleaseEl = document.getElementById("noRelease");
const historyEl = document.getElementById("releaseHistory");
const listEl = document.getElementById("releaseList");

function fmtDate(value){
  return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"2-digit"}).format(new Date(value));
}

function cleanBody(body){
  if(!body) return "Stable KYRELVEX release.";
  return body
    .replace(/```[\s\S]*?```/g,"")
    .replace(/[#>*_`~-]/g," ")
    .replace(/\[(.*?)\]\(.*?\)/g,"$1")
    .replace(/\s+/g," ")
    .trim()
    .slice(0,360);
}

function preferredAsset(release){
  const assets = release.assets || [];
  const matcher = cfg.preferredAssetPattern || /\.zip$/i;
  return assets.find(a => matcher.test(a.name)) || assets[0] || null;
}

function showPending(message){
  statusEl.hidden = true;
  latestEl.hidden = true;
  historyEl.hidden = true;
  noReleaseEl.hidden = false;
  if(message) noReleaseEl.querySelector("p").textContent = message;
}

async function loadReleases(){
  if(!cfg.githubOwner || !cfg.githubRepo || cfg.githubOwner === "CHANGE_ME" || cfg.githubRepo === "CHANGE_ME"){
    showPending("The website release channel is ready. Connect the public GitHub Releases repository in config.js and every published KYRELVEX release will appear here automatically.");
    return;
  }

  try{
    const url = `https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.githubRepo)}/releases?per_page=${Math.max(10,cfg.maxReleaseHistory||8)}`;
    const res = await fetch(url,{headers:{"Accept":"application/vnd.github+json"}});
    if(!res.ok) throw new Error(`GitHub API ${res.status}`);
    const releases = (await res.json()).filter(r => !r.draft);
    const stable = releases.find(r => !r.prerelease);

    statusEl.hidden = true;

    if(!stable){
      showPending("No public stable KYRELVEX release has been published yet. Drafts and prereleases are intentionally not presented as the main stable download.");
      return;
    }

    const asset = preferredAsset(stable);
    document.getElementById("latestName").textContent = stable.name || stable.tag_name || "KYRELVEX";
    document.getElementById("latestVersion").textContent = stable.tag_name || "—";
    document.getElementById("latestDate").textContent = fmtDate(stable.published_at || stable.created_at);
    document.getElementById("latestDescription").textContent = cleanBody(stable.body);
    const download = document.getElementById("downloadButton");
    download.href = asset ? asset.browser_download_url : stable.html_url;
    download.textContent = asset ? `Download ${asset.name}` : "Open release";
    document.getElementById("releaseNotesButton").href = stable.html_url;
    latestEl.hidden = false;

    const history = releases.slice(0,cfg.maxReleaseHistory||8);
    listEl.innerHTML = "";
    history.forEach(r => {
      const a = preferredAsset(r);
      const row = document.createElement("div");
      row.className = "release-item";
      row.innerHTML = `
        <b>${r.tag_name || r.name || "Release"}</b>
        <span>${fmtDate(r.published_at || r.created_at)}${r.prerelease ? " · PRE-RELEASE" : ""}</span>
        <a href="${a ? a.browser_download_url : r.html_url}" target="_blank" rel="noopener">${a ? "Download" : "Notes"}</a>`;
      listEl.appendChild(row);
    });
    historyEl.hidden = history.length === 0;
  }catch(err){
    console.error(err);
    showPending("The public release service could not be reached right now. The website remains available; release information will return automatically when GitHub is reachable.");
  }
}
loadReleases();
