@echo off
REM A11yScope daily monitoring launcher.
REM Triggered by Windows Task Scheduler at 07:00 local time.
REM Runs Claude with Opus 4.7 (1M context) and bypasses permission prompts
REM so the cron can complete unattended.
cd /d C:\Users\g5501\projects\a11yscope\a11yscope
claude --print ^
  --model opus ^
  --dangerously-skip-permissions ^
  "Read .claude/seo-monitor.md and execute the monitoring per spec. Default to Quick mode. Escalate to Standard only if a tripwire fires. Commit and push the resulting report." ^
  >> ".claude\seo-reports\run-%date:~0,4%%date:~5,2%%date:~8,2%.log" 2>&1
