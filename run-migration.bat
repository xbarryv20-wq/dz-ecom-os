@echo off
REM Run this to execute the database migration on your Supabase instance
REM Usage: run-migration.bat

echo ========================================
echo  DZ Ecom OS - Database Migration
echo ========================================
echo.
echo Please run the SQL migration manually:
echo.
echo 1. Go to: https://supabase.com/dashboard/project/bxjulwdhpqxvvuhzsepi/sql
echo 2. Click "New Query"
echo 3. Paste the contents of: supabase\migrations\001_initial_schema.sql
echo 4. Click "Run"
echo.
echo Then optionally run: supabase\seed.sql for demo data
echo.
pause
