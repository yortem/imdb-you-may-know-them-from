# IMDB You May Know Them From

A Chrome extension that adds the "You Know Them From" section (like the one in the IMDB mobile app) to the desktop site whenever you visit an actor's IMDB page.

## Screenshot

![Screenshot](/screenshot.jpg)

## How it works

1. Visit any actor/actress page on IMDB (e.g. `/name/nm0002084/`)
2. IMDB already knows which titles you've rated and embeds your rating (`ipc-rating-star--currentUser`) right in the filmography
3. The extension automatically expands all collapsed accordion sections (like "Previous") and clicks any "See all" buttons to ensure all credits are loaded, then scans the page for credits with your ratings and builds a **"You Know Them From"** section at the top

No configuration needed. No external requests. Just works if you're logged into IMDB.

## Installation

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked** and select the `src/` folder

## Privacy

This extension only runs on `imdb.com` actor pages. It reads the page to find movies and shows you've rated, then displays them in a new section on the same page. It never sends data anywhere, never tracks you, and doesn't run on any other site.

---

*Not affiliated with, endorsed by, or connected to IMDB or Amazon.*
