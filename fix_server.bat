@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe

echo.
echo Cleaning Next.js cache...
if exist .next rmdir /s /q .next

echo.
echo Regenerating Prisma Client...
call npx prisma generate

echo.
echo Done! Please run 'npm run dev' to start the server again.
echo Done! Environment cleaned.
