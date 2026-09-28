# Servidor estático mínimo para previsualizar la aventura sin instalar nada.
param([int]$Puerto = 8123)
$raiz = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tipos = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="application/javascript; charset=utf-8";
            ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".webp"="image/webp"; ".gif"="image/gif";
            ".mp3"="audio/mpeg"; ".ogg"="audio/ogg"; ".wav"="audio/wav"; ".json"="application/json"; ".svg"="image/svg+xml" }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Puerto/")
$l.Start()
Write-Host "Sirviendo $raiz en http://localhost:$Puerto/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $ruta = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($ruta -eq "/") { $ruta = "/index.html" }
  $archivo = Join-Path $raiz ($ruta.TrimStart("/") -replace "/", "\")
  $res = $ctx.Response
  if ((Test-Path $archivo -PathType Leaf) -and ([IO.Path]::GetFullPath($archivo)).StartsWith($raiz)) {
    $ext = [IO.Path]::GetExtension($archivo).ToLower()
    $res.ContentType = if ($tipos[$ext]) { $tipos[$ext] } else { "application/octet-stream" }
    $bytes = [IO.File]::ReadAllBytes($archivo)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
  }
  $res.Close()
}
