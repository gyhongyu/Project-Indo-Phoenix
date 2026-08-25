param([string]$Src, [string]$Out, [string]$Staging)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$s3 = [IO.File]::ReadAllText("$Staging\sheet3.xml")
$s4 = [IO.File]::ReadAllText("$Staging\sheet4.xml")

$utf8 = New-Object System.Text.UTF8Encoding($false)

if (Test-Path $Out) { Remove-Item $Out -Force }
$zin = [System.IO.Compression.ZipFile]::OpenRead($Src)
$zout = [System.IO.Compression.ZipFile]::Open($Out, 'Create')

function AddEntry([System.IO.Compression.ZipArchive]$z, [string]$name, [string]$content) {
    $e = $z.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
    $w = New-Object IO.StreamWriter($e.Open(), $utf8)
    $w.Write($content)
    $w.Close()
}

$replaceMap = @{
    'xl/workbook.xml' = {
        param($c)
        $c = $c.Replace('</sheets>', '<sheet state="visible" name="WEB_DATA" sheetId="3" r:id="rId7"/><sheet state="visible" name="WEB_TEXT" sheetId="4" r:id="rId8"/></sheets>')
        $c = $c.Replace('<calcPr/>', '<calcPr calcId="181029" fullCalcOnLoad="1"/>')
        return $c
    }
    'xl/_rels/workbook.xml.rels' = {
        param($c)
        $add = '<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/></Relationships>'
        return $c.Replace('</Relationships>', $add)
    }
    '[Content_Types].xml' = {
        param($c)
        $wt = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'
        $add = "<Override ContentType=`"$wt`" PartName=`"/xl/worksheets/sheet3.xml`"/><Override ContentType=`"$wt`" PartName=`"/xl/worksheets/sheet4.xml`"/></Types>"
        return $c.Replace('</Types>', $add)
    }
}

foreach ($entry in $zin.Entries) {
    $name = $entry.FullName
    if ($replaceMap.ContainsKey($name)) {
        $r = New-Object IO.StreamReader($entry.Open())
        $content = $r.ReadToEnd()
        $r.Close()
        $newContent = & $replaceMap[$name] $content
        AddEntry $zout $name $newContent
    } else {
        $ne = $zout.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
        $is = $entry.Open()
        $os = $ne.Open()
        $is.CopyTo($os)
        $os.Close()
        $is.Close()
    }
}
$zin.Dispose()

AddEntry $zout 'xl/worksheets/sheet3.xml' $s3
AddEntry $zout 'xl/worksheets/sheet4.xml' $s4
$zout.Dispose()
Write-Output "INJECTED OK -> $Out"