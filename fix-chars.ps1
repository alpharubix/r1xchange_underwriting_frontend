$files = Get-ChildItem -Path src -Include *.tsx, *.ts -Recurse -File
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content.Replace("â€¢", "•").Replace("â”€", "─").Replace("â† ", "←").Replace("â‚¹", "₹").Replace("Â©", "©").Replace("â€™", "’").Replace("â—Œ", "○")
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
    }
}
