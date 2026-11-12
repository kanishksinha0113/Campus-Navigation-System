$pptApp = New-Object -ComObject PowerPoint.Application
Write-Host "PowerPoint COM active. Version:" $pptApp.Version

$filePath = "C:\Users\Kanishk Sinha\OneDrive\Documents\CampusNav3D\Campus_Navigation_System_Kanishk_Sinha.pptx"
$outDir = "C:\Users\Kanishk Sinha\OneDrive\Documents\CampusNav3D\slide_previews"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$presentation = $pptApp.Presentations.Open($filePath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
Write-Host "Slides count:" $presentation.Slides.Count

for ($i = 1; $i -le $presentation.Slides.Count; $i++) {
    $slide = $presentation.Slides.Item($i)
    $exportPath = Join-Path $outDir "Slide_$i.png"
    $slide.Export($exportPath, "PNG", 1920, 1080)
    Write-Host "Exported Slide $i to $exportPath"
}

$presentation.Close()
$pptApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
Write-Host "DONE_EXPORTING"
