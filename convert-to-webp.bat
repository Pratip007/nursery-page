@echo off
echo Converting JPG images to WebP format...
echo This will create WebP versions alongside your JPG files.
echo.

cd images\outdoor-plants

for %%f in (*.jpg) do (
    echo Converting %%f to WebP...
    
    REM You'll need to install cwebp.exe first
    REM Download from: https://developers.google.com/speed/webp/download
    
    if exist "C:\Program Files\WebP\bin\cwebp.exe" (
        "C:\Program Files\WebP\bin\cwebp.exe" -q 80 "%%f" -o "%%~nf.webp"
    ) else if exist "cwebp.exe" (
        cwebp.exe -q 80 "%%f" -o "%%~nf.webp"
    ) else (
        echo Error: cwebp.exe not found!
        echo Please download WebP tools from: https://developers.google.com/speed/webp/download
        echo And either:
        echo 1. Install to C:\Program Files\WebP\bin\
        echo 2. Copy cwebp.exe to this folder
        pause
        exit /b 1
    )
)

echo.
echo Conversion complete!
echo WebP files have been created alongside your JPG files.
pause 