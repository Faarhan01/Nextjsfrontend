# Normalize all relative imports in app/* to absolute @ aliases (Phase 4-C prep).
$files = Get-ChildItem -Path 'frontend/src/app' -Recurse -Include *.tsx, *.ts
Write-Host "Processing $($files.Count) app files"

# Map: from app/<route>/file.tsx, relative depths:
#  ../lib/data/X        -> @lib/data/X       (app/page.tsx, app/about/...)
#  ../../lib/data/X     -> @lib/data/X       (app/cart/page.tsx, app/account/...)
#  ../../../lib/data/X  -> @lib/data/X       (app/category/[slug]/page.tsx)
#  ../lib/data/X        already covered
#  ../utils/X           -> @/utils/X
#  ../../utils/X        -> @/utils/X
#  ../../../utils/X     -> @/utils/X
#  ../context/StoreContext -> @/context/StoreContext
#  ../../context/StoreContext -> @/context/StoreContext
#  ../../../context/StoreContext -> @/context/StoreContext
#  ../providers/app-providers -> @/providers/app-providers
#  ../providers/... -> @/providers/...
#  ../lib/sdk -> @lib/sdk

$replacements = @(
  @{ From = "from '../../../lib/";  To = "from '@lib/" },
  @{ From = "from '../../lib/";    To = "from '@lib/" },
  @{ From = "from '../lib/sdk'";   To = "from '@lib/sdk'" },
  @{ From = "from '../lib/data/";  To = "from '@lib/data/" },
  @{ From = "from '../lib/";        To = "from '@lib/" },

  @{ From = "from '../../../utils/"; To = "from '@/utils/" },
  @{ From = "from '../../utils/";    To = "from '@/utils/" },
  @{ From = "from '../utils/";        To = "from '@/utils/" },

  @{ From = "from '../../../context/"; To = "from '@/context/" },
  @{ From = "from '../../context/";    To = "from '@/context/" },
  @{ From = "from '../context/";        To = "from '@/context/" },

  @{ From = "from '../../../providers/"; To = "from '@/providers/" },
  @{ From = "from '../../providers/";    To = "from '@/providers/" },
  @{ From = "from '../providers/";       To = "from '@/providers/" },
  @{ From = "from '../context/StoreContext"; To = "from '@/context/StoreContext" },

  @{ From = "from '../not-found";  To = "from '@/app/not-found" }
)

foreach ($file in $files) {
  $orig = Get-Content $file.FullName -Raw
  $new = $orig
  foreach ($r in $replacements) {
    $new = $new.Replace($r.From, $r.To)
  }
  if ($new -ne $orig) {
    Set-Content -Path $file.FullName -Value $new -NoNewline
    Write-Host "Updated: $($file.FullName.Replace('frontend/src/', ''))"
  }
}
Write-Host "Done"