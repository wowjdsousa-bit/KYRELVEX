# KYRELVEX Public Website V1

## Recommended production setup

**Website:** Cloudflare Pages  
**Free public URL:** `https://<project-name>.pages.dev`  
**Release files:** GitHub Releases on a public KYRELVEX repository

This combination was selected because the website can deploy automatically from GitHub,
while the Downloads section can read GitHub Releases directly. Publishing a new stable
release does **not** require editing or redeploying the website.

## One-time setup

1. Create a public GitHub repository for the KYRELVEX public project/releases.
2. In `config.js`, replace:
   - `githubOwner: "CHANGE_ME"`
   - `githubRepo: "CHANGE_ME"`
3. Put these website files in a public repository (it can be the same repository or a separate website repository).
4. In Cloudflare: Workers & Pages → Create → Pages → Connect to Git.
5. Select the website repository.
6. For this static site, use no framework/build command and set the output/root to the repository root.
7. Choose the Pages project name. If available, `kyrelvex` gives `kyrelvex.pages.dev`.

Project-name availability is not guaranteed; Cloudflare assigns the corresponding free
`pages.dev` subdomain to the Pages project.

## Publishing a new KYRELVEX update

1. Open the public KYRELVEX repository on GitHub.
2. Go to Releases → Draft a new release.
3. Create a version tag such as `v0.9.0`.
4. Add public release notes.
5. Attach the validated KYRELVEX `.zip`.
6. Publish as a normal release (not Draft; not Prerelease if it is the stable release).

The website's Downloads section will automatically read the new public release and show:
- version
- publish date
- release summary
- ZIP download button
- release history

## Stable-release safety

Draft releases are never shown. Prereleases may appear in history but are not selected
as the primary stable download. This helps prevent an internal candidate from being
presented as the public stable build.

## Later custom domain

A purchased custom domain can be attached to Cloudflare Pages later without rebuilding
the website. The free `pages.dev` URL can remain as a fallback.

## Files

- `index.html` — public site
- `styles.css` — responsive premium visual system
- `script.js` — automatic GitHub Releases integration
- `config.js` — public repository configuration
- `favicon.svg` — KYRELVEX favicon
- `_headers` — security headers for Cloudflare Pages
- `robots.txt` — search crawler policy
