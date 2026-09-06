# Fix .ts files in app/ that weren't processed (PowerShell 5.1 has no -Raw, no -NoNewline)
$files = Get-ChildItem -Path 'frontend/src/app' -Recurse -Include *.ts
Write-Host "Processing $($files.Count) .ts files"

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $new = $content

  # Relative depth: app/<route>/page.tsx -> ../lib/ or ../../lib/ -> @lib/
  $new = $new.Replace("from '../../../lib/",  "from '@lib/")
  $new = $new.Replace("from '../../lib/",     "from '@lib/")
  $new = $new.Replace("from '../lib/",        "from '@lib/")
  $new = $new.Replace("from '../../../utils/", "from '@/utils/")
  $new = $new.Replace("from '../../utils/",    "from '@/utils/")
  $new = $new.Replace("from '../utils/",       "from '@/utils/")
  $new = $new.Replace("from '../../../context/", "from '@/context/")
  $new = $new.Replace("from '../../context/",    "from '@/context/")
  $new = $new.Replace("from '../context/",       "from '@/context/")
  $new = $new.Replace("from '../../../providers/", "from '@/providers/")
  $new = $new.Replace("from '../../providers/",    "from '@/providers/")
  $new = $new.Replace("from '../providers/",       "from '@/providers/")

  if ($new -ne $content) {
    [System.IO.File]::WriteAllText($file.FullName, $new)
    Write-Host "Updated: $($file.FullName.Replace('frontend/src/', ''))"
  }
}
Write-Host "Done"