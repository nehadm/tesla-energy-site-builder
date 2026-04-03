# ⚡ Tesla Energy Site Builder

A React-based web app for configuring Tesla battery site layouts. You can add batteries, see the layout in real-time, and it automatically calculates cost, energy capacity, land footprint, and how many transformers you need.

## 📋 What it does

- **Device Config**: Pick quantities of 4 battery types (XL, 2, regular, PowerPack)
- **Real-Time Calcs**: Automatically shows you cost, energy, land footprint, and transformer count
- **Visual Layout**: 2D site plan that respects the 100ft width limit
- **Save Sessions**: Uses localStorage so your config sticks around even after you restart
- **One command startup**: just run `npm start` and you're good
- **Runs on localhost:8000**: frontend is there

### Plus the cool stuff I added
- **Spacing validation**: Makes sure batteries aren't crashing into each other
  - 2ft between batteries
  - 1.5ft for transformer spacing
  - Real-time violation alerts
- **Grid background**: 10ft grid to help you visualize things
- **Jest tests**: spacingValidator tests for validation logic
- **Material-UI design**: because plain HTML is boring

## Project structure

Frontend has React components (SiteLayout, Sidebar, etc) and utilities for layout generation and validation. Backend is just Express serving a couple endpoints. Most of the heavy lifting is on the frontend.

## 🚀 Getting Started

You'll need Node.js 16+ and npm installed.

```bash
# Clone and run everything
git clone https://github.com/yourusername/tesla-energy-site-builder.git
cd tesla-energy-site-builder
npm start

# Or if that doesn't work, run them separately:
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev
```

Then go to http://localhost:8000

## How to use it

1. Enter how many of each battery you want in the sidebar
2. Check the cards on top - they show you cost, energy, and land footprint
3. The layout shows up below with a grid overlay
4. If batteries are overlapping or too close, you'll see a warning
5. Your config auto-saves so you can come back to it later

## 📊 Devices

- **Megapack XL**: 40×10 ft, 4 MWh, $120k
- **Megapack 2**: 30×10 ft, 3 MWh, $80k  
- **Megapack**: 30×10 ft, 2 MWh, $50k
- **PowerPack**: 10×10 ft, 1 MWh, $10k
- **Transformer**: 10×10 ft, required (1 per 2 batteries)

## Layout Algorithm

Basically the algorithm:
- Keeps everything under 100ft width (sites can't be wider)
- Wraps units to new rows if they don't fit
- Automatically adds 1 transformer for every 2 batteries
- Enforces spacing (2ft between batteries, 1.5ft for transformers)
- Taller units determine row heights

Example layout (2 XL + 2 regular + 1 PowerPack):
```
Row 1: [XL 40×10] [2ft gap] [XL 40×10]
Row 2: [2 30×10] [2ft gap] [2 30×10]
Row 3: [PP 10×10] [Transformer] [Transformer]

Cost: ~$400k, Energy: 13.5 MWh
```

## Session Persistence

Your config syncs to the backend via `/api/layout` so it persists across devices. localStorage acts as a backup so you still have your config if the backend is down.

## Testing

```bash
cd frontend
npm test
```

I have Jest set up with tests for the spacing validator and layout logic. You can run them with watch mode too if you want:
```bash
npm test -- --watch
```

## Tech Stack

- React 18 for the UI
- Material-UI v5 (looks nicer than vanilla CSS)
- Vite for building (it's fast)
- Node/Express backend
- Jest for testing
- localStorage for persistence
- Frontend on 8000, backend on 5001

## Design

- Dark/light Material Design theme
- 10ft grid background so you can see spacing
- Real-time alerts when things are too close
- Works on desktop and mobile
- Icons for batteries and transformers

## Requirements

✅ Device input - sidebar  
✅ Real-time calcs - instant updates  
✅ Auto layout - 100ft constraint  
✅ Transformer ratio - 1:2 automatic  
✅ Save/resume - localStorage  
✅ Single startup - `npm start`  
✅ Port 8000 - frontend runs there  
✅ Testing - Jest configured  
✅ Plus spacing validation and nice UI

## Deployment

For moving this to production:

**Frontend**: build with `npm run build` in frontend folder, deploy the dist/ to Vercel or Netlify

**Backend**: can push to Heroku, Railway, or wherever

Make sure to set `VITE_API_URL` env var pointing to your backend

## What's in this version

- All the main requirements
- Spacing validation that actually works
- Jest tests
- Material-UI design (looks decent)
- Session persistence
- Real-time calculations

## Extra stuff I added

**Spacing validation** - it actually knows when batteries are too close and warns you

**Grid overlay** - helps you visualize the 10ft spacing

**Tests** - spacing validator has actual tests

**Better UI** - Material Design looks way better than plain CSS

## Troubleshooting

**Port 8000 in use?** 
Run `lsof -i :8000` to find the PID and kill it

**Backend not working?**  
Make sure it's running on 5001

**Config not saving?**  
Don't use incognito mode, localStorage won't work

**Layout looks weird?**  
Try clearing cache and reloading

## Files

- [SiteLayout.js](frontend/src/components/SiteLayout.js) - main visualization
- [SiteLayoutFooter.jsx](frontend/src/components/SiteLayoutFooter.jsx) - spacing rules footer
- [Sidebar.js](frontend/src/components/Sidebar.js) - input form
- [SiteLayoutInfoCards.js](frontend/src/components/SiteLayoutInfoCards.js) - metrics
- [generateLayout.js](frontend/src/utils/generateLayout.js) - layout algorithm
- [spacingValidator.js](frontend/src/utils/spacingValidator.js) - validation logic
- [spacingValidator.test.js](frontend/src/utils/spacingValidator.test.js) - Tests
- [calculateTotals.js](frontend/src/utils/calculateTotals.js) - Calculations
- [constants.js](frontend/src/utils/constants.js) - Device specs

### Documentation
- [SPACING_RULES.md](SPACING_RULES.md) - Spacing details

## Adding stuff

If you want to extend this:
- Add battery types in `constants.js`
- Change spacing rules in `generateLayout.js`  
- Add tests to `spacingValidator.test.js`
- New components go in `components/`

## Notes

- Check [SPACING_RULES.md](SPACING_RULES.md) for the spacing logic details
- Tests are in [spacingValidator.test.js](frontend/src/utils/spacingValidator.test.js)
- Device specs are in [constants.js](frontend/src/utils/constants.js)

