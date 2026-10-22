# AirPulse+ — AI-Powered Contactless Vital Sign Monitoring Using WiFi CSI

A runnable academic **software-only demo website** for presenting the proposed AirPulse+ monitoring workflow.

## Important project limitation
This prototype uses generated sample people, vital readings, confidence values, signal traces, risk categories, and alerts. It **does not acquire actual WiFi Channel State Information (CSI)** and does not measure real heart rate, breathing rate, falls, or medical risk. It is not a clinically validated medical device and must not be used for real monitoring or emergency decisions.

## Features
- Responsive dashboard with summary metrics and risk distribution
- Four fictional demo profiles with changing readings
- Pose selector (standing, sitting, lying, walking, fallen) with illustrative CSS avatar
- Scenario simulator: normal, extended inactivity, irregular pattern, and fall-like event
- Synthetic signal visualization and conceptual CSI processing pipeline
- Trend charts, alert history, alert acknowledgement, filtering, and reset
- Express backend REST API; demo state saved to `data/state.json`

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- Internet connection for Google Fonts and Chart.js CDN. Dashboard API itself runs locally.

## Run on Windows
1. Extract `AirPulsePlus.zip`.
2. Open the extracted `AirPulsePlus` folder in VS Code.
3. Open Terminal → New Terminal.
4. Check Node is installed:
   ```bash
   node -v
   npm -v
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the website:
   ```bash
   npm start
   ```
7. Open **http://localhost:3000** in your browser.

Keep the terminal running while using the website. Press `Ctrl+C` to stop the server.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server health and simulation mode |
| GET | `/api/people` | List demo profiles |
| GET | `/api/people/:id` | One demo profile |
| GET | `/api/alerts` | Alert history |
| GET | `/api/history` | Recent simulated readings |
| POST | `/api/simulate` | Generate a demo reading and possible alert |
| POST | `/api/alerts/:id/acknowledge` | Acknowledge an alert |
| POST | `/api/reset` | Restore starter demo data |

Example scenario request:
```json
{
  "personId": "P004",
  "scenario": "fall",
  "pose": "Fallen"
}
```

Allowed scenario values: `normal`, `inactivity`, `irregular`, `fall`.

## Folder structure
```text
AirPulsePlus/
├── server.js
├── package.json
├── README.md
├── data/
│   └── state.json
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

## Academic demonstration flow
1. Open Overview and explain the simulation notice.
2. Review the fictional profiles and summary charts.
3. Open People & poses, choose a person, and change pose/scenario.
4. Run **Fall-like event** to generate a CRITICAL demonstration alert.
5. Open Alert history and acknowledge the alert.
6. Open Signal lab to show the synthetic signal and proposed processing stages.
7. Explain future work: compatible CSI acquisition, preprocessing, model training, validation against reference instruments, cross-environment testing, privacy-preserving processing, and alert-performance evaluation.

## Troubleshooting
- **`npm` is not recognized:** install Node.js 20 LTS, restart VS Code, then retry.
- **Port 3000 is busy:** in Windows CMD run `set PORT=3001` then `npm start`; open `http://localhost:3001`.
- **Charts do not load:** check internet access because Chart.js is loaded from a CDN.
- **API fails:** make sure `npm start` is running and open the site through `http://localhost:3000`, not by double-clicking `index.html`.
- **Reset demo data:** use “Reset demo data” in the sidebar. Scenario-generated history is stored locally in `data/state.json`.
