# Bulk rewrite relative imports inside modules/ files after Phase 4 move.
# All source files under frontend/src/modules/**/*.tsx

$ErrorActionPreference = 'SilentlyContinue'
$moduleFiles = Get-ChildItem -Path 'frontend/src/modules' -Recurse -Include *.tsx, *.ts
Write-Host "Found $($moduleFiles.Count) module files"

# Order matters: longer / more-specific patterns first
$replacements = @(
  # Cross-folder imports — use absolute aliases (@/ points to src/)
  @{ From = "from '../../types'";           To = "from '@/types'" },
  @{ From = "from '../../data/presets'";    To = "from '@/data/presets'" },
  @{ From = "from '../../utils/pricing'";   To = "from '@/utils/pricing'" },
  @{ From = "from '../../utils/gtm'";       To = "from '@/utils/gtm'" },
  @{ From = "from '../../utils/seoUtils'";  To = "from '@/utils/seoUtils'" },
  @{ From = "from '../../utils/productRating'"; To = "from '@/utils/productRating'" },
  @{ From = "from '../../utils/productUtils'";  To = "from '@/utils/productUtils'" },
  @{ From = "from '../../utils/safeStorage'";  To = "from '@/utils/safeStorage'" },
  @{ From = "from '../../context/StoreContext'"; To = "from '@/context/StoreContext'" },
  @{ From = "from '../../lib/sdk'";         To = "from '@lib/sdk'" },
  @{ From = "from '../../lib/data/products'"; To = "from '@lib/data/products'" },
  @{ From = "from '../../lib/data/categories'"; To = "from '@lib/data/categories'" },
  @{ From = "from '../../lib/data/collections'"; To = "from '@lib/data/collections'" },
  @{ From = "from '../../lib/data/regions'"; To = "from '@lib/data/regions'" },
  @{ From = "from '../../lib/data/carts'";  To = "from '@lib/data/carts'" },
  @{ From = "from '../../lib/data/customers'"; To = "from '@lib/data/customers'" },
  @{ From = "from '../../lib/data/home'";   To = "from '@lib/data/home'" },
  @{ From = "from '../../lib/data/ai'";     To = "from '@lib/data/ai'" },
  @{ From = "from '../../lib/data/brands'"; To = "from '@lib/data/brands'" },
  @{ From = "from '../../lib/data'";        To = "from '@lib/data'" },

  # Old 'components/...' siblings (now in @modules/common)
  @{ From = "from '../ui/SafeImage'";       To = "from '@modules/common/components/safe-image'" },
  @{ From = "from '../ui/Toast'";           To = "from '@modules/common/components/toast'" },
  @{ From = "from '../ui/StockBadge'";      To = "from '@modules/common/components/stock-badge'" },
  @{ From = "from '../ui/ThemeToggle'";     To = "from '@modules/common/components/theme-toggle'" },
  @{ From = "from '../ui/ErrorBoundary'";   To = "from '@modules/common/components/error-boundary'" },
  @{ From = "from '../ui/CodeViewer'";      To = "from '@modules/common/components/code-viewer'" }
)

foreach ($file in $moduleFiles) {
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