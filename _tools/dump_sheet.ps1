param([string]$XlsxPath, [string]$SheetXmlName, [string]$OutPath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead($XlsxPath)

# --- sharedStrings: proper rich-text handling (concat all <t> per <si>) ---
$ssEntry = $z.GetEntry('xl/sharedStrings.xml')
$sr = New-Object IO.StreamReader($ssEntry.Open())
$ssRaw = $sr.ReadToEnd()
$sr.Close()
$strings = New-Object System.Collections.Generic.List[string]
$siMatches = [regex]::Matches($ssRaw, '<si>(.*?)</si>', 'Singleline')
foreach ($m in $siMatches) {
    $inner = $m.Groups[1].Value
    $ts = [regex]::Matches($inner, '<t[^>]*>(.*?)</t>', 'Singleline')
    $txt = ''
    foreach ($t in $ts) { $txt += $t.Groups[1].Value }
    $strings.Add([System.Net.WebUtility]::HtmlDecode($txt))
}

# --- target sheet ---
$e = $z.GetEntry('xl/worksheets/' + $SheetXmlName)
$r = New-Object IO.StreamReader($e.Open())
$xmlRaw = $r.ReadToEnd()
$r.Close()
$z.Dispose()

$sb = New-Object System.Text.StringBuilder
$rowMatches = [regex]::Matches($xmlRaw, '<row[^>]*r="(\d+)"[^>]*>(.*?)</row>', 'Singleline')
foreach ($rm in $rowMatches) {
    $rowNum = $rm.Groups[1].Value
    $cellMatches = [regex]::Matches($rm.Groups[2].Value, '<c\s+([^>]*?)>(.*?)</c>|<c\s+([^>]*?)/>', 'Singleline')
    foreach ($cm in $cellMatches) {
        if ($cm.Groups[3].Success) { continue } # empty self-closing cell
        $attrs = $cm.Groups[1].Value
        $inner = $cm.Groups[2].Value
        $refM = [regex]::Match($attrs, 'r="([A-Z]+\d+)"')
        $tM = [regex]::Match($attrs, 't="(\w+)"')
        $ref = $refM.Groups[1].Value
        $type = $tM.Groups[1].Value
        $fM = [regex]::Match($inner, '<f[^>]*>(.*?)</f>', 'Singleline')
        $vM = [regex]::Match($inner, '<v>(.*?)</v>', 'Singleline')
        $formula = ''
        $value = ''
        if ($fM.Success) { $formula = [System.Net.WebUtility]::HtmlDecode($fM.Groups[1].Value) }
        if ($vM.Success) {
            $rawV = $vM.Groups[1].Value
            if ($type -eq 's') {
                $idx = 0
                if ([int]::TryParse($rawV, [ref]$idx)) { $value = $strings[$idx] }
            } else {
                $value = $rawV
            }
        }
        if ($formula -ne '') { $value = "[F:$formula] $value" }
        if ($value.Trim() -ne '') {
            [void]$sb.AppendLine("R${rowNum} ${ref} = $value")
        }
    }
}
[System.IO.File]::WriteAllText($OutPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("DONE rows=" + $rowMatches.Count + " out=" + $OutPath)