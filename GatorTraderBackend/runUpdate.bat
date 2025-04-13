@echo on
cd %~dp0
python dailyUpdate.py >> chronlog.txt 2>&1
pause