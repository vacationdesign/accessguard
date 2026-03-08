@echo off
cd /d C:\Users\g5501\dev\accessguard
claude -p "Read the file .claude/seo-monitor.md and execute all the tasks described in it. This is a scheduled SEO monitoring run." --allowedTools "Bash,Read,Write,Edit,Glob,Grep,Task,WebSearch,WebFetch" 2>&1 >> ".claude\seo-reports\run-%date:~0,4%%date:~5,2%%date:~8,2%.log"
