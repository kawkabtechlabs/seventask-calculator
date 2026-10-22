$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Get-Location
$sourcePath = Join-Path $root 'icon-512.png'
$sourceFile = [Drawing.Bitmap]::FromFile($sourcePath)
$source = [Drawing.Bitmap]$sourceFile.Clone()
$sourceFile.Dispose()
try {
  foreach ($target in @(@{ Size = 192; Name = 'icon-192.png' }, @{ Size = 512; Name = 'icon-512.png' }, @{ Size = 180; Name = 'apple-touch-icon.png' })) {
    $size = [int]$target.Size
    $output = [Drawing.Bitmap]::new($size, $size, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [Drawing.Graphics]::FromImage($output)
      try {
        $graphics.Clear([Drawing.Color]::Transparent)
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $inset = [single]($size * 0.13)
        $extent = [single]($size * 0.74)
        $graphics.DrawImage($source, $inset, $inset, $extent, $extent)
      } finally { $graphics.Dispose() }
      $stream = [IO.MemoryStream]::new()
      try {
        $output.Save($stream, [Drawing.Imaging.ImageFormat]::Png)
        [IO.File]::WriteAllBytes((Join-Path $root ($target.Name + '.generated')), $stream.ToArray())
      } finally { $stream.Dispose() }
    } finally { $output.Dispose() }
  }
} finally { $source.Dispose() }
foreach ($name in @('icon-192.png', 'icon-512.png', 'apple-touch-icon.png')) {
  Move-Item -LiteralPath (Join-Path $root ($name + '.generated')) -Destination (Join-Path $root $name) -Force
}
Write-Output 'Created transparent PWA and Apple touch icons with the complete calculator outline inside the launcher safe area.'
